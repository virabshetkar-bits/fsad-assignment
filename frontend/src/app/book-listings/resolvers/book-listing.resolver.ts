import { ResolveFn } from '@angular/router';
import { Booklisting } from '../models';
import { inject } from '@angular/core';
import { BookListingsService } from '../services/book-listings.service';

export const bookListingResolver: ResolveFn<Booklisting | null> = (route, state) => {
  return inject(BookListingsService).getBook(route.params['id']);
};
