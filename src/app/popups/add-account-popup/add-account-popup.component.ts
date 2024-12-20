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

import { ChangeDetectionStrategy, Component, Inject, signal, WritableSignal } from '@angular/core';
import { PopupReference, PopupService } from '../../shared/components/popup/popup.service';
import { SearchComponent } from '../../shared/components/search/search.component';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { FormsModule } from '@angular/forms';
import { ServiceStoreService } from '../../shared/services/service-store.service';
import { catchError, of, tap } from 'rxjs';
import { ErrorPopupComponent } from '../../shared/popups/error-popup/error-popup.component';
import { RepositoryViewComponent } from '../../repository-view/repository-view.component';
import { LoadingComponent } from '../../shared/components/loading/loading.component';
import { Router } from '@angular/router';
import { NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'osf-add-account-popup',
  standalone: true,
  templateUrl: './add-account-popup.component.html',
  imports: [
    SearchComponent,
    ButtonComponent,
    FormsModule,
    LoadingComponent,
    NgOptimizedImage
  ],
  styleUrls: [
    './add-account-popup.component.scss'
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddAccountPopupComponent {
  readonly service: WritableSignal<string> = signal('github');
  readonly accountName: WritableSignal<string> = signal('');
  readonly apiToken: WritableSignal<string | undefined> = signal(undefined);
  readonly loading: WritableSignal<boolean> = signal(false);

  /**
   * Constructor.
   * @param popupReference
   * @param serviceStoreService
   * @param popupService
   * @param router
   */
  constructor(
    @Inject('POPUP_DATA') protected popupReference: PopupReference,
    protected serviceStoreService: ServiceStoreService,
    protected popupService: PopupService,
    protected router: Router
  ) { }

  /**
   * Determine if all the forms are valid.
   */
  isServiceFormsValid(): boolean {
    if (this.service() == 'github') {
      if (this.accountName().length == 0) {
        return false;
      }
    }

    return true;
  }

  /**
   * Called when a user clicks to add a new account to inspect.
   */
  onAdd() {
    this.loading.set(true);

    this.serviceStoreService.add(this.service(), this.accountName(), this.apiToken())
      .pipe(
        tap((account) => {
          this.popupReference.close();
          this.loading.set(false);
          this.router.navigate([`/${account.service}/${account.account}`]);
        }),
        catchError((error) => {
          this.popupService.create(
            ErrorPopupComponent, ErrorPopupComponent.handleErrorThrown(error), true);

          this.loading.set(false);
          return of();
        })
      )
      .subscribe();
  }

  /**
   * Called when the user clicks to close the popup.
   */
  onCloseClicked() {
    this.popupReference.close();
  }

  /**
   * Called when a user clicks the gitlab icon (temporary).
   */
  onGitlabClicked() {
    this.popupService.create(
      ErrorPopupComponent, {
        title: 'Coming Soon!',
        message: 'GitLab is currently not supported, but its coming soon!',
        icon: 'coffee'
      }, true);
  }
}
