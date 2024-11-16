import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { LocationData } from '../models/location-data';

@Injectable({
  providedIn: 'root',
})
export class LocationService {
  private http = inject(HttpClient);

  autocomplete(query: string) {
    return this.http.get<LocationData[]>('/api/v1/locations', { params: { query } });
  }
}
