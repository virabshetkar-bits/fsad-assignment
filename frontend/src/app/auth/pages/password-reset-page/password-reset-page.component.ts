import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { passwordMatchValidator } from '../../validators/password-match.validator';
import { AuthService } from '../../services/auth.service';
import { catchError, of } from 'rxjs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-password-reset-page',
  standalone: true,
  imports: [ReactiveFormsModule, MatProgressSpinnerModule, RouterLink],
  templateUrl: './password-reset-page.component.html',
  styleUrl: './password-reset-page.component.scss',
})
export class PasswordResetPageComponent {
  private route = inject(ActivatedRoute);
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);

  loading = false;
  state = "initial";

  hasCode = !!(
    this.route.snapshot.queryParams['code'] &&
    this.route.snapshot.queryParams['rid']
  );

  emailForm = this.fb.nonNullable.group({
    email: this.fb.nonNullable.control('', [
      Validators.required,
      Validators.email,
    ]),
  });

  passwordResetForm = this.fb.nonNullable.group(
    {
      password: this.fb.nonNullable.control('', [
        Validators.required,
        Validators.minLength(5),
      ]),
      retypePassword: this.fb.nonNullable.control('', [Validators.required]),
    },
    { validators: [passwordMatchValidator('password', 'retypePassword')] }
  );

  get passwordControl() {
    return this.passwordResetForm.controls.password;
  }

  get retypePasswordControl() {
    return this.passwordResetForm.controls.retypePassword;
  }

  get emailControl() {
    return this.emailForm.controls.email;
  }

  sendEmail() {
    if (this.emailForm.invalid) return;
    this.loading = true;
    const { email } = this.emailForm.getRawValue();
    this.auth
      .sendPasswordResetEmail(email)
      .pipe(
        catchError((err) => {
          this.emailControl.setErrors({ user_does_not_exist: true });
          this.loading = false;
          return of();
        })
      )
      .subscribe(() => {
        this.loading = false;
        this.state = "success";
      });
  }

  resetPassword() {
    if (this.passwordResetForm.valid) {
      const id = this.route.snapshot.queryParams['rid'];
      const code = this.route.snapshot.queryParams['code'];
      const { password } = this.passwordResetForm.getRawValue();

      this.loading = true;

      this.auth
        .resetPassword(id, code, password)
        .pipe(
          catchError((err) => {
            this.passwordResetForm.setErrors({ invalid_context: true });
            this.loading = false;
            return of();
          })
        )
        .subscribe(() => {
          this.loading = false;
          this.state = "success";
        });
    }
  }
}
