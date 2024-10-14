import {Injectable} from "@angular/core";
import {HttpErrorResponse} from "@angular/common/http";
import {LocalStorageService, SessionStorageService} from "angular-web-storage";
import {TranslateService} from "@ngx-translate/core";
import {Router} from "@angular/router";

declare var $: any;
@Injectable({
  providedIn: 'root'
})
export class APIsErrorHandling{

  constructor(private local: LocalStorageService,
              private translate: TranslateService,
              private session: SessionStorageService,
              private router: Router) { }

  errorHandling(error: HttpErrorResponse){
    let trans;
    if (error.status == 401) {
      trans = "Unauthorized";
      this.translate.get(trans).subscribe(res => {
        $.notify({ message: res }, { type: "danger" });
      });
      this.local.set('currentUser', null);

      this.router.navigate(['login']).then(() => {
        window.location.reload();
      });
    } else if (error.status == 400) {
      trans = "Bad Request";
      this.translate.get(trans).subscribe(res => {
        $.notify({ message: res }, { type: "warning" });
      });
    }
    else if (error.status == 201) {
      trans = "Error In your data with dublicate or unkwon values";
      this.translate.get(trans).subscribe(res => {
        $.notify({ message: res }, { type: "warning" });
      });
    }
    else if (error.status == 500) {
      trans = "Contact With Technical Team";
      this.translate.get(trans).subscribe(res => {
        $.notify({ message: res }, { type: "warning" });
      });

    } else if (error.status == 404) {
      trans = "Service not found";
      this.translate.get(trans).subscribe(res => {
        $.notify({ message: res }, { type: "danger" });
      });
    }
    else if (error.status == 408) {
      trans = "Service Time Out";
      this.translate.get(trans).subscribe(res => {
        $.notify({ message: res }, { type: "danger" });
      });
    }
    else if (error.status == 0) {
      trans = "Something went wrong, Please try again later";
      this.translate.get(trans).subscribe(res => {
        $.notify({ message: res }, { type: "danger" });
      });
    }
    else {
      trans = "Something went wrong, Please try again later";
      this.translate.get(trans).subscribe(res => {
        $.notify({ message: res }, { type: "danger" });
      });
    }
  }
}
