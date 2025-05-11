import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../service/user.service';
import { User } from 'app/shared/models/user';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-edit',
  standalone: false,
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.css']
})
export class UserEditComponent implements OnInit {
  form!: FormGroup;
  user!: User;
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.userService.getCurrentUser().subscribe({
      next: (user) => {
        this.user = user;
        this.form = this.fb.group({
          firstName: [user.firstName, Validators.required],
          lastName: [user.lastName, Validators.required],
          email: [user.email, [Validators.required, Validators.email]],
          phoneNumber: [user.phoneNumber],
          addressLine: [user.addressLine],
          city: [user.city],
          state: [user.state],
          postalCode: [user.postalCode],
          country: [user.country]
        });
      },
      error: (err) => console.error('User fetch error', err)
    });
  }

  submit(): void {
    if (this.form.invalid) return;
    this.isSubmitting = true;
    const updatedUser: User = { ...this.user, ...this.form.value };

    this.userService.updateUser(updatedUser).subscribe({
      next: () => {
        this.isSubmitting = false;
        alert("Profiliniz başarıyla güncellendi.");
        this.router.navigate(['/user/profile']);
      },
      error: (err) => {
        this.isSubmitting = false;
        alert("Güncelleme sırasında bir hata oluştu.");
        console.error('Update failed', err);
      }
    });
  }
}
