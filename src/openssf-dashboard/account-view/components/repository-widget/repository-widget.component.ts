/*---------------------------------------------------------------------------------------------
 *
 *  Copyright (C) Codeplay Software Ltd.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 *
 *--------------------------------------------------------------------------------------------*/

import { ChangeDetectionStrategy, Component, input, OnInit, signal, WritableSignal, } from '@angular/core';
import { RepositoryModel } from '../../../shared/models/repository.model';
import { ScoreRingComponent } from '../../../shared/components/score-ring/score-ring.component';
import { DatePipe } from '@angular/common';
import { LoadingComponent } from '../../../shared/components/loading/loading.component';
import { AccountModel } from '../../../shared/models/account.model';
import { ScorecardModel } from '../../../shared/models/scorecard.model';
import { PopupService } from '../../../shared/components/popup/popup.service';
import { ErrorPopupComponent } from '../../../shared/popups/error-popup/error-popup.component';
import { LoadingState } from '../../../shared/LoadingState';
import { tap } from 'rxjs';
import { SelectedAccountService } from '../../../shared/services/selected-account.service';
import { Router } from '@angular/router';

@Component({
  selector: 'osd-repository-widget',
  standalone: true,
  imports: [
    ScoreRingComponent,
    DatePipe,
    LoadingComponent
  ],
  templateUrl: './repository-widget.component.html',
  styleUrl: './repository-widget.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RepositoryWidgetComponent implements OnInit {
  protected readonly LoadingState = LoadingState;

  readonly account = input.required<AccountModel>();
  readonly repository = input.required<RepositoryModel>();

  readonly scorecard: WritableSignal<ScorecardModel | undefined> = signal(undefined);
  readonly loading: WritableSignal<LoadingState> = signal(LoadingState.LOADING);

  /**
   * Constructor.
   * @param popupService
   * @param selectedAccountService
   * @param router
   */
  constructor(
    protected popupService: PopupService,
    protected selectedAccountService: SelectedAccountService,
    protected router: Router
  ) { }

  /**
   * @inheritdoc
   */
  ngOnInit(): void {
    this.selectedAccountService.scorecardsRequests$
      .pipe(
        tap(scorecardRequests => {
          for (const scorecardRequest of scorecardRequests) {
            if (scorecardRequest.repository.url == this.repository().url) {
              this.scorecard.set(scorecardRequest.scorecard);
              this.loading.set(scorecardRequest.loadState);
            }
          }
        })
      )
      .subscribe()
  }

  /**
   * Called when a user clicks on the main body of the repository view.
   */
  onClick() {
    if (this.scorecard()?.score) {
      this.router.navigate([`/${this.account().service}/${this.account().account}/${this.repository().name}`])
        .then();
    } else {
      this.popupService.create(
        ErrorPopupComponent, {
          title: 'No Scorecard',
          message: 'This repository does not have any associated scorecard available.',
        }, true);
    }
  }

  /**
   * Called when a user clicks the score ring to reload the score.
   */
  onReloadScore() {
    this.loading.set(LoadingState.LOADING);

    this.selectedAccountService.reloadScorecards(this.account(), this.repository());
  }
}
