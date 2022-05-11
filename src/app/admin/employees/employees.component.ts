import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
declare const UIkit: any;

@Component({
  selector: 'app-employees',
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.scss', '../admin.util.scss'],
})
export class EmployeesComponent implements OnInit {
  employees: any[] = [
    {
      id: 'sujeet-singh',
      image: 'https://picsum.photos/200/?random=1',
      name: 'Sujeet Singh',
      post: 'Manager',
      dob: '2002-01-27',
      yearStartedWork: '2019',
      phoneNumber: '+11 121-212-212',
      aadharNumber: '1233 1223 1222',
      address: 'cuttuck',
      paymentMethod: 'UPI',
      accountHolderName: 'John Doe',
      accountNumber: '1223 1122 383',
    },
    {
      id: 'kumar-yadav',
      image: 'https://picsum.photos/200/?random=1',
      name: 'Kumar Yadav',
      post: 'Manager',
      dob: '2002-01-27',
      yearStartedWork: '2020',
      phoneNumber: '+11 121-212-212',
      aadharNumber: '1233 1223 1222',
      address: 'cuttuck',
      paymentMethod: 'UPI',
      accountHolderName: 'John Doe',
      accountNumber: '1223 1122 383',
    },
    {
      id: 'mohit-bling',
      image: 'https://picsum.photos/200/?random=1',
      name: 'Mohit Bling',
      post: 'Manager',
      dob: '2002-01-27',
      yearStartedWork: '2024',
      phoneNumber: '+11 121-212-212',
      aadharNumber: '1233 1223 1222',
      address: 'cuttuck',
      paymentMethod: 'UPI',
      accountHolderName: 'John Doe',
      accountNumber: '1223 1122 383',
    },
    {
      id: 'jhopdi-goyal',
      image: 'https://picsum.photos/200/?random=1',
      name: 'Jhopdi Goyal',
      post: 'Manager',
      dob: '2002-01-27',
      yearStartedWork: '2022',
      phoneNumber: '+11 121-212-212',
      aadharNumber: '1233 1223 1222',
      address: 'cuttuck',
      paymentMethod: 'UPI',
      accountHolderName: 'John Doe',
      accountNumber: '1223 1122 383',
    },
  ];
  filteredEmployees: any[] = this.employees;

  @ViewChild('photoInput') photoInput: ElementRef;

  editMode: boolean = false;
  currentEditId: any = '';

  employeeForm: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required]),
    post: new FormControl('', [Validators.required]),
    dob: new FormControl('', [Validators.required]),
    yearStartedWork: new FormControl('', [Validators.required]),
    phoneNumber: new FormControl('', [Validators.required]),
    aadharNumber: new FormControl('', [Validators.required]),
    address: new FormControl('', [Validators.required]),
    paymentMethod: new FormControl('', [Validators.required]),
    accountHolderName: new FormControl('', [Validators.required]),
    accountNumber: new FormControl('', [Validators.required]),
  });

  constructor() {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    // Set up employee search
    const employeeSearchInput = document.getElementById(
      'employee-search-input'
    ) as HTMLInputElement;

    if (employeeSearchInput) {
      employeeSearchInput.addEventListener(
        'input',
        () => {
          const query = employeeSearchInput.value.trim().toLowerCase();
          this.filteredEmployees = this.employees.filter((employee) => {
            return employee.name.toLowerCase().indexOf(query) !== -1;
          });
          this.filteredEmployees.sort((employee1, employee2) => {
            const index1 = employee1.name.toLowerCase().indexOf(query);
            const index2 = employee2.name.toLowerCase().indexOf(query);
            return index1 - index2;
          });
        },
        false
      );
    }
  }

  getAge(dob: any): any {
    const date = new Date(dob);
    if (date) {
      const today = new Date();
      const difference = today.getTime() - date.getTime();
      const years = Math.round(difference / 31_556_952_000);
      return years;
    }
    return '';
  }

  getExperience(yearStartedWork: any): any {
    const currentYear = new Date().getFullYear();
    const difference = Math.max(currentYear - yearStartedWork, 0);
    return difference;
  }

  imageSelected(): void {
    var selectionIsValid = true;
    const file = this.photoInput.nativeElement.files[0];

    if (this.photoInput.nativeElement.files.length != 1) {
      selectionIsValid = false;
      this.photoInput.nativeElement.value = '';
    } else if (!['image/png', 'image/jpg', 'image/jpeg'].includes(file.type)) {
      alert('Your photo should either be in .png or .jpg');
      selectionIsValid = false;
      this.photoInput.nativeElement.value = '';
    } else if (file.size > 100_000) {
      alert("Your photo's size should not exceed 100 KB");
      selectionIsValid = false;
      this.photoInput.nativeElement.value = '';
    }

    if (selectionIsValid) {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onload = () => {
        document.documentElement.style.setProperty(
          '--photo-background',
          `url('${fileReader.result}')`
        );
      };
    } else {
      document.documentElement.style.setProperty('--photo-background', '');
    }
  }

  addEmployee(): void {}

  editEmployee(employee: any): void {
    this.editMode = true;
    this.currentEditId = employee.id;

    // Patch values
    this.employeeForm.patchValue(employee);
    document.documentElement.style.setProperty(
      '--photo-background',
      `url('${employee.image}')`
    );

    const employeeModal = document.getElementById('employee-modal');
    if (employeeModal) {
      employeeModal.addEventListener('hidden', () => {
        this.editMode = false;
        this.currentEditId = '';

        // Reset the form
        this.employeeForm.reset();
        document.documentElement.style.setProperty('--photo-background', '');
        this.photoInput.nativeElement.value = '';
      });
      UIkit.modal(employeeModal).show();
    }
  }

  deleteEmployee(): void {}
}
