import { Component, OnInit } from '@angular/core';
import { LocalStorageService } from 'angular-web-storage';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/network/api.service';
import { first } from 'rxjs/operators';
import { NotifierService } from 'angular-notifier';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  passwordSecure=false;


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
  ) {}

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


  PasswordSecure(){
    this.passwordSecure=!this.passwordSecure;
  }

  onSubmit(){
    // console.log(this.email,this.password);
    this.submitted = true ;
    if (!this.formFields.email.errors && !this.formFields.password.errors && !this.formFields.firstName.errors && !this.formFields.lastName.errors) {
      this.notifierService.notify('success','Added Successfully')
      this.router.navigate(['/home'])
      // this.apiService.login(this.email, this.password).pipe(first()).subscribe((data) => {
      //   // store user details and jwt token in local storage to keep user logged in between page refreshes
      //   if (data["responseCode"] == 200) {
      //     // console.log("data",data);
      //     // localStorage.setItem('authMail', this.email);
      //     // this.local.set('authPassword', this.password);
      //     // this.success = true;
      //     this.local.set('currentUser', JSON.stringify(data),1,'d');
      //     var currentUser = this.local.get('currentUser');
      //     currentUser = JSON.parse(currentUser);
      //     var entity = currentUser["entity"][0];
      //     var accountType = entity['accountType'];

      //     this.apiService.getCountry();
      

      //     if(accountType==1){
      //       window.location.href = 'admin';
      //     }else{
      //       window.location.href = 'home';
      //     }
      //     console.log("entity" , entity['accountType'])
      //     // let leftDays = entity.leftDays;

      //   }
      // },
      //   error => {
      //     console.log("error",error);
      //     this.notifierService.notify('error' , error.error.message)
      //     // $.notify({ message: error.error.message }, { type: "danger" });
      //       // this.translate.get(error.error.message).subscribe(res => {
      //       //   this.notifierService.notify("error", res);
      //       // });
      //       return;
      //   });
    }
  }

}
