import UserService from "./UserService";
import AuthService from "@/src/common/user/AuthService";
import { useRouter } from 'next/router';
import {Role} from "@/src/common/user/User";

export class UserLogic {
  private authService: AuthService;
  private userService: UserService;
  private router = useRouter();

  constructor() {
    this.authService = new AuthService();
    this.userService = new UserService();
  }

  async fetchUsernames(): Promise<string[]> {
    try {
      const users = await this.userService.fetchUsers();
      return users.map(user => user.username);
    } catch (err) {
      console.error(err);
      throw new Error("Failed to fetch usernames.");
    }
  }

  async fetchUsername() {
    if (!localStorage.getItem('token')) {
      return null;
    }
    try {
      const user = await this.userService.fetchUser();
      return user.username;
    } catch (err) {
      localStorage.removeItem('token');
      return null;
    }
  }

  async fetchCredit() {
    try {
      const user = await this.userService.fetchUser();
      return user.credit;
    } catch (err) {
      console.error(err);
    }
  }

  async fetchPin() {
    try {
      const user = await this.userService.fetchUser();
      return user.pin;
    } catch (err) {
      console.error(err);
    }
  }

  async signIn(username: string, password: string) {
    try {
      const token = await this.authService.fetchToken(username, password);
      localStorage.setItem('token', token);
      const user = await this.userService.fetchUser();
      if (user.roles.includes(Role.Admin)) {
        this.router.push('/admin');
      } else {
        this.router.push('/');
      }
    } catch (err: any) {
      if (err.response && err.response.status === 401) {
        throw new Error("Incorrect Username or Password.");
      } else {
        console.error(err);
        throw new Error("Sign In Fail.");
      }
    }
  }

  async signUp(username: string, password: string) {
    try {
      await this.userService.createUser(username, password);
    } catch (err: any) {
      if (err.response && err.response.status === 409) {
        throw new Error("Username already exists.");
      } else {
        console.error(err);
        throw new Error("Sign Up Fail.");
      }
    }
  }

  async updateUser(username: string, password: string) {
    try {
      await this.userService.updateUser(username, password);
    } catch (err: any) {
      if (err.response && err.response.status === 409) {
        throw new Error("Username already exists.");
      } else {
        console.error(err);
        throw new Error("Update Fail.");
      }
    }
  }

  validateInput(input: string) {
    const asciiRegex = /^[\x20-\x7F]{4,32}$/;
    return asciiRegex.test(input);
  }
}