import { Component, OnInit } from '@angular/core';
import { LocalStorageService } from 'angular-web-storage';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/network/api.service';
import { NotifierService } from 'angular-notifier';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  passwordSecure = false;


  loginForm: FormGroup;
  submitted;
  firstName
  lastName
  email;
  password;
  constructor(
    private apiService: ApiService,
    private local: LocalStorageService,
    private formBuilder: FormBuilder,
    private router: Router,
    private notifierService: NotifierService,
  ) { }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
    });

    // this.local.set("isLogged",true);
  }
  get formFields() {
    return this.loginForm.controls;
  }


  PasswordSecure() {
    this.passwordSecure = !this.passwordSecure;
  }

  onSubmit() {
    // console.log(this.email,this.password);

    this.submitted = true;
    if (!this.formFields.email.errors && !this.formFields.password.errors && !this.formFields.firstName.errors && !this.formFields.lastName.errors) {
      let users = this.local.get('users')
      if (users) {
        let allUsers = JSON.parse(users)
        let allEmail = allUsers.map(user => user.email)
        if (!allEmail.includes(this.email)) {
          let body = {
            'email': this.email,
            'password': this.password
          }
          allUsers.push(body)
          this.local.set('users', JSON.stringify(allUsers))
          this.notifierService.notify('success', 'Added Successfully')
          this.router.navigate(['login'])
        } else {
          this.notifierService.notify('warning', 'email already exists')
        }
      } else {
        let body = {
          'email': this.email,
          'password': this.password
        }
        this.local.set('users', JSON.stringify([body]))
        this.router.navigate(['login'])
      }
 }
  }

}
