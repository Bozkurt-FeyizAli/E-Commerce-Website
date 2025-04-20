import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { User } from '@models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() { }
  login(form: FormGroup): boolean {
  return true;}
  register(form: FormGroup): boolean{
    return true;
  }
  getUsers(): User[]{
    return [];
  }
}
