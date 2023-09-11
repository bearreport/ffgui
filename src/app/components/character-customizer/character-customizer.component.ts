import { Component, EventEmitter, Output } from "@angular/core";
import { Subscription, finalize } from "rxjs";

import { iCharacter } from "src/app/classes/icharacter";
import { iSheetDefinition } from "src/app/classes/isheetdefinition";

import { CharacterCustomizerService } from "src/app/services/character-customizer-service";
import { CharacterProxyService } from "src/app/services/character-proxy-service";
import { UnityService } from "src/app/services/unity.service";

@Component({
    selector: "app-character-customizer",
    templateUrl: "./character-customizer.component.html",
    styleUrls: [
        "./character-customizer.component.scss",
        "../../app.component.scss",
    ],
})
export class CharacterCustomizerComponent {
    sheetDefinitionSubscription?: Subscription;
    sheet_definitions = [];
    available_sheet_definitions = [];
    selectedSheet: iSheetDefinition;
    currentSd: iSheetDefinition[] = [];
    filteredSheets: iSheetDefinition[] = [];
    filterValue = "";

    body_type = "male";
    body_types = [];
    currentCharacter: iCharacter | null;

    sheetDefinitionObserver = {
        next: (data) => {
            return (this.sheet_definitions = data);
        },
        error: (err: any) => console.error(err),
        complete: () => {
            return this.sheet_definitions;
        },
    };

    //sync functions

    addSheetDefinition(sheet: iSheetDefinition, variant: string) {
        const sheetCopy: iSheetDefinition = JSON.parse(JSON.stringify(sheet));
        sheetCopy.variants = [variant];
        const body_type = this.body_type;

        if (this.characterProxyService.sharedCharacter$ != undefined) {
            this.currentSd.forEach((sd, index) => {
                if (sd.type_name == sheetCopy.type_name) {
                    this.currentSd.splice(index, 1);
                }
            });
        }
        this.currentSd.push(sheetCopy);

        const sheets = this.currentSd;
        const character: iCharacter = {
            sheetDefinitions: sheets,
            bodyType: body_type,
        };
        this.characterProxyService.updateCharacter(character);

        this.available_sheet_definitions =
            this.available_sheet_definitions.filter((x) =>
                x.layer_1[this.body_type] !== null &&
                x.layer_1[this.body_type] !== undefined
                    ? this.available_sheet_definitions.filter(
                          (x) => x.layer_1[this.body_type]
                      )
                    : null
            );
    }

    bodyTypeChange(event: any) {
        this.body_type = event.value;
        this.clearCharacter();
    }

    clearCharacter() {
        this.currentSd = [] as iSheetDefinition[];
        this.available_sheet_definitions = this.sheet_definitions;
        this.filteredSheets = [];
        this.characterProxyService.clearCharacter();
    }

    filtersheets(searchTerm: string): iSheetDefinition[] {
        const sheets = this.available_sheet_definitions;

        this.filteredSheets = sheets.filter(
            (x) =>
                x.name
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase().trim()) ||
                x.type_name
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase().trim()) ||
                x.filename
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase().trim())
        );
        if (
            this.filteredSheets.length === this.sheet_definitions.length ||
            searchTerm === ""
        ) {
            this.filteredSheets = [];
        }
        return this.filteredSheets;
    }

    getUniqueKeys(obj: {}) {
        const uniqueKeys: string[] = [...new Set(Object.keys(obj))].filter(
            (x) => x !== ""
        );
        return uniqueKeys;
    }

    groupData(sd: iSheetDefinition[]): iSheetDefinition[] {
        const grouped = [];

        sd.forEach((sd) => {
            const type_name = sd.type_name;

            if (!grouped[type_name]) {
                grouped[type_name] = [];
            }

            grouped[type_name].push(sd);
        });
        return grouped;
    }

    getBodyTypes() {
        const sheets = this.sheet_definitions;
        const layer1 = sheets.map((x) => x.layer_1);
        const keys = [];
        layer1.forEach((x) => {
            keys.push(Object.keys(x));
        });
        this.body_types = [...new Set(keys.flat())].splice(2);
    }

    //async functions

    //ng lifecycle hooks

    ngOnInit(): void {
        this.sheetDefinitionSubscription = this.characterCustomizerService
            .getSheetDefinitions()
            .pipe(
                finalize(() => {
                    this.getBodyTypes();
                    this.available_sheet_definitions = this.sheet_definitions;
                })
            )
            .subscribe(this.sheetDefinitionObserver);

        this.characterProxyService.sharedCharacter$.subscribe((character) => {
            if (character !== null) {
                this.currentCharacter = character;
            }
        });

        this.unityService.getTestMessage().subscribe((data) => {
            console.log(data);
        });
    }

    constructor(
        private characterCustomizerService: CharacterCustomizerService,
        private characterProxyService: CharacterProxyService,
        private unityService: UnityService
    ) {}
}
