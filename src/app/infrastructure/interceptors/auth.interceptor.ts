import { HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { getLastEvent } from '@fiap-pos-front-end/fiap-tc-shared';

export const authInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
  const token = getLastEvent('user-logged-in');

  if (!token) {
    return next(req);
  }

  const authReq = req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`,
    },
  });

  return next(authReq);
};
