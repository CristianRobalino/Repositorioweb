import { Component, OnInit } from '@angular/core';
import { EventManagementService } from '../../services/event-management.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MultiSelectModule } from 'primeng/multiselect';
import { DropdownModule } from 'primeng/dropdown';

@Component({
  selector: 'app-registrations',
  imports: [ToastModule, ButtonModule, TableModule, DialogModule, ReactiveFormsModule, CommonModule, MultiSelectModule, DropdownModule],
  templateUrl: './registrations.component.html',
  styleUrls: ['./registrations.component.css']
})
export class RegistrationsComponent implements OnInit {
  registrationFormGroup: FormGroup;
  registrations: any[] = [];
  events: any[] = []; // Inicializando para almacenar los eventos
  assistants: any[] = []; // Inicializando para almacenar los asistentes
  displayRegistrationDialog: boolean = false;

  constructor(
    private eventService: EventManagementService,
    private fb: FormBuilder,
    private messageService: MessageService
  ) {
    this.registrationFormGroup = this.fb.group({
      selectedEvent: [''],
      selectedAssistant: [''],
    });
  }

  ngOnInit() {
    // Suscripción para obtener las inscripciones
    this.eventService.registrations$.subscribe(registrations => {
      this.registrations = registrations;
    });

    // Suscripción para obtener los eventos
    this.eventService.events$.subscribe(events => {
      this.events = events;
    });

    // Suscripción para obtener los asistentes
    this.eventService.assistants$.subscribe(assistants => {
      this.assistants = assistants;
    });
  }

  openRegistrationDialog() {
    this.registrationFormGroup.reset();
    this.displayRegistrationDialog = true;
  }

  saveRegistration() {
    // Verifica si los campos requeridos están vacíos
    if (this.registrationFormGroup.get('selectedEvent')?.value && this.registrationFormGroup.get('selectedAssistant')?.value) {
      const registrationData = this.registrationFormGroup.value;
      this.eventService.addRegistration(registrationData);
      this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Inscripción guardada correctamente' });
      this.displayRegistrationDialog = false;
    } else {
      // Muestra mensaje de error si alguno de los campos está vacío
      if (!this.registrationFormGroup.get('selectedEvent')?.value) {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Debe seleccionar un evento.' });
      }
      if (!this.registrationFormGroup.get('selectedAssistant')?.value) {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Debe seleccionar un asistente.' });
      }
    }
  }

  deleteRegistration(index: number) {
    this.eventService.deleteRegistration(index);
    this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Inscripción eliminada correctamente' });
  }

  editRegistration(index: number) {
    const registration = this.registrations[index];
    this.registrationFormGroup.patchValue({
      selectedEvent: registration.selectedEvent,
      selectedAssistant: registration.selectedAssistant,
    });
    this.displayRegistrationDialog = true;
  }
}
