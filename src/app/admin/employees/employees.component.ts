import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DatabaseService } from 'src/app/services/database.service';
import Fuse from 'fuse.js';
import { BlurSiteService } from 'src/app/services/blur-site.service';
import { DateService } from 'src/app/services/date.service';
import { AlertsAndNotificationsService } from 'src/app/services/uiService/alerts-and-notifications.service';
import { DataProvider } from 'src/app/providers/data.provider';
declare const UIkit: any;

@Component({
  selector: 'app-employees',
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.scss', '../admin.util.scss'],
})
export class EmployeesComponent implements OnInit {
  employees: any[];
  filteredEmployees: any[];
  editMode: boolean = false;
  file: File | null;
  currentEditId: any = '';
  currentDeleteId: string = '';

  employeeForm: FormGroup = new FormGroup({
    image: new FormControl(''),
    name: new FormControl('', [Validators.required]),
    post: new FormControl(''),
    dob: new FormControl(''),
    yearStartedWork: new FormControl(''),
    phoneNumber: new FormControl(''),
    aadharNumber: new FormControl(''),
    address: new FormControl(''),
    upiAddress: new FormControl(''),
    paymentMethod: new FormControl(''),
    accountHolderName: new FormControl(''),
    bankName: new FormControl(''),
    accountNumber: new FormControl(''),
    ifscCode: new FormControl(''),
    panNo: new FormControl(''),
  });

  constructor(
    private databaseService: DatabaseService,
    private alertService: AlertsAndNotificationsService,
    private dataProvider: DataProvider,
    public dateService: DateService
  ) {}

  ngOnInit(): void {
    this.employees = [];
    this.databaseService.getEmployees().then((docs) => {
      docs.forEach((doc) => {
        this.employees.push({ id: doc.id, ...doc.data() });
      });
      this.filteredEmployees = this.employees;
    }).catch((error)=>{
      this.alertService.presentToast(error, 'error');
    });
  }

  ngAfterViewInit(): void {
    // Set up employee search
    const employeeSearchInput = document.getElementById(
      'employee-search-input'
    ) as HTMLInputElement;
    if (employeeSearchInput) {
      employeeSearchInput.addEventListener(
        'input',
        () => {
          const query = employeeSearchInput.value.trim();
          if (query.length > 0) {
            const options = { keys: ['name'] };
            const fuse = new Fuse(this.employees, options);
            const results = fuse.search(query);
            this.filteredEmployees = [];
            results.forEach((result: any) => {
              this.filteredEmployees.push(result.item);
            });
          } else {
            this.filteredEmployees = this.employees;
          }
        },
        false
      );
    }
  }


  getExperience(yearStartedWork: any): any {
    if (yearStartedWork) {
      const currentYear = new Date().getFullYear();
      const difference = Math.max(currentYear - yearStartedWork, 0);
      if (difference === 1) {
        return difference + ' year';
      }
      return difference + ' years';
    }
  }

  validatePhoto(event: Event): void {
    const target = event.target as HTMLInputElement;
    const files = target.files;
    if (files && files.length > 0) {
      const file = files[0];
      var fileIsValid = false;
      if (!['image/png', 'image/jpeg', 'image/jpg'].includes(file.type)) {
        this.alertService.presentToast(
          'Only png, jpeg and jpg image is allowed',
          'error'
        );
      } else if (file.size >= 100_000) {
        this.alertService.presentToast(
          "The image's size must be less than 100 Kb",
          'error'
        );
      } else {
        fileIsValid = true;
        this.file = file;
      }
      if (!fileIsValid) {
        target.value = '';
      }
    }
  }

  async submit(): Promise<void> {
    if (this.employeeForm.valid) {
      this.dataProvider.pageSetting.blur = true;

      // Upload image if it's selected
      if (this.file) {
        await this.databaseService
          .upload('employees/' + new Date().getTime(), this.file)
          .then((url) => {
            this.employeeForm.value.image = url;
          });
      }
      
      if (this.editMode) {
        this.databaseService
          .editEmployee(this.currentEditId, this.employeeForm.value)
          .then(() => {
            UIkit.modal(document.getElementById('employee-modal')).hide();
            this.ngOnInit();
            this.dataProvider.pageSetting.blur = false;;
            this.alertService.presentToast(
              'Employee edited successfully',
              'info'
            );
          });
      } else {
        this.databaseService.addEmployee(this.employeeForm.value).then(() => {
          UIkit.modal(document.getElementById('employee-modal')).hide();
          this.employeeForm.reset();
          (document.getElementById('photo-input') as HTMLInputElement).value = '';
          this.file = null;
          this.ngOnInit();
          this.dataProvider.pageSetting.blur = false;;
          this.alertService.presentToast('Employee added successfully', 'info');
        });
      }
    } else {
      this.alertService.presentToast(
        'Please fill all the required fields.',
        'error'
      );
    }
  }

  editEmployee(employee: any): void {
    this.editMode = true;
    this.currentEditId = employee.id;

    // Patch values
    this.employeeForm.patchValue(employee);

    const employeeModal = document.getElementById('employee-modal');
    if (employeeModal) {
      employeeModal.addEventListener('hidden', () => {
        this.editMode = false;
        this.currentEditId = '';

        // Reset the form
        this.employeeForm.reset();
        (document.getElementById('photo-input') as HTMLInputElement).value = '';
        this.file = null;
      });
      UIkit.modal(employeeModal).show();
    }
  }

  deleteEmployee(): void {
    this.dataProvider.pageSetting.blur = true;
    this.databaseService.deleteEmployee(this.currentDeleteId).then(() => {
      this.ngOnInit();
      this.dataProvider.pageSetting.blur = false;;
      this.alertService.presentToast('Employee deleted successfully', 'info');
    });
  }

  log(paymentType: any): void {
    console.log(paymentType);
  }
  
}
