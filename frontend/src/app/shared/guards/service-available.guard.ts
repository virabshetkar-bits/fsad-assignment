import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { ServiceAvailableService } from '../services/service-available.service';
import { map } from 'rxjs';

export const serviceAvailableGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);

  return inject(ServiceAvailableService)
    .serviceAvailable()
    .pipe(
      map((isServiceAvailable) => {
        if (isServiceAvailable) return true;
        return router.parseUrl('/service-unavailable');
      })
    );
};
