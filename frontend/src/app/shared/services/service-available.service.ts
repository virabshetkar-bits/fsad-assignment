import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, map, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ServiceAvailableService {
  private http = inject(HttpClient);

  serviceAvailable() {
    return this.http.get<{ status: string }>('/api/v1/status').pipe(
      map(({ status }) => {
        return status === 'online';
      }),
      catchError(() => {
        return of(false);
      })
    );
  }
}
