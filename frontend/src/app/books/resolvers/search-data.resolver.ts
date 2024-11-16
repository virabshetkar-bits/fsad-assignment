import { map } from 'rxjs';
import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { BooksSearchService } from '../services/books-search.service';

export const searchDataResolver: ResolveFn<boolean> = (route, state) => {
  const bookSearch = inject(BooksSearchService);
  const search = route.queryParams['search'];
  const location = route.queryParams['location'];
  const availabililty = route.queryParams['availability'];

  bookSearch.reset();

  return bookSearch
    .search({ search, location, availabililty, condition: "New" })
    .pipe(map(() => true));
};
