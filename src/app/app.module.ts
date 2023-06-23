import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';

import { AdjectiveComponent } from './components/adjective/adjective.component';

import { InteractiveTableComponent } from './components/interactive-table/interactive-table.component';

import { ExcelService } from './services/excel.service';
import { AdjectivesService } from './services/adjectives.service';

import { FileUploadModule } from 'primeng/fileupload';
import { TabMenuModule } from 'primeng/tabmenu';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { TableDefaultComponent } from './components/interactive-table/table-default/table-default.component';
import { TimePipe } from './pipes/time.pipe';
import { ReaderSpeakerService } from './services/reader-speaker.service';
import { GrammarService } from './services/grammar.service';

@NgModule({
  declarations: [
    AppComponent,
    AdjectiveComponent,
    InteractiveTableComponent,
    TableDefaultComponent,
    TimePipe
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    CommonModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    FileUploadModule,
    TabMenuModule,
    ButtonModule,
    CardModule,
    ToastModule
  ],
  providers: [
    ExcelService,
    ReaderSpeakerService,
    AdjectivesService,
    MessageService,
    GrammarService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
