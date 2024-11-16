export type User = {
  id: string;
  full_name: string;
  email: string;
  location: string;
};

export type Token = {
  user: {
    id: string;
    full_name: string;
    email: string;
    location: string;
  };
};
