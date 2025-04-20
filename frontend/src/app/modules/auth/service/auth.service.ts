import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';

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
}
