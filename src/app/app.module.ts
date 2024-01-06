import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';

import { SettingsComponent } from './components/settings/settings.component';
import { InteractiveTableComponent } from './components/interactive-table/interactive-table.component';
import { TableComponent } from './components/interactive-table/table/table.component';
import { TableListComponent } from './components/table-list/table-list.component';
import { CounterOrSoundComponent } from './components/interactive-table/counter-or-sound/counter-or-sound.component';

import { ExcelService } from './services/excel.service';
import { ReaderSpeakerService } from './services/reader-speaker.service';
import { WakelockService } from './services/wakelock.service';

import { FileUploadModule } from 'primeng/fileupload';
import { TabMenuModule } from 'primeng/tabmenu';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { CheckboxModule } from 'primeng/checkbox';
import { ProgressBarModule } from 'primeng/progressbar';
import { DialogModule } from 'primeng/dialog';
import { MessageService } from 'primeng/api';
import { ConfirmationService } from 'primeng/api';
import { FilterPipe } from './pipes/filter.pipe';
import { GetPipe } from './pipes/get.pipe';
import { FlagUrlPipe } from './pipes/flag-url.pipe';
import { TranslateLangPipe } from './pipes/translate-lang.pipe';
import { SafeHtmlPipe } from './pipes/safe-html.pipe';
import { KuroshiroService } from './services/kuroshiro.service';
import { ItemsService } from './services/items.service';
import { SettingApiService } from './services/setting.api.service';
import { AccountService } from './services/account.service';
import { GameModeComponent } from './components/game-mode/game-mode.component';
import { GameTableComponent } from './components/game-mode/game-table/game-table.component';

@NgModule({
  declarations: [
    AppComponent,
    SettingsComponent,
    InteractiveTableComponent,
    GameModeComponent,
    GameTableComponent,
    TableComponent,
    TableListComponent,
    CounterOrSoundComponent,
    FilterPipe,
    GetPipe,
    TranslateLangPipe,
    SafeHtmlPipe,
    FlagUrlPipe
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FileUploadModule,
    TabMenuModule,
    ButtonModule,
    CardModule,
    ToastModule,
    ConfirmDialogModule,
    DialogModule,
    CheckboxModule,
    ProgressBarModule
  ],
  providers: [
    ExcelService,
    ReaderSpeakerService,
    WakelockService,
    KuroshiroService,
    MessageService,
    ConfirmationService,
    ItemsService,
    SettingApiService,
    AccountService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
