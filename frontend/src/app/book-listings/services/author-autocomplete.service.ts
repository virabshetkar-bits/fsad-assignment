import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Author } from '../models';

@Injectable({
  providedIn: 'root',
})
export class AuthorAutocompleteService {
  private http = inject(HttpClient);

  autoComplete(query: string) {
    return this.http.get<Author[]>('/api/v1/authors', { params: { query } });
  }
}
