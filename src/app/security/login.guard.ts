
import { Injectable } from '@angular/core';
import {
  Router,
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { Observable } from 'rxjs';
import { ApiService } from 'src/app/network/api.service';

@Injectable()
export class LoginGuard
  implements CanActivate /*,CanDeactivate<CanComponentDeactivate> */ {
  constructor(
    private router: Router,
    private apiservice: ApiService
  )
  { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    let check = this.apiservice.getUserLoggedIn();
    // console.log('check', this.check);
    if (check) {
      let acc=this.apiservice.getAccountType();
      if(acc!=1){
        this.router.navigate(['/home']);
      }else{
        this.router.navigate(['/admin']);
      }
      return false;
    } else {
      return true;
    }
  }
}
