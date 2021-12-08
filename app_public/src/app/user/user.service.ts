import { InjectionToken } from '@angular/core';

const BROWSER_STORAGE = new InjectionToken<Storage>('Browser Storage', {
  providedIn: 'root',
  factory: () => localStorage
});

import { Injectable, Inject } from '@angular/core';
import { User } from '../Types';
import { ApiService } from '../api.service';

interface AuthResponse {
  token: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private tokenName = "user-token";
  private currentUser: User | null = null;

  constructor(
    private api: ApiService,
    @Inject(BROWSER_STORAGE) private storage: Storage,
  ) { }

  private getToken(): string {
    return this.storage.getItem(this.tokenName) || "";
  }

  private saveToken(token: string): void {
    this.storage.setItem(this.tokenName, token);
  }

  private decodeTokenToUser(token: string) {
    const { name, ...othersField } = JSON.parse(atob(token.split('.')[1]));
    return { ...othersField, username: name };
  }

  public async login(username: string, password: string): Promise<any> {
    const user = { name: username, password, };
    return this.api.makeApiCall("put", "usr", { body: user, })
      .then((authResp: AuthResponse) => {
        this.saveToken(authResp.token);
        this.currentUser = this.decodeTokenToUser(authResp.token);
      });
  }

  public async register(username: string, password: string, email: string): Promise<any> {
    const user = { name: username, password, email, };
    return this.api.makeApiCall("post", "usr", { body: user })
      .then((authResp: AuthResponse) => {
        this.saveToken(authResp.token);
        return {success: true};
      });
  }

  public async signOut() {
    this.currentUser = null;
    this.storage.removeItem(this.tokenName);
  }

  public isLoggedIn(): boolean {
    const token: string = this.getToken();
    return (!!token) && JSON.parse(atob(token.split('.')[1])).exp > (Date.now() / 1000);
  }

  public getCurrentUser(): User | null {
    if (!this.isLoggedIn()) return null;
    if (this.currentUser) return this.currentUser;
    return this.currentUser = this.decodeTokenToUser(this.getToken());
  }

  public async getUserByID(id: string): Promise<User | null> {
    if (id == this.currentUser?._id) return this.currentUser;
    return this.api.makeApiCall("get", "usr/" + id)
    .then((resp: AuthResponse) => this.decodeTokenToUser(resp.token), () => Promise.resolve(null));
  }

  public async getUserByNameOrEmail({name = "", email = ""}: any = {}) {
    if (!name && !email) return null;
    const usrs = await this.api.makeApiCall("get", `usr?name=${name}&email=${email}`);
    return this.decodeTokenToUser(usrs[0].token);
  }
}
