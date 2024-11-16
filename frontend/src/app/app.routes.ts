import { Routes } from '@angular/router';
import { loggedOutGuard } from './auth/guards/logged-out.guard';
import { loggedInGuard } from './auth/guards/logged-in.guard';
import { serviceAvailableGuard } from './shared/guards/service-available.guard';
import { ServiceUnavailableComponent } from './shared/pages/service-unavailable/service-unavailable.component';
import { bookListingResolver } from './book-listings/resolvers/book-listing.resolver';
import { searchDataResolver } from './books/resolvers/search-data.resolver';
import { bookDataResolver } from './books/resolvers/book-data.resolver';

export const routes: Routes = [
  {
    path: '',
    canActivate: [serviceAvailableGuard],
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'home',
      },
      {
        path: 'home',
        canActivate: [loggedOutGuard],
        loadComponent: () =>
          import('./onboarding/pages/home-page/home-page.component').then(
            (c) => c.HomePageComponent
          ),
      },
      {
        path: 'login',
        canActivate: [loggedOutGuard],
        loadComponent: () =>
          import('./auth/pages/login-page/login-page.component').then(
            (c) => c.LoginPageComponent
          ),
      },
      {
        path: 'register',
        canActivate: [loggedOutGuard],
        loadComponent: () =>
          import('./auth/pages/register-page/register-page.component').then(
            (c) => c.RegisterPageComponent
          ),
      },
      {
        path: 'password-reset',
        canActivate: [loggedOutGuard],
        loadComponent: () =>
          import(
            './auth/pages/password-reset-page/password-reset-page.component'
          ).then((c) => c.PasswordResetPageComponent),
      },
      {
        path: 'book-listings',
        canActivate: [loggedInGuard],
        loadComponent: () =>
          import(
            './book-listings/pages/book-listings/book-listings.component'
          ).then((c) => c.BookListingsComponent),
      },
      {
        path: 'book-listings/create',
        canActivate: [loggedInGuard],
        loadComponent: () =>
          import(
            './book-listings/pages/book-listings-create/book-listings-create.component'
          ).then((c) => c.BookListingsCreateComponent),
      },
      {
        path: 'book-listings/:id/edit',
        canActivate: [loggedInGuard],
        resolve: { booklisting: bookListingResolver },
        loadComponent: () =>
          import(
            './book-listings/pages/book-listings-edit/book-listings-edit.component'
          ).then((c) => c.BookListingsEditComponent),
      },
      {
        path: 'books',
        canActivate: [loggedInGuard],
        resolve: [searchDataResolver],
        loadComponent: () =>
          import('./books/pages/books-search/books-search.component').then(
            (c) => c.BooksSearchComponent
          ),
      },
      {
        path: 'books/:id',
        canActivate: [loggedInGuard],
        resolve: { booklisting: bookDataResolver },
        loadComponent: () =>
          import('./books/pages/book-page/book-page.component').then(
            (c) => c.BookPageComponent
          ),
      },
    ],
  },
  {
    path: 'service-unavailable',
    loadComponent: () =>
      import(
        './shared/pages/service-unavailable/service-unavailable.component'
      ).then((c) => c.ServiceUnavailableComponent),
  },
  {
    path: '**',
    loadComponent: () =>
      import('./shared/pages/not-found/not-found.component').then(
        (c) => c.NotFoundComponent
      ),
  },
];
