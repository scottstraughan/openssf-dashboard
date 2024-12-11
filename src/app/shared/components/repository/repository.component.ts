import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { RepositoryModel } from '../../models/repository.model';
import { RingComponent } from '../ring/ring.component';
import { DatePipe, JsonPipe } from '@angular/common';
import { LoadingComponent } from '../loading/loading.component';
import { OrganizationModel } from '../../models/organization.model';
import { ScorecardModel } from '../../models/scorecard.model';

@Component({
  selector: 'osf-repository',
  standalone: true,
  imports: [
    RingComponent,
    DatePipe,
    LoadingComponent,
    JsonPipe
  ],
  templateUrl: './repository.component.html',
  styleUrl: './repository.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RepositoryComponent {
  readonly organization = input.required<OrganizationModel>();
  readonly repository = input.required<RepositoryModel>();
  readonly scorecard = input<ScorecardModel | undefined>(undefined);
  readonly onReloadScorecard = output();
}
