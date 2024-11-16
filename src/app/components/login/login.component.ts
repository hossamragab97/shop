import { Component, OnInit } from '@angular/core';
import { LocalStorageService } from 'angular-web-storage';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/network/api.service';
import { first } from 'rxjs/operators';
import { NotifierService } from 'angular-notifier';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  passwordSecure = false;


  loginForm: FormGroup;
  submitted;
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
    this.submitted = true;
    let users = this.local.get('users')
    if (users) {
      let allUsers = JSON.parse(users)
      const objectToCheck = { email: this.email, password: this.password };

      const exists = allUsers.some(
        item => item.email === objectToCheck.email && item.password === objectToCheck.password
      )
      if (exists) {
        this.local.set('token', objectToCheck)
        this.router.navigate(['home']).then(() => {
          window.location.reload();
        });
      } else {
        this.notifierService.notify('error', 'Email or password is incorrect')
      }
    } else {
      this.notifierService.notify('error', 'Email or password is incorrect')
    }

    // if (!this.formFields.email.errors && !this.formFields.password.errors) {
    //   this.apiService.login(this.email, this.password).pipe(first()).subscribe((data) => {
    //     // store user details and jwt token in local storage to keep user logged in between page refreshes
    //     if (data["responseCode"] == 200) {
    //       // console.log("data",data);
    //       // localStorage.setItem('authMail', this.email);
    //       // this.local.set('authPassword', this.password);
    //       // this.success = true;
    //       this.local.set('currentUser', JSON.stringify(data),1,'d');
    //       var currentUser = this.local.get('currentUser');
    //       currentUser = JSON.parse(currentUser);
    //       var entity = currentUser["entity"][0];
    //       var accountType = entity['accountType'];

    //       this.apiService.getCountry();


    //       if(accountType==1){
    //         window.location.href = 'admin';
    //       }else{
    //         window.location.href = 'home';
    //       }
    //       console.log("entity" , entity['accountType'])
    //       // let leftDays = entity.leftDays;

    //     }
    //   },
    //     error => {
    //       console.log("error",error);
    //       this.notifierService.notify('error' , error.error.message)
    //       // $.notify({ message: error.error.message }, { type: "danger" });
    //         // this.translate.get(error.error.message).subscribe(res => {
    //         //   this.notifierService.notify("error", res);
    //         // });
    //         return;
    //     });
    //   // console.log("xasxasxas");
    //   // this.local.set("isLogged",true);
    //   // window.location.href = 'dashboard';
    // }
  }

  // onSubmit(){
  //   console.log('dfdsjkfdsjhbfhdsvbf')
  //   // console.log(this.email,this.password);
  //   this.submitted = true ;
  //   if (!this.formFields.email.errors && !this.formFields.password.errors) {
  //       localStorage.setItem('email', this.email);
  //     window.location.href = 'home';


  //       // localStorage.setItem('authPassword', this.password);
  //     // this.apiService.login(this.email, this.password).pipe(first()).subscribe((data) => {
  //     //   // store user details and jwt token in local storage to keep user logged in between page refreshes
  //     //   if (data["responseCode"] == 200) {
  //     //     // console.log("data",data);
  //     //     // this.local.set('authMail', this.email);
  //     //     // this.local.set('authPassword', this.password);
  //     //     // this.success = true;
  //     //     // this.local.set('currentUser', JSON.stringify(data),1,'d');
  //     //     // var currentUser = this.local.get('currentUser');
  //     //     // currentUser = JSON.parse(currentUser);
  //     //     // var entity = currentUser["entity"][0];
  //     //     // console.log("entity" , entity)
  //     //     // let leftDays = entity.leftDays;
  //     //     window.location.href = 'home';
  //     //   }
  //     // },
  //     //   error => {
  //     //     console.log("error",error);

  //     //       // this.notifierService.notify("error", error.error.message);
  //     //       // this.translate.get(error.error.message).subscribe(res => {
  //     //       //   this.notifierService.notify("error", res);
  //     //       // });
  //     //       return;
  //     //   });
  //     // console.log("xasxasxas");
  //     // this.local.set("isLogged",true);
  //     // window.location.href = 'dashboard';
  //   }
  // }

}
