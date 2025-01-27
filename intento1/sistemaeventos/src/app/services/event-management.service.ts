import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EventManagementService {
  private eventsSubject = new BehaviorSubject<any[]>([]);
  private assistantsSubject = new BehaviorSubject<any[]>([]);
  private registrationsSubject = new BehaviorSubject<any[]>([]);

  // Obtén los eventos, asistentes y registros como observables
  get events$() {
    return this.eventsSubject.asObservable();
  }

  get assistants$() {
    return this.assistantsSubject.asObservable();
  }

  get registrations$() {
    return this.registrationsSubject.asObservable();
  }


   // Métodos para manipular los datos
   addEvent(event: any) {
    const events = this.eventsSubject.getValue();
    events.push(event);
    this.eventsSubject.next(events);
  }

  updateEvent(index: number, updatedEvent: any) {
    const events = this.eventsSubject.getValue();
    events[index] = updatedEvent;
    this.eventsSubject.next(events);
  }

  deleteEvent(index: number) {
    const events = this.eventsSubject.getValue();
    events.splice(index, 1);
    this.eventsSubject.next(events);
  }

  addAssistant(assistant: any) {
    const assistants = this.assistantsSubject.getValue();
    assistants.push(assistant);
    this.assistantsSubject.next(assistants);
  }

  updateAssistant(index: number, updatedAssistant: any) {
    const assistants = this.assistantsSubject.getValue();
    assistants[index] = updatedAssistant;
    this.assistantsSubject.next(assistants);
  }

  deleteAssistant(index: number) {
    const assistants = this.assistantsSubject.getValue();
    assistants.splice(index, 1);
    this.assistantsSubject.next(assistants);
  }

  addRegistration(registration: any) {
    const registrations = this.registrationsSubject.getValue();
    registrations.push(registration);
    this.registrationsSubject.next(registrations);
  }

  deleteRegistration(index: number) {
    const registrations = this.registrationsSubject.getValue();
    registrations.splice(index, 1);
    this.registrationsSubject.next(registrations);
  }

  constructor() { }
}
