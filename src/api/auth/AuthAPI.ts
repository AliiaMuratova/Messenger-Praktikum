import { HTTPTransport } from '../http/HttpTransport';
import { BASE_URL } from '../http/config';

export interface SignInData {
  login: string;
  password: string;
}

export interface SignUpData {
  first_name: string;
  second_name: string;
  login: string;
  email: string;
  password: string;
  phone: string;
}

export interface UserData {
  id: number;
  first_name: string;
  second_name: string;
  display_name: string;
  login: string;
  email: string;
  phone: string;
  avatar: string;
}

class AuthAPI {
  private http: HTTPTransport;

  constructor() {
    this.http = new HTTPTransport(BASE_URL);
  }

  signIn(data: SignInData): Promise<void> {
    return this.http.post('auth/signin', { data });
  }

  signUp(data: SignUpData): Promise<{ id: number }> {
    return this.http.post('auth/signup', { data });
  }

  getUser(): Promise<UserData> {
    return this.http.get('auth/user');
  }

  logout(): Promise<void> {
    return this.http.post('auth/logout');
  }
}

export const authAPI = new AuthAPI();

