import {Injectable} from "@angular/core";
import {HttpErrorResponse} from "@angular/common/http";
import {LocalStorageService, SessionStorageService} from "angular-web-storage";
import {TranslateService} from "@ngx-translate/core";
import {Router} from "@angular/router";
import { NotifierService } from "angular-notifier";

@Injectable({
  providedIn: 'root'
})
export class APIsErrorHandling{

  constructor(private local: LocalStorageService,
              private translate: TranslateService,
              private session: SessionStorageService,
              private router: Router,
              private notifierService: NotifierService
            ) { }

  errorHandling(error: HttpErrorResponse){
    if (error.status == 401) {
      var trans = "Unauthorized";
      this.translate.get(trans).subscribe(res => {
        this.notifierService.notify('error', res)
      });
      this.local.set('currentUser', null);

      this.router.navigate(['login']).then(() => {
        window.location.reload();
      });
    } else if (error.status == 400) {
      var trans = "Bad Request";
      this.translate.get(trans).subscribe(res => {
        this.notifierService.notify('error', res)
      });
    }
    else if (error.status == 201) {
      var trans = "Error In your data with dublicate or unkwon values";
      this.translate.get(trans).subscribe(res => {
        this.notifierService.notify('error', res)
      });
    }
    else if (error.status == 500) {
      var trans = "Contact With Technical Team";
      this.translate.get(trans).subscribe(res => {
        this.notifierService.notify('error', res)
      });

    } else if (error.status == 404) {

      var trans = "Service not found";
      this.translate.get(trans).subscribe(res => {
        this.notifierService.notify('error', res)
      });
    }
    else if (error.status == 408) {

      var trans = "Service Time Out";
      this.translate.get(trans).subscribe(res => {
        this.notifierService.notify('error', res)
      });
    }
    else if (error.status == 0) {
      var trans = "Something went wrong, Please try again later";
      this.translate.get(trans).subscribe(res => {
        this.notifierService.notify('error', res)
      });
    }
    else {
      var trans = "Something went wrong, Please try again later";
      this.translate.get(trans).subscribe(res => {
        this.notifierService.notify('error', res)
      });
    }
  }
}
