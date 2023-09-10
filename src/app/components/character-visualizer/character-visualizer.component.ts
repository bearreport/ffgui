import { Component, OnInit } from "@angular/core";
import { iCharacter } from "src/app/classes/icharacter";
import { CharacterProxyService } from "src/app/services/character-proxy-service";
import { Renderer2, ViewChild, ElementRef } from "@angular/core";

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

    async buildCharacter() {
        this.clearCanvas();
        console.log(this.currentCharacter.sheetDefinitions);
        const layers = await Promise.all(
            this.currentCharacter.sheetDefinitions.map(async (sheet) => {
                console.log(sheet);
                const prefix = sheet.layer_1.male;

                if (prefix === undefined) {
                    console.error(
                        "Prefix is undefined. Check your data structure."
                    );
                    return null; // Skip this image and continue with the next one
                }

                const url = `http://localhost:3000/static/spritesheets/${
                    prefix + sheet.variants[0] + ".png"
                }`;
                console.log("URL:", url);

                const img = new Image();

                img.src = url;

                await new Promise((res) => {
                    img.onload = () => res("loaded");
                });

                return img;
            })
        );

        // Filter out any null values that were skipped due to undefined prefix
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
            }
        });
    }

    constructor(
        private characterProxyService: CharacterProxyService,
        private renderer: Renderer2
    ) {}
}
