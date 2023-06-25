import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';

import { WordComponent } from './components/word/word.component';
import { ListComponent } from './components/list/list.component';

import { ExcelService } from './services/excel.service';

import { FileUploadModule } from 'primeng/fileupload';
import { TabMenuModule } from 'primeng/tabmenu';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { TableDefaultComponent } from './components/table-default/table-default.component';
import { TimePipe } from './pipes/time.pipe';
import { PriorityPipe } from './pipes/priority.pipe';
import { ReaderSpeakerService } from './services/reader-speaker.service';

@NgModule({
  declarations: [
    AppComponent,
    WordComponent,
    ListComponent,
    TableDefaultComponent,
    TimePipe,
    PriorityPipe
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
