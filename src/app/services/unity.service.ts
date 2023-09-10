import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({
    providedIn: "root",
})
export class UnityService {
    getTestMessage(): Observable<any> {
        console.log("UnityService.getTestMessage()");
        return this.httpService.get("https://localhost:5258/weatherforecast");
    }

    constructor(private httpService: HttpClient) {}
}
