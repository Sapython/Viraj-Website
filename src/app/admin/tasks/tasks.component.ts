import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DataProvider } from 'src/app/providers/data.provider';
import { BlurSiteService } from 'src/app/services/blur-site.service';
import { DatabaseService } from 'src/app/services/database.service';
import { AlertsAndNotificationsService } from 'src/app/services/uiService/alerts-and-notifications.service';
declare const UIkit: any;

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['../admin.util.scss', './tasks.component.scss'],
})
export class TasksComponent implements OnInit {
  tasks: any[];
  employees: any;

  editMode: boolean = false;
  currentEditId: string = '';
  currentDeleteId: string = '';

  taskForm: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required]),
    employee: new FormControl('', [Validators.required]),
    details: new FormControl([]),
  });

  constructor(
    private databaseService: DatabaseService,
    private dataProvider: DataProvider,
    private alertService: AlertsAndNotificationsService
  ) {}

  ngOnInit(): void {
    this.tasks = [];
    this.databaseService.getTasks().then((docs) => {
      docs.forEach((doc) => {
        this.tasks.push({ id: doc.id, ...doc.data() });
      });
    });

    this.employees = {};
    this.databaseService.getEmployees().then((docs) => {
      docs.forEach((doc) => {
        this.employees[doc.id] = doc.data();
      });
    });
  }

  getEmployeeName(employee: any): string {
    return employee.name;
  }

  addDetails(event: Event | null, detail: any): void {
    event?.preventDefault();
    const detailsInputs = document.getElementById('details-inputs');
    if (detailsInputs) {
      const detailInputContainer = document.createElement('div');
      detailInputContainer.style.display = 'flex';
      detailInputContainer.style.alignItems = 'baseline';

      const detailInput = document.createElement('input');
      detailInput.type = 'text';
      detailInput.classList.add('admin-input');
      detailInput.style.width = '100%';
      detailInput.value = detail;

      const deleteIcon = document.createElement('i');
      deleteIcon.classList.add('fa-solid', 'fa-trash');
      deleteIcon.style.marginLeft = '1em';
      deleteIcon.style.cursor = 'pointer';
      deleteIcon.style.color = 'var(--secondary)';
      deleteIcon.style.fontSize = '1.5rem';
      deleteIcon.addEventListener(
        'click',
        () => {
          if (detailsInputs.contains(detailInputContainer)) {
            detailsInputs.removeChild(detailInputContainer);
          }
        },
        false
      );

      detailInputContainer.appendChild(detailInput);
      detailInputContainer.appendChild(deleteIcon);
      detailsInputs.appendChild(detailInputContainer);
    }
  }

  submitTaskForm(): void {
    if (this.taskForm.valid) {
      this.dataProvider.pageSetting.blur = true;

      // Set 'details' form control
      this.taskForm.value.details = [];
      const detailsInputs = document.getElementById('details-inputs');
      if (detailsInputs) {
        const detailInputs = detailsInputs.querySelectorAll('input');
        if (detailInputs) {
          detailInputs.forEach((input: any) => {
            this.taskForm.value.details.push(input.value);
          });
        }
      }

      if (this.editMode) {
        this.databaseService
          .editTask(this.currentEditId, this.taskForm.value)
          .then(() => {
            UIkit.modal(document.getElementById('task-modal')).hide();
            this.ngOnInit();
            this.dataProvider.pageSetting.blur = false;;
            this.alertService.presentToast('Task edited successfully', 'info');
          });
      } else {
        this.databaseService.addTask(this.taskForm.value).then(() => {
          UIkit.modal(document.getElementById('task-modal')).hide();
          this.taskForm.reset();
          if (detailsInputs) {
            detailsInputs.innerHTML = '';
          }
          this.ngOnInit();
          this.dataProvider.pageSetting.blur = false;;
          this.alertService.presentToast('Task added successfully', 'info');
        });
      }
    } else {
      this.alertService.presentToast(
        'Please fill all the required fields.',
        'error'
      );
    }
  }

  editTask(task: any): void {
    this.editMode = true;
    this.currentEditId = task.id;

    // Patch values
    this.taskForm.patchValue(task);
    const detailsInputs = document.getElementById('details-inputs');
    if (detailsInputs) {
      detailsInputs.innerHTML = '';
      task.details.forEach((detail: any) => {
        this.addDetails(null, detail);
      });
    }

    const taskModal = document.getElementById('task-modal');
    if (taskModal) {
      taskModal.addEventListener('hidden', () => {
        this.editMode = false;
        this.currentEditId = '';

        // Reset the form
        this.taskForm.reset();
        if (detailsInputs) {
          detailsInputs.innerHTML = '';
        }
      });
      UIkit.modal(taskModal).show();
    }
  }

  deleteTask(): void {
    this.dataProvider.pageSetting.blur = true;
    this.databaseService.deleteTask(this.currentDeleteId).then(() => {
      this.ngOnInit();
      this.dataProvider.pageSetting.blur = false;;
      this.alertService.presentToast('Task deleted successfully', 'info');
    });
  }

  toggleTaskCompletion(taskId: string, task: any): void {
    task.completed = !task.completed;
    this.databaseService.editTask(taskId, task);
  }
}
