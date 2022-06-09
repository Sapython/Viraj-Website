import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { AlertsAndNotificationsService } from 'src/app/services/uiService/alerts-and-notifications.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent {
  signupForm: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
    ]),
    confirmPassword: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
    ]),
    displayName: new FormControl('', [Validators.required]),
  });

  constructor(
    private authService: AuthenticationService,
    private alertify: AlertsAndNotificationsService
  ) {}
  submitLoginForm() {
    if (this.signupForm.valid) {
      this.authService.loginEmailPassword(
        this.signupForm.value.email,
        this.signupForm.value.password
      );
    } else {
      this.alertify.presentToast('Please fill all the required fields');
    }
  }

  loginWithGoogle() {
    this.authService.signInWithGoogle();
  }

}
