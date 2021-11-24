import { Injectable } from '@angular/core';
import { User } from '../Types';
import { USERS } from './mock.users';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor() {
    // localStorage.clear();
  }

  private currentUser: User | null = null;
  currentUserInfo() { console.log(this.currentUser); return this.currentUser; }

  async getAllUsers(): Promise<User[]> {
    // Simulate network delay.
    await new Promise(s => setTimeout(s, 500));
    return USERS;
  }

  async asyncCurrentUserInfo(): Promise<User | null> {
    if (this.currentUser) return this.currentUser;
    let uid = localStorage.getItem("userID");
    console.log(uid, this.currentUser);
    if (uid) {
      return this.currentUser = await this.getUserByID(uid);
    }
    return null;
    // // Simulate network delay.
    // await new Promise(s => setTimeout(s, 500));
    // const users = await this.getAllUsers();
    // const user = this.currentUser = users[0];
    // localStorage.setItem("userID", user.id);
    // return user;
  }

  private userPool:Map<string, User> = new Map();
  async getUserByID(id: string): Promise<User | null> {
    // Simulate network delay.
    await new Promise(s => setTimeout(s, 500));
    if (this.userPool.has(id))
      return this.userPool.get(id) || null;
    const users = await this.getAllUsers();
    const user = users.find(user => user.id === id) || null;
    user && this.userPool.set(user.id, user);
    return user;
  }

  async registerUser(username: string, password: string, email: string) {
    // Simulate network delay.
    await new Promise(s => setTimeout(s, 500));
    const usr = <any>{
      id: "user id " + (USERS.length + 1),
      username,
      password,
      email,
      email_verified: false,
    };
    USERS.push(usr);
    this.userPool.set(usr.id, usr);
  }
  async login(username: string, password: string) {
    // Simulate network delay.
    await new Promise(s => setTimeout(s, 500));
    const usr = USERS.find(u => u.username == username);
    if (usr) {
      this.currentUser = usr;
      localStorage.setItem("userID", usr.id);
      return false;
    }
    else return true;
  }
  async signOut() {
    localStorage.removeItem("userID");
    console.log(localStorage.getItem("userID"));
    this.currentUser = null;
  }
}
