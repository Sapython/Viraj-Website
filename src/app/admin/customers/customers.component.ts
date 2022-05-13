import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
declare const UIkit: any;

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.scss', '../admin.util.scss'],
})
export class CustomersComponent implements OnInit {
  customers: any[] = [
    {
      id: 'sujeet-singh',
      image: 'https://picsum.photos/200/?random=1',
      name: 'Sujeet Singh',
      dob: '2002-01-27',
      gender: 'male',
      grossPurchase: '9000',
      phoneNumber: '9900099000',
      email: 'raghav@goel.com',
      address: 'Amity University, Noida',
      job: 'Proctor',
    },
    {
      id: 'kumar-singh',
      image: 'https://picsum.photos/200/?random=1',
      name: 'Kumar Singh',
      dob: '2002-01-27',
      gender: 'male',
      grossPurchase: '9000',
      phoneNumber: '9900099000',
      email: 'raghav@goel.com',
      address: 'Amity University, Noida',
      job: 'Proctor',
    },
    {
      id: 'dhoni-singh',
      image: 'https://picsum.photos/200/?random=1',
      name: 'Dhoni Singh',
      dob: '2002-01-27',
      gender: 'male',
      grossPurchase: '9000',
      phoneNumber: '9900099000',
      email: 'raghav@goel.com',
      address: 'Amity University, Noida',
      job: 'Proctor',
    },
    {
      id: 'sujeet-khan',
      image: 'https://picsum.photos/200/?random=1',
      name: 'Sujeet Khan',
      dob: '2002-01-27',
      gender: 'male',
      grossPurchase: '9000',
      phoneNumber: '9900099000',
      email: 'raghav@goel.com',
      address: 'Amity University, Noida',
      job: 'Proctor',
    },
  ];
  filteredCustomers: any[] = this.customers;

  @ViewChild('photoInput') photoInput: ElementRef;

  editMode: boolean = false;
  currentEditId: any = '';

  customerForm: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required]),
    dob: new FormControl('', [Validators.required]),
    gender: new FormControl('', [Validators.required]),
    grossPurchase: new FormControl('', [Validators.required]),
    phoneNumber: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    address: new FormControl('', [Validators.required]),
    job: new FormControl('', [Validators.required]),
  });

  constructor() {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    // Set up customer search
    const customerSearchInput = document.getElementById(
      'customer-search-input'
    ) as HTMLInputElement;

    if (customerSearchInput) {
      customerSearchInput.addEventListener(
        'input',
        () => {
          const query = customerSearchInput.value.trim().toLowerCase();
          this.filteredCustomers = this.customers.filter((customer) => {
            return customer.name.toLowerCase().indexOf(query) !== -1;
          });
          this.filteredCustomers.sort((customer1, customer2) => {
            const index1 = customer1.name.toLowerCase().indexOf(query);
            const index2 = customer2.name.toLowerCase().indexOf(query);
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

  addCustomer(): void {}

  editCustomer(customer: any): void {
    this.editMode = true;
    this.currentEditId = customer.id;

    // Patch values
    this.customerForm.patchValue(customer);
    document.documentElement.style.setProperty(
      '--photo-background',
      `url('${customer.image}')`
    );

    const customerModal = document.getElementById('customer-modal');
    if (customerModal) {
      customerModal.addEventListener('hidden', () => {
        this.editMode = false;
        this.currentEditId = '';

        // Reset the form
        this.customerForm.reset();
        document.documentElement.style.setProperty('--photo-background', '');
        this.photoInput.nativeElement.value = '';
      });
      UIkit.modal(customerModal).show();
    }
  }

  deleteCustomer(): void {}
}
