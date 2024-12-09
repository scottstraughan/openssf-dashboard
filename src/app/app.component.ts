import { Component, signal, Signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { OrganizationModel } from './shared/models/organization.model';
import { NgClass } from '@angular/common';
import { OrganizationService } from './shared/services/organization.service';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NgClass, RouterLinkActive, RouterLink],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  organizations: Signal<OrganizationModel[]> = signal([]);
  selectedOrganization: OrganizationModel | undefined;

  constructor(
    protected organizationService: OrganizationService,
  ) {
    this.organizations = toSignal(this.organizationService.getOrganizations(), { initialValue: [] });
    this.setSelectedOrganization(this.organizations()[0]);
  }

  setSelectedOrganization(organization: OrganizationModel) {
    this.selectedOrganization = organization;
  }

  onAddOrg() {
    alert();
  }
}
