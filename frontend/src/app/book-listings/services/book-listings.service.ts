import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { AuthService } from '../../auth/services/auth.service';
import { map, Observable, of, tap } from 'rxjs';
import {
  Booklisting,
  CreateBooklistingRequest,
  EditBooklistingRequest,
} from '../models';

@Injectable({
  providedIn: 'root',
})
export class BookListingsService {
  private http = inject(HttpClient);
  private auth = inject(AuthService);

  private booklistingsSignal = signal<Booklisting[]>([]);
  booklistings = this.booklistingsSignal.asReadonly();

  private start = 0;
  private limit = 25;

  getBooks() {
    if (!this.auth.user()) return of([]);
    return this.http
      .get<{ booklistings: Booklisting[] }>(
        `/api/v1/users/${this.auth.user()!.id}/booklistings`,
        { params: { limit: this.limit, offset: this.start } }
      )
      .pipe(
        map((data) => data.booklistings),
        tap((data) => {
          this.booklistingsSignal.update((books) => [...books, ...data]);
          this.start += this.limit;
        })
      );
  }

  getBook(id: string): Observable<null | Booklisting> {
    const user = this.auth.user();
    if (!user) return of(null);
    return this.http.get<Booklisting>(
      `/api/v1/users/${user.id}/booklistings/${id}`
    );
  }

  deleteBook(id: string): Observable<null | Booklisting> {
    const user = this.auth.user();
    if (!user) return of(null);
    return this.http
      .delete<Booklisting>(`/api/v1/users/${user.id}/booklistings/${id}`)
      .pipe(
        tap(() => {
          this.booklistingsSignal.update((books) =>
            books.filter((b) => b.id !== id)
          );
        })
      );
  }

  editBook(
    id: string,
    book: EditBooklistingRequest
  ): Observable<null | Booklisting> {
    const user = this.auth.user();
    if (!user) return of(null);
    return this.http.patch<Booklisting>(
      `/api/v1/users/${user.id}/booklistings/${id}`,
      book
    );
  }

  createBook(book: CreateBooklistingRequest) {
    const userId = this.auth.user()?.id;
    if (!userId) return of(null);
    return this.http
      .post(`/api/v1/users/${userId}/booklistings/`, { ...book })
      .pipe(tap(console.log));
  }

  resetBooks() {
    this.start = 0;
    this.booklistingsSignal.set([]);
  }
}
