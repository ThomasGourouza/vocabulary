import { Routes } from "@angular/router";
import { AdjectiveComponent } from "./components/adjective/adjective.component";

export const APP_ROUTES: Routes = [
    { path: '', redirectTo: '/adjectives', pathMatch: 'full' },
    { path: 'adjectives', component: AdjectiveComponent },
    { path: '**', redirectTo: '/adjectives' },
];
