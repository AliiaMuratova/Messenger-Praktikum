import { BASE_URL } from '../http/config';
import { HTTPTransport } from '../http/HttpTransport';

export interface User {
  id: number;
  first_name: string;
  second_name: string;
  display_name: string | null;
  login: string;
  avatar: string | null;
  email: string;
  phone: string;
}

class UserAPI {
  private http: HTTPTransport;

  constructor() {
    this.http = new HTTPTransport(BASE_URL);
  }

  searchByLogin(login: string): Promise<User[]> {
    return this.http.post('user/search', { data: { login } });
  }
}

export const userAPI = new UserAPI();

