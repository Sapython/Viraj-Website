import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
declare const UIkit: any;

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['../admin.util.scss', './tasks.component.scss'],
})
export class TasksComponent implements OnInit {
  tasks: Array<any> = [
    {
      id: 1,
      name: 'Cleaning',
      status: 'In Progess',
      employeeId: 'E1',
      completed: false,
      details: [
        'Wipe down and sanitize all surface',
        'Tuck chairs back into place',
      ],
    },
    {
      id: 2,
      name: 'Food Safety',
      status: 'Completed',
      employeeId: 'E2',
      completed: true,
      details: [
        'Disinfect food preparation surfaces',
        'Put food back in proper storage place',
      ],
    },
    {
      id: 3,
      name: 'Cleaning',
      status: 'Completed',
      employeeId: 'E3',
      completed: true,
      details: [
        'Wipe down and sanitize all surface',
        'Tuck chairs back into place',
        'Tuck chairs back into place',
      ],
    },
    {
      id: 4,
      name: 'Food Safety',
      status: 'In Progess',
      employeeId: 'E4',
      completed: false,
      details: [
        'Disinfect food preparation surfaces',
        'Put food back in proper storage place',
      ],
    },
    {
      id: 5,
      name: 'Cleaning',
      status: 'Completed',
      employeeId: 'E5',
      completed: true,
      details: [
        'Wipe down and sanitize all surface',
        'Tuck chairs back into place',
      ],
    },
    {
      id: 6,
      name: 'Food Safety',
      status: 'In Progess',
      employeeId: 'E6',
      completed: false,
      details: [
        'Disinfect food preparation surfaces',
        'Put food back in proper storage place',
      ],
    },
  ];

  employees: any = [
    {
      id: 'E1',
      name: 'Amit Shah',
    },
    {
      id: 'E2',
      name: 'Narendra Modi',
    },
    {
      id: 'E3',
      name: 'Yogi Bhai',
    },
    {
      id: 'E4',
      name: 'Rahul Gandhi',
    },
    {
      id: 'E5',
      name: 'Arvind Kejriwal',
    },
    {
      id: 'E6',
      name: 'Sonia Gandhi',
    },
  ];

  editMode: boolean = false;
  currentEditId: any = '';

  taskForm: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required]),
    employeeId: new FormControl(null, [Validators.required]),
    details: new FormControl('', [Validators.required]),
  });

  constructor() {}

  ngOnInit(): void {}

  addTask(): void {}

  deleteTask(): void {}

  addDetails(detail: any): void {
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

  getEmployeeName(employeeId: any): string {
    for (const employee of this.employees) {
      if (employee.id == employeeId) {
        return employee.name;
      }
    }
    return '';
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
        this.addDetails(detail);
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
}
