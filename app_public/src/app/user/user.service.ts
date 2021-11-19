import { Injectable } from '@angular/core';
import { User } from '../Types';
import { USERS } from './mock.users';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor() { }

  private currentUser: User | null = null;
  currentUserInfo() { return this.currentUser; }

  async getAllUsers(): Promise<User[]> {
    // Simulate network delay.
    await new Promise(s => setTimeout(s, 500));
    return USERS;
  }

  async asyncCurrentUserInfo(): Promise<User> {
    if (this.currentUser) return this.currentUser;
    // Simulate network delay.
    await new Promise(s => setTimeout(s, 500));
    const users = await this.getAllUsers();
    return this.currentUser = users[0];
  }

  private userPool:Map<string, User> = new Map();
  async getUserByID(id: string): Promise<User | null> {
    // Simulate network delay.
    await new Promise(s => setTimeout(s, 500));
    if (this.userPool.has(id))
      return this.userPool.get(id) || null;
    const users = await this.getAllUsers();
    return users.find(user => user.id === id) || null;
  }
}
