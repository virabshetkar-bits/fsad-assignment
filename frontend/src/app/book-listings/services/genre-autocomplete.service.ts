import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { AutoCompleteData } from '../../shared/services/autocomplete-overlay.service';

@Injectable({
  providedIn: 'root',
})
export class GenreAutocompleteService {
  private http = inject(HttpClient);

  autoComplete(query: string) {
    return this.http.get<AutoCompleteData[]>('/api/v1/genres', {
      params: { query },
    });
  }
}
