import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../../auth/services/auth.service';

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  if (!auth.token()) return next(req);

  const newReq = req.clone({
    headers: req.headers.append('authorization', `Bearer ${auth.token()}`),
  });

  return next(newReq);
};
