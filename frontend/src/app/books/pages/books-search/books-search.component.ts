import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { BookListingsItemComponent } from '../../../book-listings/components/book-listings-item/book-listings-item.component';
import { Booklisting } from '../../../book-listings/models';
import { BooksSearchService } from '../../services/books-search.service';
import { ScrollService } from '../../../shared/services/scroll.service';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AutocompleteDataService } from '../../../shared/services/autocomplete-data.service';
import { AutocompleteOverlayService } from '../../../shared/services/autocomplete-overlay.service';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../auth/services/auth.service';

@Component({
  selector: 'app-books-search',
  standalone: true,
  imports: [CommonModule, BookListingsItemComponent, FormsModule],
  templateUrl: './books-search.component.html',
  styleUrl: './books-search.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BooksSearchComponent implements OnInit {
  #booksService = inject(BooksSearchService);
  #route = inject(ActivatedRoute);
  #router = inject(Router);
  books = inject(BooksSearchService).data;
  #nearBottom = inject(ScrollService).nearBottom;
  user = inject(AuthService).user;

  showCurrentLocation = false;
  genre = '';
  author = '';
  showAvailable = false;
  showNew = false;

  autoCompleteData = inject(AutocompleteDataService);
  autoCompleteOverlay = inject(AutocompleteOverlayService);

  constructor() {
    effect(() => {
      if (this.#nearBottom()) {
        this.#booksService
          .search({ ...this.#route.snapshot.queryParams })
          .subscribe(() => {});
      }
    });
  }

  ngOnInit(): void {
    this.genre = this.#route.snapshot.queryParams['genre'] ?? '';
    this.author = this.#route.snapshot.queryParams['author'] ?? '';
    this.showAvailable =
      this.#route.snapshot.queryParams['showAvailable'] ?? false;
    this.showCurrentLocation =
      this.#route.snapshot.queryParams['showCurrentLocation'] ?? false;
    this.showNew = this.#route.snapshot.queryParams['showNew'] ?? false;
    this.filterChange
  }

  sub = this.#route.queryParams.pipe(takeUntilDestroyed()).subscribe(() => {
    this.#booksService.reset();
    this.#booksService
      .search({ ...this.#route.snapshot.queryParams })
      .subscribe(() => {});
  });

  handleClick(book: Booklisting) {
    this.#router.navigate(['/books', book.id]);
  }

  filterChange() {
    this.#booksService.updateParams({
      location: this.showCurrentLocation
        ? this.user()?.location.name
        : undefined,
      condition: this.showNew ? 'New' : undefined,
      genre: this.genre,
      author: this.author,
      availabililty: this.showAvailable ? true : undefined,
    });
  }
}
