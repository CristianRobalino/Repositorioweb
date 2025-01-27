import { Routes } from '@angular/router';
import { AssistantsComponent } from './components/assistants/assistants.component';
import { EventsComponent } from './components/events/events.component';
import { RegistrationsComponent } from './components/registrations/registrations.component';

export const routes: Routes = [
  { path: 'assistants', component: AssistantsComponent },
  { path: 'events', component: EventsComponent },
  { path: 'registrations', component: RegistrationsComponent },
  { path: '', redirectTo: '/events', pathMatch: 'full' },
];