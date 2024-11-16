import { Author } from './../../book-listings/models/index';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Booklisting } from '../../book-listings/models';
import { of, tap } from 'rxjs';

export type BookSearchParams = {
  search: string;
  availabililty: boolean;
  condition: string;
  genre: string;
  author: string;
  location: string;
  limit: number;
  offset: number;
};

@Injectable({
  providedIn: 'root',
})
export class BooksSearchService {
  readonly #http = inject(HttpClient);
  private dataSignal = signal<Booklisting[]>([]);
  data = this.dataSignal.asReadonly();
  limit = 25;
  offset = 0;
  done = false;

  readonly #paramsSignal = signal<Partial<BookSearchParams>>({});
  params = this.#paramsSignal.asReadonly();

  updateParams(params: Partial<BookSearchParams>) {
    this.#paramsSignal.update((p) => ({ ...p, ...params }));
  }

  getBook(id: string) {
    return this.#http.get<Booklisting>(`/api/v1/books/${id}`);
  }

  search(params: Partial<BookSearchParams>) {
    if (this.done) return of([]);
    return this.#http
      .get<Booklisting[]>('/api/v1/books', {
        params: {
          ...params,
          limit: this.limit,
          offset: this.offset,
        },
      })
      .pipe(
        tap((data) => {
          if (data.length < this.limit) this.done = true;
          this.dataSignal.update((d) => [...d, ...data]);
          this.offset += this.limit;
        })
      );
  }

  reset() {
    this.dataSignal.set([]);
    this.offset = 0;
    this.done = false;
  }
}
