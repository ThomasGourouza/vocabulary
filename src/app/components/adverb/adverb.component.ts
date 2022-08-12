import { Component, OnDestroy, OnInit } from '@angular/core';
import { Adverb } from 'src/app/models/adverb';
import { AdverbsService } from 'src/app/services/adverbs.service';
import { ExcelService } from 'src/app/services/excel.service';
import { NavigationService } from 'src/app/services/navigation.service';
import { MessageService } from 'primeng/api';
import { Text } from 'src/app/models/text';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-adverb',
  templateUrl: './adverb.component.html'
})
export class AdverbComponent implements OnInit, OnDestroy {

  private excelSubscription = new Subscription();

  constructor(
    private excelService: ExcelService,
    private navigationService: NavigationService,
    public adverbsService: AdverbsService,
    private messageService: MessageService
  ) {
    this.navigationService.setTabIndex(this.adverbsService.tabIndex);
  }

  ngOnInit(): void {
    this.excelSubscription = this.excelService.uploadedAdverbs$.subscribe((adverbs: Array<Adverb>) => {
      this.adverbsService.setData(adverbs.filter((adverb) => adverb?.show !== '-'));
      this.checkData(this.adverbsService.data);
    });
  }

  ngOnDestroy(): void {
    this.excelSubscription.unsubscribe();
  }

  private checkData(adverbs: Array<Adverb>): void {
    if (adverbs.length < 2) {
      this.adverbsService.setIsValidData(false);
      this.messageService.add({ severity: 'error', summary: Text.notEnoughText, detail: Text.addMoreDataText });
      return;
    }
    const keys = Object.keys(adverbs[0]);
    keys.forEach((key) => {
      if (!this.adverbsService.validKeys.includes(key)) {
        this.adverbsService.setIsValidData(false);
      }
    });
    const message = (this.adverbsService.isValidData) ?
      { severity: 'info', summary: Text.validAdverbsText, detail: Text.selectPriorityText }
      : { severity: 'error', summary: Text.invalidText, detail: Text.removeText };
    this.messageService.add(message);
  }

}
