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
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    tileSize: number = 64;
    canvasWidth: number = 832;
    canvasHeight: number = 1344;
    composedImage;
    tiles = [];

    currentCharacter: iCharacter;

    //sync functions
    clearCanvas() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    createCanvas(customparams?: {
        width: number;
        height: number;
        tilesize: number;
    }) {
        this.canvas = this.renderer.createElement("canvas");
        this.canvas.id = "canvas";
        customparams
            ? (this.canvas.width = customparams.width)
            : (this.canvas.width = this.canvasWidth);
        customparams
            ? (this.canvas.height = customparams.height)
            : (this.canvas.height = this.canvasHeight);
        customparams
            ? (this.tileSize = customparams.tilesize)
            : (this.tileSize = this.tileSize);
        this.container.nativeElement.appendChild(this.canvas);
    }

    //async functions
    async buildCharacter() {
        this.clearCanvas();
        const body_type = this.currentCharacter.bodyType;
        const character = this.currentCharacter.sheetDefinitions.sort((a, b) =>
            a.layer_1.zPos > b.layer_1.zPos ? 1 : -1
        );

        // Define an array of layer names
        const layerNames = [
            "layer_1",
            "layer_2",
            "layer_3",
            "layer_4",
            "layer_5",
            "layer_6",
            "layer_7",
            "layer_8",
        ];

        const layers = await Promise.all(
            character.map(async (sheet: iSheetDefinition) => {
                let prefix = "";

                // Iterate through layer names
                for (const layerName of layerNames) {
                    const layer = sheet[layerName];

                    if (layer && layer[body_type]) {
                        prefix = "/" + layer[body_type] + "/";
                        break; // Exit the loop when a valid prefix is found
                    }
                }

                if (prefix !== "") {
                    const url = `http://localhost:3000/static/spritesheets/${
                        prefix + sheet.variants[0].replace(" ", "_") + ".png"
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
        // fix cors issue by converting to base64
        this.composedImage.src = this.canvas.toDataURL("image/png");
        this.sliceAndDice(this.composedImage);
    }

    sliceAndDice(image: HTMLImageElement) {
        for (let x = 0; x < this.canvasHeight; x += this.tileSize) {
            for (let y = 0; y < this.canvasWidth; y += this.tileSize) {
                const tileCanvas = this.renderer.createElement("canvas");
                tileCanvas.width = this.tileSize;
                tileCanvas.height = this.tileSize;
                const tileCtx = tileCanvas.getContext("2d");
                tileCtx.drawImage(
                    this.composedImage,
                    x,
                    y,
                    this.tileSize,
                    this.tileSize,
                    0,
                    0,
                    this.tileSize,
                    this.tileSize
                );
                this.tiles.push(tileCanvas.toDataURL("image/png"));
            }
        }
        this.tiles.forEach((tile) => {
            console.log(tile);
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
