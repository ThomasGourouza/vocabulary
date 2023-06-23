import { Routes } from "@angular/router";
import { WordComponent } from "./components/word/word.component";

export const APP_ROUTES: Routes = [
    { path: '', redirectTo: '/words', pathMatch: 'full' },
    { path: 'words', component: WordComponent },
    { path: '**', redirectTo: '/words' },
];
