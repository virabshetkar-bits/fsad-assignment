import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ScrollService } from '../../../shared/services/scroll.service';
import { BookListingsItemComponent } from '../../components/book-listings-item/book-listings-item.component';
import { BookListingsService } from '../../services/book-listings.service';
import { Router, RouterLink } from '@angular/router';
import { Booklisting } from '../../models';

@Component({
  selector: 'app-book-listings',
  standalone: true,
  imports: [
    BookListingsItemComponent,
    MatIconModule,
    MatButtonModule,
    RouterLink,
  ],
  templateUrl: './book-listings.component.html',
  styleUrl: './book-listings.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookListingsComponent {
  private booklistingService = inject(BookListingsService);
  readonly #router = inject(Router);
  books = this.booklistingService.booklistings;
  nearBottom = inject(ScrollService).nearBottom;
  loading = false;

  constructor() {
    effect(() => {
      if (this.nearBottom()) {
        this.loading = true;
        this.booklistingService.getBooks().subscribe(() => {
          this.loading = false;
        });
      }
    });
  }

  ngOnInit() {
    this.loading = true;
    this.booklistingService.getBooks().subscribe(() => {
      this.loading = false;
    });
  }

  ngOnDestroy() {
    this.booklistingService.resetBooks();
  }

  handleDelete(book: Booklisting) {
    this.booklistingService.deleteBook(book.id).subscribe();
  }

  handleEdit(book: Booklisting) {
    this.#router.navigate(['book-listings', book.id, 'edit']);
  }
}
