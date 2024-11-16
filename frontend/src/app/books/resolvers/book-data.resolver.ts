import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { BooksSearchService } from '../services/books-search.service';
import { Booklisting } from '../../book-listings/models';

export const bookDataResolver: ResolveFn<Booklisting> = (route, state) => {
  const bookSearch = inject(BooksSearchService);

  return bookSearch.getBook(route.params['id']);
};
