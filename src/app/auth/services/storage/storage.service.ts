import { Injectable } from '@angular/core';
import {JwtHelperService} from "@auth0/angular-jwt";

const TOKEN = 'token';
const USER = 'user';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  constructor() {}
  static saveToken(token: string): void {
    window.localStorage.removeItem(TOKEN);
    window.localStorage.setItem(TOKEN, token);
  }

  static saveUser(user: any): void {
    window.localStorage.removeItem(USER);
    window.localStorage.setItem(USER, JSON.stringify(user));
    window.localStorage.setItem(
      'LANG',
      JSON.stringify({
        language: 'English',
        flag: 'us',
      })
    );
  }

  static getToken(): string | null {
    if (typeof localStorage !== 'undefined') {
      return localStorage.getItem(TOKEN)!;
    }
    return null;
  }

  static getlang(): any | null {
    if (typeof localStorage !== 'undefined') {
      return JSON.parse(localStorage.getItem('LANG')!);
    }
    return null;
  }

  static getUser(): any {
    return JSON.parse(localStorage.getItem(USER)!);
  }

  static getUserRole(): string {
    const user = this.getUser();
    if (user == null) return '';
    return user.role;
  }

  static isAdminLoggedIn(): boolean {
    if (this.getToken() === null) return false;
    const role: string = this.getUserRole();
    return role == 'ADMIN';
  }

  static isEmployeeLoggedIn(): boolean {
    if (this.getToken() === null) return false;
    const role: string = this.getUserRole();
    return role == 'EMPLOYEE';
  }

  static getUserId(): string {
    const user = this.getUser();
    if (user == null) return '';
    return user.id;
  }

  static logout(): void {
    window.localStorage.removeItem(TOKEN);
    window.localStorage.removeItem(USER);
  }
  static getUserIdFromToken(): string | null {
    const jwtHelper=new JwtHelperService();
    // Retrieve the token from the local storage using the getToken() method
    const token = StorageService.getToken();

    if (!token) {
      return null; // Return null if token does not exist
    }

    // Decode the token using JwtHelperService
    const decodedToken = jwtHelper.decodeToken(token);

    // Extract and return the 'userId' from the decoded token
    return decodedToken && decodedToken.id ? decodedToken.id : null;
  }
  isTokenNotValid() {
    return !this.isTokenValid();
  }
  private isTokenValid() {
    const token=StorageService.getToken();
    if(!token)
    {
      return false;

    }


    //decode the token
    const jwtHelper=new JwtHelperService();
    //check expiry date
    const isTokenExpired=jwtHelper.isTokenExpired(token);
    if(isTokenExpired)
    {
      localStorage.clear();
      return false;
    }
    return true;
  }

}
