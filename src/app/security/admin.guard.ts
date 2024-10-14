import { Injectable } from '@angular/core';
import {
  Router,
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';

import { Observable } from 'rxjs';
import { ApiService } from 'src/app/network/api.service';

/*export interface CanComponentDeactivate {
    canDeactivate: () => Observable<boolean> | Promise<boolean> | boolean;
}*/

@Injectable()
export class AdminGuard
  implements CanActivate /*,CanDeactivate<CanComponentDeactivate> */ {
  constructor(
    private router: Router,
    private apiservice : ApiService
  )
  {}


  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    let check = this.apiservice.getUserLoggedIn();

    if(check){
        check = JSON.parse(check);
        var entity = check["entity"][0];
        var accountType=entity['accountType']
        if (accountType==1) {
          return true;
        }
        else {
            this.router.navigate(['/home']);
            return false;
          }
    } else{
      this.router.navigate(['/home']);
      return false;
    }
}
}
