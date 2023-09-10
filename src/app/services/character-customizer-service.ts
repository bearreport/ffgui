import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, map, of } from "rxjs";

import { CharacterProxyService } from "./character-proxy-service";
import { iSheetDefinition } from "../classes/isheetdefinition";
import { iCharacter } from "../classes/icharacter";

@Injectable({
    providedIn: "root",
})
export class CharacterCustomizerService {
    constructor(
        private httpService: HttpClient,
        private characterProxyService: CharacterProxyService
    ) {}

    public getSheetDefinitions(): Observable<iSheetDefinition> {
        return this.httpService.get<iSheetDefinition>(
            "http://localhost:3000/v1/sheetdefinitions/"
        );
    }

    public querySheetDefinitions(term: string): Observable<iSheetDefinition> {
        return this.httpService.get<iSheetDefinition>(
            "http://localhost:3000/v1/sheetdefinitions/"
        );
    }

    public updateCharacter(character: iCharacter) {
        this.characterProxyService.updateCharacter(character);
    }
}
