import { Component, EventEmitter, Output } from "@angular/core";
import { Subscription } from "rxjs";

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
    selectedSheet: iSheetDefinition;
    currentSd: iSheetDefinition[] = [];
    filteredSheets: iSheetDefinition[] = [];
    filterValue = "";

    body_type = "Male";
    currentCharacter: iCharacter;

    masterKeys: string[] = ["default"];

    sheetDefinitionObserver = {
        next: (data) => {
            return (this.sheet_definitions = data);
        },
        error: (err: any) => console.error(err),
        complete: () => {},
    };

    addSheetDefinition(sheet: iSheetDefinition, variant: string) {
        const sheetCopy = JSON.parse(JSON.stringify(sheet));
        sheetCopy.variants = [variant];
        this.currentSd.push(sheetCopy);
        const sheets = this.currentSd;
        const body_type = this.body_type;
        const character: iCharacter = {
            sheetDefinitions: sheets,
            bodyType: body_type,
        };
        console.log(character);
        this.characterProxyService.updateCharacter(character);
    }

    bodyTypeChange(event: any) {
        this.body_type = event.value;
    }

    clearCharacter() {
        this.currentSd = [] as iSheetDefinition[];
        this.characterProxyService.clearCharacter();
    }

    filtersheets(text: string): iSheetDefinition[] {
        this.getAllVariants();
        const sheets = this.sheetDefinitionObserver.next(
            this.sheet_definitions
        );
        this.filteredSheets = sheets.filter(
            (x) =>
                x.name.toLowerCase().includes(text.toLowerCase()) ||
                x.type_name.toLowerCase().includes(text.toLowerCase())
        );
        return this.filteredSheets;
    }

    generateMasterKeyList() {
        let keys: string[] = ["initializer"];
        this.sheet_definitions.forEach((sd) =>
            !keys.includes(sd.type_name) ? keys.push(sd.type_name) : null
        );
        this.masterKeys = keys;
    }

    getAllVariants() {
        const sheets = this.sheetDefinitionObserver.next(
            this.sheet_definitions
        );
        const variants = sheets.map((sheet) => sheet.variants);
        const flattened = variants.flat();
        const uniqueVariants = [...new Set(flattened)];
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

    ngOnInit(): void {
        this.sheetDefinitionSubscription = this.characterCustomizerService
            .getSheetDefinitions()
            .subscribe(this.sheetDefinitionObserver);
        this.unityService.getTestMessage().subscribe((data) => {
            console.log(data);
        });
    }

    ngAfterViewInit() {}

    constructor(
        private characterCustomizerService: CharacterCustomizerService,
        private characterProxyService: CharacterProxyService,
        private unityService: UnityService
    ) {}
}
