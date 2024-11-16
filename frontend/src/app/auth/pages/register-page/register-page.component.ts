import { Component, inject, OnInit, viewChild } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { passwordMatchValidator } from '../../validators/password-match.validator';
import { LocationService } from '../../../shared/services/location.service';
import { catchError, Observable, of } from 'rxjs';
import { LocationData } from '../../../shared/models/location-data';
import { AsyncPipe, JsonPipe } from '@angular/common';
import { AutocompleteComponent } from '../../../shared/components/autocomplete/autocomplete.component';
import { OverlayModule } from '@angular/cdk/overlay';
import { AuthService } from '../../services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { AutocompleteDataService } from '../../../shared/services/autocomplete-data.service';
import { AutocompleteOverlayService } from '../../../shared/services/autocomplete-overlay.service';

@Component({
  selector: 'app-register-page',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    JsonPipe,
    AsyncPipe,
    AutocompleteComponent,
    OverlayModule,
    MatProgressSpinner,
    RouterLink,
  ],
  templateUrl: './register-page.component.html',
  styleUrl: './register-page.component.scss',
})
export class RegisterPageComponent implements OnInit {
  private fb = inject(FormBuilder);
  private locationService = inject(LocationService);
  private autoCompleteData = inject(AutocompleteDataService);
  private autoCompleteOverlay = inject(AutocompleteOverlayService);
  private auth = inject(AuthService);

  state = 'initial';

  autocompleteOpen = true;
  authError = '';
  loading = false;
  selectedItem = this.autoCompleteData.selectedItem;

  registerForm = this.fb.nonNullable.group(
    {
      full_name: this.fb.nonNullable.control('', [Validators.required]),
      location: this.fb.nonNullable.control('', [Validators.required]),
      email: this.fb.nonNullable.control('', [
        Validators.required,
        Validators.email,
      ]),
      password: this.fb.nonNullable.control('', [
        Validators.required,
        Validators.minLength(6),
      ]),
      retypePassword: this.fb.nonNullable.control('', [Validators.required]),
    },
    { validators: [passwordMatchValidator('password', 'retypePassword')] }
  );

  get fullNameControl() {
    return this.registerForm.controls.full_name;
  }
  get locationControl() {
    return this.registerForm.controls.location;
  }
  get emailControl() {
    return this.registerForm.controls.email;
  }
  get passwordControl() {
    return this.registerForm.controls.password;
  }
  get retypePasswordControl() {
    return this.registerForm.controls.retypePassword;
  }

  ngOnInit(): void {
    this.locationControl.valueChanges.subscribe((value) => {
      if (value.length > 2) {
        this.locationService.autocomplete(value).subscribe((data) => {
          this.autoCompleteData.setData(data);
        });
      } else {
        this.autoCompleteData.setData([]);
      }
    });
  }

  handleKeyDown(event: Event) {
    if (!(event instanceof KeyboardEvent)) return;
    switch (event.key) {
      case 'ArrowDown':
        this.autoCompleteData.next();
        break;
      case 'ArrowUp':
        this.autoCompleteData.prev();
        break;
      case 'Enter':
        const selectedItem = this.selectedItem();
        if (selectedItem) this.locationControl.patchValue(selectedItem.name);
        this.autoCompleteOverlay.closeOverlay();
        break;
    }
  }

  onFocus(event: Event) {
    if (event.target instanceof HTMLElement)
      this.autoCompleteOverlay.setInputControl(event.target);
    this.autoCompleteOverlay.showOverlay();
  }

  onBlur() {
    this.autoCompleteOverlay.closeOverlay();
  }

  submit() {
    if (this.registerForm.invalid) return;
    this.loading = true;
    const { full_name, email, password, location } =
      this.registerForm.getRawValue();
    this.auth
      .register({
        full_name,
        email,
        password,
        location,
      })
      .pipe(
        catchError((err) => {
          this.authError = err.error.message;
          this.loading = false;
          return of();
        })
      )
      .subscribe(() => {
        this.state = 'success';
        this.loading = false;
      });
  }
}
