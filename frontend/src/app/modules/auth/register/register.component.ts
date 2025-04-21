import { AuthService } from '../service/auth.service';
import { Component } from '@angular/core';
import {FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: false,
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  registerForm: FormGroup;

  constructor(private formBuilder: FormBuilder, private authService: AuthService, private router: Router) {
    this.registerForm = this.formBuilder.group({
      username: new FormControl(''),
      email: new FormControl(''),
      password: new FormControl(''),
      confirmPassword: new FormControl(''),
      registrationDate: new FormControl(new Date()),
      terms: new FormControl(false),
    });
  }

  onSubmit() {
    if (this.registerForm.valid) {
      this.authService.register(this.registerForm.value).subscribe({
        next: (res) => {
          console.log('Kayıt başarılı:', res);
          this.router.navigate(['login']);
        },
        error: (err) => {
          console.error('Kayıt başarısız:', err);
        }
      });
    } else {
      console.log('Form is invalid');
    }
  }

}
