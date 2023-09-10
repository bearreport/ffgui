import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";

import { HttpClientModule } from "@angular/common/http";
import { CacheInterceptor } from "./interceptor";

import { AppComponent } from "./app.component";

import { CharacterCustomizerComponent } from "./components/character-customizer/character-customizer.component";
import { CharacterVisualizerComponent } from "./components/character-visualizer/character-visualizer.component";
import { CharacterCustomizerService } from "./services/character-customizer-service";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { MatCardModule } from "@angular/material/card";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatButtonModule } from "@angular/material/button";
import { MatRadioModule } from "@angular/material/radio";
import { FormsModule } from "@angular/forms";
import { ReactiveFormsModule } from "@angular/forms";
import { CharacterProxyService } from "./services/character-proxy-service";
import { UnityService } from "./services/unity.service";

@NgModule({
    declarations: [
        AppComponent,
        CharacterCustomizerComponent,
        CharacterVisualizerComponent,
    ],
    imports: [
        BrowserModule,
        HttpClientModule,
        BrowserAnimationsModule,
        MatButtonModule,
        MatCardModule,
        MatExpansionModule,
        MatRadioModule,
        FormsModule,
        ReactiveFormsModule,
    ],
    providers: [
        CharacterCustomizerService,
        CharacterProxyService,
        CacheInterceptor,
        UnityService,
    ],
    bootstrap: [AppComponent],
})
export class AppModule {}
