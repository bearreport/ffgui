import { Component, OnInit } from "@angular/core";
import { iCharacter } from "src/app/classes/icharacter";
import { CharacterProxyService } from "src/app/services/character-proxy-service";
import { Renderer2, ViewChild, ElementRef } from "@angular/core";
import { iSheetDefinition, Layer } from "src/app/classes/isheetdefinition";

@Component({
    selector: "app-character-visualizer",
    templateUrl: "./character-visualizer.component.html",
    styleUrls: ["./character-visualizer.component.scss"],
})
export class CharacterVisualizerComponent implements OnInit {
    @ViewChild("container", { static: true }) container: ElementRef;
    currentCharacter: iCharacter | null;
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;

    //sync functions
    clearCanvas() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    createCanvas() {
        this.canvas = this.renderer.createElement("canvas");
        this.canvas.id = "canvas";
        this.canvas.width = 832;
        this.canvas.height = 1344;

        this.container.nativeElement.appendChild(this.canvas);
    }

    //async functions
    async buildCharacter() {
        this.clearCanvas();
        const body_type = this.currentCharacter.bodyType;
        const character = this.currentCharacter.sheetDefinitions.sort((a, b) =>
            a.layer_1.zPos > b.layer_1.zPos ? 1 : -1
        );
        const layers = await Promise.all(
            character.map(async (sheet: iSheetDefinition) => {
                const layer = sheet.layer_1;
                let prefix = "";
                if (layer[body_type.toString()]) {
                    prefix = "/" + layer[body_type.toString()] + "/";
                }

                if (prefix !== "") {
                    const url = `http://localhost:3000/static/spritesheets/${
                        prefix + sheet.variants[0] + ".png"
                    }`;

                    const img = new Image();

                    img.src = url;

                    await new Promise((res) => {
                        img.onload = () => res("loaded");
                    });

                    return img;
                } else {
                    return new Image();
                }
            })
        );

        const validLayers = layers.filter((layer) => layer !== null);

        validLayers.forEach((layer) => {
            this.ctx.drawImage(layer, 0, 0);
        });
    }

    ngOnInit(): void {
        this.createCanvas();
        this.ctx = this.canvas.getContext("2d");

        this.characterProxyService.sharedCharacter$.subscribe((character) => {
            if (character !== null) {
                this.currentCharacter = character;
                this.buildCharacter();
            } else {
                this.clearCanvas();
            }
        });
    }

    constructor(
        private characterProxyService: CharacterProxyService,
        private renderer: Renderer2
    ) {}
}
