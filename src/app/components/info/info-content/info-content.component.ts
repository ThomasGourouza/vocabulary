import { Component, Input, OnInit } from '@angular/core';
import { Grammar } from 'src/app/models/grammar';
import { InfoLabel } from 'src/app/models/info-label';
import { GrammarService } from 'src/app/services/grammar.service';

@Component({
  selector: 'app-info-content',
  templateUrl: './info-content.component.html'
})
export class InfoContentComponent implements OnInit {

  @Input() service!: GrammarService;
  
  infoLabel!: InfoLabel;
  public data!: Array<Grammar>;
  public currentItem: Grammar | undefined;
  public counter!: number;
  public priority: number | undefined;
  public isValidData!: boolean;

  constructor() {
    this.data = [];
  }

  ngOnInit(): void {
    this.infoLabel = this.service.infoLabel;
    this.service.data$.subscribe((value) => this.data = value);
    this.service.currentItem$.subscribe((value) => this.currentItem = value);
    this.service.counter$.subscribe((value) => this.counter = value);
    this.service.priority$.subscribe((value) => this.priority = value);
    this.service.isValidData$.subscribe((value) => this.isValidData = value);
  }

}
