import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { iCharacter } from "../classes/icharacter";

@Injectable({ providedIn: "root" })
export class CharacterProxyService {
    private eventSubject = new BehaviorSubject<iCharacter>(null);

    sharedCharacter$: Observable<iCharacter | null> =
        this.eventSubject.asObservable();

    updateCharacter(character: iCharacter | null) {
        console.log(character);
        this.eventSubject.next(character);
        console.log(this.sharedCharacter$);
    }

    clearCharacter() {
        this.eventSubject.next(null);
    }
}
