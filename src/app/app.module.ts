import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

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
import { MessageService } from 'primeng/api';
import { ConfirmationService } from 'primeng/api';
import { TimePipe } from './pipes/time.pipe';
import { FilterPipe } from './pipes/filter.pipe';
import { GetPipe } from './pipes/get.pipe';
import { TranslateLangPipe } from './pipes/translate-lang.pipe';

@NgModule({
  declarations: [
    AppComponent,
    SettingsComponent,
    InteractiveTableComponent,
    TableComponent,
    TableListComponent,
    CounterOrSoundComponent,
    TimePipe,
    FilterPipe,
    GetPipe,
    TranslateLangPipe
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    CommonModule,
    FormsModule,
    FileUploadModule,
    TabMenuModule,
    ButtonModule,
    CardModule,
    ToastModule,
    ConfirmDialogModule,
    CheckboxModule
  ],
  providers: [
    ExcelService,
    ReaderSpeakerService,
    WakelockService,
    MessageService,
    ConfirmationService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
