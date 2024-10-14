import { Component, OnInit ,NgZone, Input, ViewChild, AfterViewInit} from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ApiService } from 'src/app/network/api.service';
import { NotifierService } from 'angular-notifier';
import { LocalStorageService } from 'angular-web-storage';

import { ProductsComponent } from '../products/products.component';
import { Subscription } from 'rxjs';
// import {Subscription, timer} from 'rxjs';  
// import { map, catchError } from 'rxjs/operators';
 

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit{
  // timerSubscription: Subscription; 

  subscription: Subscription; 

  @ViewChild(ProductsComponent) products; 
  login = false;
  name = '';
  accountType;
  country;
  
  numOfCart;
  
  numberCartChange(num:any) {
    this.numOfCart = num;
    // alert(this.itemF); 
  }
  ngOnInit(): void {

    this.apiService.getNumOfCart().subscribe(
      res=>{
        if(res['data'][0] !=null){
          this.numOfCart=res['data']
        }else{
          this.numOfCart=0
        }
      }
    )

    // this.numOfCart = this.apiService.getNumOfCart1(); 
    this.subscription = this.apiService.cartChangeNumber
                         .subscribe(num =>  this.numberCartChange(num)); 
  

        // this.apiService.getAllCart().subscribe(
        //     (response)=>{
        //       let res=response['data'];
        //       this.numberOfCart=0;
        //       res.forEach(
        //         (e)=>{
        //           this.numberOfCart+=e.quantity
        //         }
        //       )
        //     }
        //   );


      // timer(0, 10000) call the function immediately and every 1 seconds 
      // this.timerSubscription = timer(0, 1000).pipe( 
      //   map(() => { 
      //     this.apiService.getAllCart().subscribe(
      //       (response)=>{
      //         let res=response['data'];
      //         this.numberOfCart=0;
      //         res.forEach(
      //           (e)=>{
      //             this.numberOfCart+=e.quantity
      //           }
      //         )
      //       }
      //     )
      //   }) 
      // ).subscribe(); 



    // document.onclick = function (e) {
    //   const target = e.target as Element;
    //   console.log(target.className)
    //   if (!(target.className).includes('sidebar-bar')) {
    //     document.getElementById('main-menu').style.display = '-410px'
    //   }
    // }


    if (this.local.get('currentUser')) {
      var currentUser = this.local.get('currentUser');
      currentUser = JSON.parse(currentUser);
      var entity = currentUser["entity"][0];
      // let currentUser=localStorage.getItem('currentUser')
      this.login = true;
      this.name = entity['name'].split(' ')[0];
      this.accountType = entity['accountType']

      this.country = this.local.get('country');



    }

  }

  currentLang!: string;
  constructor(
    public translate: TranslateService,
    private apiService: ApiService,
    private router: Router,
    private notifierService: NotifierService,
    private local: LocalStorageService,
    private zone: NgZone,

  ) {
    this.currentLang = this.local.get('currentLang') || 'en';
    this.translate.use(this.currentLang);
  }

  ChangeCurrentLang(lang: string) {
    this.translate.use(lang);
    this.local.set('currentLang', lang)
  }

  logOut() {
    this.apiService.logout().subscribe(
      (response) => {
        if (response['responseCode'] == 200) {
          this.local.remove('currentUser');
          // this.local.remove('country');
          window.location.href = 'home';
          this.login = false;
        }
      },
      (error) => {
        this.notifierService.notify('error', error.error.message)
        console.log('error: ' + error);
      }
    );    // localStorage.removeItem('currentUser')
    // this.accountType=0;
  }

  shop() {
    let check = this.apiService.getUserLoggedIn()
    if (check) {
      this.router.navigate(['/products'])
    } else {
      this.router.navigate(['/login'])
    }
  }

  changeCountry(country) {
    if (country == 'Egypt') {
      this.local.set('country', 'Egypt')
    } else {
      this.local.set('country', 'Ksa')
    }

    if(this.accountType==1){
    window.location.href = 'admin';

      // this.router.navigate(['admin'])
    }else{
    window.location.href = 'home';

      // this.router.navigate(['home'])

    }
    // window.location.href = 'home';
  }

}
