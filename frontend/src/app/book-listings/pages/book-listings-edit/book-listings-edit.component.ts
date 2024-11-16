import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  FormBuilder,
  Validators,
  FormControl,
  ReactiveFormsModule,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AutocompleteDataService } from '../../../shared/services/autocomplete-data.service';
import { AutocompleteOverlayService } from '../../../shared/services/autocomplete-overlay.service';
import { AuthorAutocompleteService } from '../../services/author-autocomplete.service';
import { BookListingsService } from '../../services/book-listings.service';
import { GenreAutocompleteService } from '../../services/genre-autocomplete.service';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { CdkMenuModule } from '@angular/cdk/menu';
import { Booklisting } from '../../models';

@Component({
  selector: 'app-book-listings-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatIconModule, CdkMenuModule],
  templateUrl: './book-listings-edit.component.html',
  styleUrl: './book-listings-edit.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookListingsEditComponent implements OnDestroy, OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  private autoCompleteOverlay = inject(AutocompleteOverlayService);
  private autoCompleteData = inject(AutocompleteDataService);

  private genreAutoComplete = inject(GenreAutocompleteService);
  private authorAutoComplete = inject(AuthorAutocompleteService);
  private bookListingsService = inject(BookListingsService);

  genreAutoCompleteOpen = false;
  authorAutoCompleteOpen = false;

  booklisting = this.route.snapshot.data['booklisting'] as Booklisting;

  booklistingsForm = this.fb.nonNullable.group({
    title: this.fb.nonNullable.control(this.booklisting.title, [
      Validators.required,
    ]),
    authors: this.fb.nonNullable.array<FormControl<string>>(
      this.booklisting.authors.map((a) => this.fb.nonNullable.control(a.name)),
      [Validators.required]
    ),
    genres: this.fb.nonNullable.array<FormControl<string>>(
      this.booklisting.genres.map((g) => this.fb.nonNullable.control(g.name)),
      [Validators.required]
    ),
    condition: this.fb.nonNullable.control<'old' | 'new'>(
      this.booklisting.condition
    ),
    genre: this.fb.nonNullable.control(''),
    author: this.fb.nonNullable.control(''),
  });

  get titleControl() {
    return this.booklistingsForm.controls.title;
  }

  get authorsArray() {
    return this.booklistingsForm.controls.authors;
  }

  get genresArray() {
    return this.booklistingsForm.controls.genres;
  }

  get genreControl() {
    return this.booklistingsForm.controls.genre;
  }

  get conditionControl() {
    return this.booklistingsForm.controls.condition;
  }

  get authorControl() {
    return this.booklistingsForm.controls.author;
  }

  sub = this.genreControl.valueChanges
    .pipe(takeUntilDestroyed())
    .subscribe((data) => {
      if (data.length < 2) {
        this.autoCompleteData.setData([]);
        this.autoCompleteData.selectItem(0);
        return;
      }
      this.autoCompleteOverlay.updatePosition();

      this.genreAutoComplete.autoComplete(data).subscribe((data) => {
        this.autoCompleteData.setData(
          data.filter(
            (d) =>
              !this.genresArray
                .getRawValue()
                .map((d) => d.toLowerCase())
                .find((g) => g === d.name.toLowerCase())
          )
        );
      });
    });

  /**
   *
   */
  constructor() {
    this.sub.add(
      this.authorControl.valueChanges
        .pipe(takeUntilDestroyed())
        .subscribe((data) => {
          if (data.length < 2) {
            this.autoCompleteData.setData([]);
            this.autoCompleteData.selectItem(null);
            return;
          }
          this.autoCompleteOverlay.updatePosition();

          this.authorAutoComplete.autoComplete(data).subscribe((data) => {
            this.autoCompleteData.setData(
              data.filter(
                (d) =>
                  !this.authorsArray
                    .getRawValue()
                    .map((d) => d.toLowerCase())
                    .find((g) => g === d.name.toLowerCase())
              )
            );
          });
        })
    );
  }

  ngOnInit() {}

  keyDownGenre(event: Event) {
    if (!(event instanceof KeyboardEvent)) return;

    switch (event.key) {
      case 'ArrowUp':
        this.autoCompleteData.prev();
        break;
      case 'ArrowDown':
        this.autoCompleteData.next();
        break;
      case 'Tab':
      case 'Enter':
        const selectedItem = this.autoCompleteOverlay.selectedItem?.()?.name;

        if (!selectedItem) return;
        this.genresArray.controls.push(
          this.fb.nonNullable.control(selectedItem)
        );
        this.genresArray.updateValueAndValidity();
        this.genreControl.patchValue('');
        break;
    }
  }

  keyDownAuthor(event: Event) {
    if (!(event instanceof KeyboardEvent)) return;

    switch (event.key) {
      case 'ArrowUp':
        this.autoCompleteData.prev();
        break;
      case 'ArrowDown':
        this.autoCompleteData.next();
        break;
      case 'Enter':
        let selectedItem =
          this.autoCompleteOverlay.selectedItem?.()?.name ??
          this.authorControl.getRawValue();

        if (selectedItem.trim() === '') return;

        this.authorsArray.controls.push(
          this.fb.nonNullable.control(selectedItem)
        );
        this.authorsArray.updateValueAndValidity();
        this.authorControl.patchValue('');
        break;
    }
  }

  openOverlay(event: Event) {
    if (!(event.target instanceof HTMLElement)) return;
    this.autoCompleteOverlay.setInputControl(event.target);
    this.autoCompleteOverlay.showOverlay();
  }

  closeOverlay(event: Event) {
    this.autoCompleteOverlay.closeOverlay();
  }

  removeGenre(index: number) {
    this.genresArray.removeAt(index);
  }

  removeAuthor(index: number) {
    this.authorsArray.removeAt(index);
  }

  submit() {
    this.bookListingsService
      .editBook(this.booklisting.id, {
        ...this.booklistingsForm.getRawValue(),
      })
      .subscribe(() => {
        this.router.navigate(['/book-listings']);
      });
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
