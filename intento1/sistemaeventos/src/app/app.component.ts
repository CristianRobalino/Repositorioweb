import { Component,ViewChild  } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import {AssistantsComponent} from './components/assistants/assistants.component';
import { EventsComponent} from './components/events/events.component';
import { RegistrationsComponent} from './components/registrations/registrations.component';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import { MessageService } from 'primeng/api';
import { EventManagementService } from './services/event-management.service';
import { Popover } from 'primeng/popover'; 
import { CommonModule } from '@angular/common';
import { PopoverModule } from 'primeng/popover';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    AssistantsComponent,
    EventsComponent,
    FullCalendarModule,
    RegistrationsComponent,
    RouterModule,
    PopoverModule,  // Importa PopoverModule aquí
    CommonModule 
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [MessageService],
})
export class AppComponent {
  title = 'sistemaeventos';
  selectedEvent: any; // Para almacenar el evento seleccionado
  @ViewChild('eventPopover') eventPopover!: Popover;   // Referencia al OverlayPanel
  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin],
    initialView: 'dayGridMonth',
    weekends: true,
    themeSystem: 'bootstrap',
    events: [],
    eventClick: (info) => {
      
      this.handleEventClick(info);
    }
  };
  constructor(private eventService: EventManagementService, private router: Router) {}
  ngOnInit() {
    // Nos suscribimos al observable 'events$' del servicio
    this.eventService.events$.subscribe(events => {
      // Cada vez que los eventos cambian, actualizamos el arreglo de eventos del calendario
      this.updateCalendarEvents(events);
    });
  }
  private updateCalendarEvents(events: any[]) {
    this.calendarOptions.events = events.map(event => ({
      title: event.eventName,  // Asegurémonos de que 'eventName' está presente
      start: event.eventDate,  // Asegurémonos de que 'eventDate' está presente
      backgroundColor: event.selectedCities.length ? '#2196F3' : '#FF5722', // Dependiendo de la ciudad o tipo de evento
      textColor: '#fff',
      extendedProps: {         // Añadimos explícitamente extendedProps
        eventName: event.eventName,
        eventDate: event.eventDate,
        selectedCities: event.selectedCities  // Aseguramos que 'selectedCities' esté aquí
      }
    }));
  }
  navigateToNewTab(route: string) {
    this.router.navigate([route]);
  }
  handleEventClick(info: any) {
    this.selectedEvent = {
      eventName: info.event.title,  // Título del evento
      eventDate: info.event.start,  // Fecha del evento
      selectedCities: info.event.extendedProps.selectedCities || []  // Asegúrate de que selectedCities esté presente
    };
    if (this.eventPopover) {
      this.eventPopover.toggle(info.jsEvent);  // Asegúrate de que toggle esté siendo llamado
    
    }
  }

}
