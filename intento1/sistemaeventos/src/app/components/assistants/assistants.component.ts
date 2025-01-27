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
import { InputMaskModule } from 'primeng/inputmask';
import { Validators } from '@angular/forms';

@Component({
  selector: 'app-assistants',
  imports: [ToastModule,ButtonModule,TableModule,DialogModule,ReactiveFormsModule,CommonModule,MultiSelectModule,InputMaskModule],
  templateUrl: './assistants.component.html',
  styleUrl: './assistants.component.css'
})
export class AssistantsComponent implements OnInit {
  assistantFormGroup: FormGroup;
  assistants: any[] = [];
  displayAssistantDialog: boolean = false;
  editAssistantIndex: number | null = null;

  constructor(private eventService: EventManagementService, private fb: FormBuilder, private messageService: MessageService) {
    
    this.assistantFormGroup = this.fb.group({
      assistantName: ['', Validators.required],  // Nombre requerido
      assistantEmail: ['', [Validators.required, Validators.email]],  // Email requerido y con formato
      assistantPhone: ['', Validators.required],  // Teléfono requerido
    });
  }

  ngOnInit() {
    this.eventService.assistants$.subscribe(assistants => {
      this.assistants = assistants;
    });
  }

  openAssistantDialog() {
    this.assistantFormGroup.reset();
    this.displayAssistantDialog = true;
    this.editAssistantIndex = null;
  }

  saveAssistant() {
    if (this.assistantFormGroup.valid) {
      const assistantData = this.assistantFormGroup.value;
      if (this.editAssistantIndex !== null) {
        this.eventService.updateAssistant(this.editAssistantIndex, assistantData);
        this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Asistente actualizado correctamente' });
      } else {
        this.eventService.addAssistant(assistantData);
        this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Asistente guardado correctamente' });
      }
      this.displayAssistantDialog = false;
    } else {
      // Mostrar notificaciones de error usando el MessageService
      if (this.assistantFormGroup.get('assistantName')?.hasError('required')) {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'El nombre del asistente es obligatorio.' });
      }
      if (this.assistantFormGroup.get('assistantEmail')?.hasError('required')) {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'El email es obligatorio.' });
      } else if (this.assistantFormGroup.get('assistantEmail')?.hasError('email')) {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'El email debe tener un formato válido.' });
      }
      if (this.assistantFormGroup.get('assistantPhone')?.hasError('required')) {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'El teléfono es obligatorio.' });
      }
    }
  }

  editAssistant(index: number) {
    this.editAssistantIndex = index;
    const assistant = this.assistants[index];
    this.assistantFormGroup.patchValue(assistant);
    this.displayAssistantDialog = true;
  }

  deleteAssistant(index: number) {
    this.eventService.deleteAssistant(index);
    this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Asistente eliminado correctamente' });
  }
}
