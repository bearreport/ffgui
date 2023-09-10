import { iSheetDefinition } from "./isheetdefinition";
import { iCharacterStats } from "./icharacterStats";

export interface iCharacter {
    isPlayable?: Boolean;
    bodyType: String;
    customName?: String;
    defaultName?: String;
    flavorText?: String;
    sheetDefinitions: iSheetDefinition[];
    characterStats?: iCharacterStats[];
}
