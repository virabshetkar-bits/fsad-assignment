export type Author = {
  id: string;
  name: string;
};

export type Genre = {
  id: number;
  name: string;
};

export type BookCondition = 'new' | 'old';

export type CreateBooklistingRequest = {
  title: string;
  authors: string[];
  genres: string[];
  condition: BookCondition;
};

export type EditBooklistingRequest = {
  title?: string;
  authors?: string[];
  genres?: string[];
  condition?: BookCondition;
};

export type Booklisting = {
  id: string;
  title: string;
  genres: Genre[];
  authors: Author[];
  condition: BookCondition;
  available: boolean;
};
