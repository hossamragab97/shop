import { Injectable } from '@angular/core';
import {
  Router,
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';

import { Observable } from 'rxjs';
import { ApiService } from 'src/app/network/api.service';
import { LocalStorageService } from 'angular-web-storage';

/*export interface CanComponentDeactivate {
    canDeactivate: () => Observable<boolean> | Promise<boolean> | boolean;
}*/

@Injectable()
export class AuthGuard
  implements CanActivate /*,CanDeactivate<CanComponentDeactivate> */ {
  constructor(
    private router: Router,
    private apiservice : ApiService,
    private local: LocalStorageService,
  )
  {}


  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    // let check = this.apiservice.getUserLoggedIn();
    let check = this.local.get('token')
    // console.log('check', check);
    if (check) {
      return true;
    } else {
      // alert('else');
      this.router.navigate(['/home']);
      return false;
    }
}
}
