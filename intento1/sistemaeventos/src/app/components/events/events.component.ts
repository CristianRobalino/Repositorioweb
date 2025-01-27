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

@Component({
  selector: 'app-events',
  imports: [ToastModule,ButtonModule,TableModule,DialogModule,ReactiveFormsModule,CommonModule,MultiSelectModule],
  templateUrl: './events.component.html',
  styleUrl: './events.component.css'
})
export class EventsComponent implements OnInit{
  eventFormGroup: FormGroup;
  events: any[] = [];
  displayEventDialog: boolean = false;
  editEventIndex: number | null = null;
  cities: any[];  // Define la propiedad 'cities'
  today: string;  // Variable para la fecha de hoy

  constructor(
    private eventService: EventManagementService, 
    private fb: FormBuilder, 
    private messageService: MessageService
  ) {
    // Establece la fecha de hoy en formato 'YYYY-MM-DD'
    const todayDate = new Date();
    this.today = todayDate.toISOString().split('T')[0]; // Obtiene la fecha sin la hora
    this.eventFormGroup = this.fb.group({
      eventName: [''],
      eventDate: [''],
      selectedCities: [[]],
    });
    this.cities = [
      { name: 'New York', code: 'NY' },
      { name: 'Los Angeles', code: 'LA' },
      // Agrega más opciones según sea necesario
    ];
  }

  ngOnInit() {
    this.eventService.events$.subscribe(events => {
      this.events = events;
    });
  }

  openEventDialog() {
    this.eventFormGroup.reset();
    this.displayEventDialog = true;
    this.editEventIndex = null;
  }

  saveEvent() {
    if (this.eventFormGroup.valid) {
      const eventData = this.eventFormGroup.value;
      const formattedEvent = {
        ...eventData,
        selectedCities: eventData.selectedCities.map((city: any) => city.name),
      };
      if (this.editEventIndex !== null) {
        this.eventService.updateEvent(this.editEventIndex, formattedEvent);
        this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Evento actualizado correctamente' });
      } else {
        this.eventService.addEvent(formattedEvent);
        this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Evento guardado correctamente' });
      }
      this.displayEventDialog = false;
    } else {
      // Mostrar notificaciones de error usando el MessageService
      if (this.eventFormGroup.get('eventName')?.hasError('required')) {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'El nombre del evento es obligatorio.' });
      }
      if (this.eventFormGroup.get('eventDate')?.hasError('required')) {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'La fecha del evento es obligatoria.' });
      }
      if (this.eventFormGroup.get('selectedCities')?.hasError('required') || this.eventFormGroup.get('selectedCities')?.value.length === 0) {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Debe seleccionar al menos una ciudad.' });
      }
    }
  }

  editEvent(index: number) {
    this.editEventIndex = index;
    const event = this.events[index];
    this.eventFormGroup.patchValue(event);
    this.displayEventDialog = true;
  }

  deleteEvent(index: number) {
    this.eventService.deleteEvent(index);
    this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Evento eliminado correctamente' });
  }
}
