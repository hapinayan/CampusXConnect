import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (
  req,
  next
) => {

  // =====================================================
  // DO NOT ATTACH TOKEN FOR LOGIN / REGISTER
  // =====================================================

  const isAuthRequest =
    req.url.toLowerCase().includes('/auth/login') ||
    req.url.toLowerCase().includes('/auth/register');


  if (isAuthRequest) {

    return next(req);

  }


  // =====================================================
  // GET SAVED TOKEN
  // =====================================================

  const token =
    localStorage.getItem('token');


  // =====================================================
  // ATTACH TOKEN
  // =====================================================

  if (token) {

    const authReq =
      req.clone({

        setHeaders: {

          Authorization:
            `Bearer ${token}`

        }

      });


    return next(authReq);

  }


  // =====================================================
  // NO TOKEN
  // =====================================================

  return next(req);

};