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

import { ExcelService } from './services/excel.service';

import { FileUploadModule } from 'primeng/fileupload';
import { TabMenuModule } from 'primeng/tabmenu';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { TimePipe } from './pipes/time.pipe';
import { PriorityPipe } from './pipes/priority.pipe';
import { PrioritiesPipe } from './pipes/priorities.pipe';
import { ReaderSpeakerService } from './services/reader-speaker.service';

@NgModule({
  declarations: [
    AppComponent,
    SettingsComponent,
    InteractiveTableComponent,
    TableComponent,
    TableListComponent,
    TimePipe,
    PriorityPipe,
    PrioritiesPipe
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
    ToastModule
  ],
  providers: [
    ExcelService,
    ReaderSpeakerService,
    MessageService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
