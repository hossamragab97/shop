import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse} from '@angular/common/http';
// import { HttpModule, RequestOptions, ResponseType } from '@angular/http';
import { map, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ConfigVariables } from '../shared/config';
import { NotifierService } from 'angular-notifier';
import { LocalStorageService } from 'angular-web-storage';
import { Observable, Observer } from 'rxjs';
import { APIsErrorHandling } from '../shared/APIsErrorHandling';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  products = [
    {
      id: 1,
      name: 'wireless smart gateway 4g',
      photo: '../assets/images/skarpt_shop/gateway2.png',
      price: 600
    },
    {
      id: 2,
      name: 'wifi temperature and humidity',
      photo: '../assets/images/skarpt_shop/temp_hum.png',
      price: 1000
    },
    {
      id: 3,
      name: 'wireless smart gateway',
      photo: '../assets/images/skarpt_shop/gateway.png',
      price: 400
    },
    {
      id: 4,
      name: 'sensor',
      photo: '../assets/images/skarpt_shop/sensor.png',
      price: 300
    },
  ]


  cartChangeNumber: Observable<number>;
  private _observer: Observer<number>;
  // Observable navItem source
  changeCart(number) {
    this._observer.next(number);
  }


  constructor(
    private local: LocalStorageService,
    private notifierService: NotifierService,
    private httpClient: HttpClient,
    private translate: TranslateService,
    private router: Router,
    private apisErrorHandling: APIsErrorHandling
  ) {
    this.cartChangeNumber = new Observable(
      observer => this._observer = observer)
  }

  public getNumOfCart() {
    var currentUser = this.local.get('currentUser');
    let country = this.getCountry();
    currentUser = JSON.parse(currentUser);
    var entity = currentUser["entity"][0];
    var headerss = new HttpHeaders({
      'content-type': 'application/json',
      'TOKEN': entity["token"],
      'Accept': 'application/json',
      'region': country
    });

    return this.httpClient.get(`${ConfigVariables.API_URL}/Cart/items`,
      { headers: headerss })
      .pipe(map(result => {
        return result;
      }), catchError(
        (error: HttpErrorResponse) => {
          this.apisErrorHandling.errorHandling(error);
          throw error.error;
        })

      );
  }

  public getUserLoggedIn() {
    return this.local.get('currentUser');
  }

  public getCountry() {
    let country = this.local.get('country')
    if (country) {
      return country;
    } else {
      let time = new Date();
      let TimeOffset = time.getTimezoneOffset();
      if (TimeOffset == -120) {
        this.local.set('country', 'Egypt');
      }
      if (TimeOffset == -180) {
        this.local.set('country', 'Ksa');
      }
      return this.local.get('country');
    }
  }

  public getAccountType() {
    var check = this.getUserLoggedIn();
    check = JSON.parse(check);
    var entity = check["entity"][0];
    var accountType = entity['accountType']
    return accountType;
  }

  public login(username: string, password: string) {
    var headerss = new HttpHeaders({
      'content-type': 'application/json',
      'Authorization': 'Basic ' + btoa(unescape(encodeURIComponent(username + ":" + password))),
      // basic from user and pass
      'Accept': 'application/json',
    });

    return this.httpClient.get<any>(`${ConfigVariables.API_URL}/login`, { headers: headerss })
      .pipe(map(user => {
        return user;
      })
      );
  }

  public logout() {
    var currentUser = this.local.get('currentUser');
    if (currentUser != null) {
      currentUser = JSON.parse(currentUser);
      var entity = currentUser["entity"][0];
      console.log('log out ', entity["token"])
      var headerss = new HttpHeaders({
        'content-type': 'application/json',
        'TOKEN': entity["token"],
        'Accept': 'application/json'
      });
      return this.httpClient.get(`${ConfigVariables.API_URL}/logout`, { headers: headerss })
        .pipe(map(result => {
          return result;
        }), catchError(
          (error: HttpErrorResponse) => {
            this.apisErrorHandling.errorHandling(error);
            throw error.error;
          })

        );
    }
    else {
      this.router.navigate(['home']).then(() => {
        window.location.reload();
      });
    }

  }

  public addTodayProducts(products) {
    var currentUser = this.local.get('currentUser');
    currentUser = JSON.parse(currentUser);
    var entity = currentUser["entity"][0];
    let country = this.getCountry();
    var headerss = new HttpHeaders({
      'content-type': 'application/json',
      'Accept': 'application/json',
      'TOKEN': entity["token"],
      'region': country,
    });

    let obj = {
      'ids': products
    }

    return this.httpClient.post(`${ConfigVariables.API_URL}/Home/products`, obj,
      {
        headers: headerss
      }
    )
      .pipe(map(result => {
        return result;
      }), catchError(
        (error: HttpErrorResponse) => {
          this.apisErrorHandling.errorHandling(error);
          throw error.error;
        })

      );
  }

  public getTodayProducts() {
    let country = this.getCountry();
    var headerss = new HttpHeaders({
      'content-type': 'application/json',
      'Accept': 'application/json',
      'region': country
    });
    return this.httpClient.get(`${ConfigVariables.API_URL}/Home/products`,
      { headers: headerss })
      .pipe(map(result => {
        return result;
      }), catchError(
        (error: HttpErrorResponse) => {
          this.apisErrorHandling.errorHandling(error);
          throw error.error;
        })
      );
  }

  public getPhotoSlider() {
    let country = this.getCountry();
    var headerss = new HttpHeaders({
      'content-type': 'application/json',
      'Accept': 'application/json',
      'region': country
    });
    return this.httpClient.get(`${ConfigVariables.API_URL}/Home/Banners`,
      { headers: headerss })
      .pipe(map(result => {
        return result;
      }), catchError(
        (error: HttpErrorResponse) => {
          this.apisErrorHandling.errorHandling(error);
          throw error.error;
        })

      );
  }

  public addPhotoSlider(photos) {
    var currentUser = this.local.get('currentUser');
    if (currentUser != null) {
      let country = this.getCountry();
      currentUser = JSON.parse(currentUser);
      var entity = currentUser["entity"][0];
      var headerss = new HttpHeaders({
        'content-type': 'application/json',
        'TOKEN': entity["token"],
        'Accept': 'application/json',
        'region': country
      });

      return this.httpClient.post(`${ConfigVariables.API_URL}/Home/Banners`, { images: photos }
        , { headers: headerss })
        .pipe(map(result => {
          return result;
        }), catchError(
          (error: HttpErrorResponse) => {
            this.apisErrorHandling.errorHandling(error);
            throw error.error;
          })
        );
    }
    else {


      this.router.navigate(['login']).then(() => {
        window.location.reload();
      });
    }
  }

  public getAllProducts(search, category) {
    let country = this.getCountry();
    var headerss = new HttpHeaders({
      'content-type': 'application/json',
      'Accept': 'application/json',
      'region': country
    });
    return this.httpClient.get(`${ConfigVariables.API_URL}/Product`,
      {
        params: { search, category },
        headers: headerss
      })
      .pipe(map(result => {
        return result;
      }), catchError(
        (error: HttpErrorResponse) => {
          this.apisErrorHandling.errorHandling(error);
          throw error.error;
        })

      );
  }

  public getAllCategory() {
    var currentUser = this.local.get('currentUser');
    currentUser = JSON.parse(currentUser);
    var entity = currentUser["entity"][0];
    var headerss = new HttpHeaders({
      'content-type': 'application/json',
      'Accept': 'application/json',
    });
    return this.httpClient.get(`${ConfigVariables.API_URL}/Category`, { headers: headerss })
      .pipe(map(result => {
        return result;
      }), catchError(
        (error: HttpErrorResponse) => {
          this.apisErrorHandling.errorHandling(error);
          throw error.error;
        })
      );
  }

  public getProductsByCategory(category: any) {
    let country = this.getCountry();
    var headerss = new HttpHeaders({
      'content-type': 'application/json',
      'Accept': 'application/json',
      'region': country
    });
    return this.httpClient.get(`${ConfigVariables.API_URL}/Product`,
      { params: { category }, headers: headerss })
      .pipe(map(result => {
        return result;
      }), catchError(
        (error: HttpErrorResponse) => {
          this.apisErrorHandling.errorHandling(error);
          throw error.error;
        })

      );
  }

  public addCategory(category) {
    var currentUser = this.local.get('currentUser');
    currentUser = JSON.parse(currentUser);
    var entity = currentUser["entity"][0];
    let country = this.getCountry();
    var headerss = new HttpHeaders({
      'content-type': 'application/json',
      'Accept': 'application/json',
      'TOKEN': entity["token"],
      'region': country
    });
    let obj = {
      name: category
    }
    return this.httpClient.post(`${ConfigVariables.API_URL}/Category`, obj,
      {
        headers: headerss
      }
    )
      .pipe(map(result => {
        return result;
      }), catchError(
        (error: HttpErrorResponse) => {
          this.apisErrorHandling.errorHandling(error);
          throw error.error;
        })

      );
  }

  public addToCart(id, quantity) {
    var currentUser = this.local.get('currentUser');
    if (currentUser != null) {
      let country = this.getCountry();
      currentUser = JSON.parse(currentUser);
      var entity = currentUser["entity"][0];
      var headerss = new HttpHeaders({
        'content-type': 'application/json',
        'TOKEN': entity["token"],
        'Accept': 'application/json',
        'region': country
      });
      return this.httpClient.post(`${ConfigVariables.API_URL}/Cart/${id}`, {}
        , { params: { quantity }, headers: headerss })
        .pipe(map(result => {
          return result;
        }), catchError(
          (error: HttpErrorResponse) => {
            this.apisErrorHandling.errorHandling(error);
            throw error.error;
          })
        );
    }
    else {


      this.router.navigate(['login']).then(() => {
        window.location.reload();
      });
    }
  }

  public getAllCart() {
    var currentUser = this.local.get('currentUser');
    // let country = this.getCountry();
    currentUser = JSON.parse(currentUser);
    var entity = currentUser["entity"][0];
    var headerss = new HttpHeaders({
      'content-type': 'application/json',
      'TOKEN': entity["token"],
      'Accept': 'application/json',
      // 'region': country
    });

    return this.httpClient.get(`${ConfigVariables.API_URL}/Cart`,
      { headers: headerss })
      .pipe(map(result => {
        return result;
      }), catchError(
        (error: HttpErrorResponse) => {
          this.apisErrorHandling.errorHandling(error);
          throw error.error;
        })

      );
  }

  public deleteCart(id) {
    var currentUser = this.local.get('currentUser');
    let country = this.getCountry();
    currentUser = JSON.parse(currentUser);
    var entity = currentUser["entity"][0];
    var headerss = new HttpHeaders({
      'content-type': 'application/json',
      'TOKEN': entity["token"],
      'Accept': 'application/json',
      'region': country
    });

    return this.httpClient.delete<any>(`${ConfigVariables.API_URL}/Cart/${id}`,
      { headers: headerss })
      .pipe(map(result => {
        return result;
      }), catchError(
        (error: HttpErrorResponse) => {
          this.apisErrorHandling.errorHandling(error);
          throw error.error;
        })

      );

  }

  public deleteProduct(id) {
    var currentUser = this.local.get('currentUser');
    let country = this.getCountry();
    currentUser = JSON.parse(currentUser);
    var entity = currentUser["entity"][0];
    var headerss = new HttpHeaders({
      'content-type': 'application/json',
      'TOKEN': entity["token"],
      'Accept': 'application/json',
      'region': country
    });

    return this.httpClient.delete<any>(`${ConfigVariables.API_URL}/Product/${id}`,
      { headers: headerss })
      .pipe(map(result => {
        return result;
      }), catchError(
        (error: HttpErrorResponse) => {
          this.apisErrorHandling.errorHandling(error);
          throw error.error;
        })

      );

  }

  public deleteCategory(id) {
    var currentUser = this.local.get('currentUser');
    let country = this.getCountry();
    currentUser = JSON.parse(currentUser);
    var entity = currentUser["entity"][0];
    var headerss = new HttpHeaders({
      'content-type': 'application/json',
      'TOKEN': entity["token"],
      'Accept': 'application/json',
      'region': country
    });

    return this.httpClient.delete<any>(`${ConfigVariables.API_URL}/Category/${id}`,
      { headers: headerss })
      .pipe(map(result => {
        return result;
      }), catchError(
        (error: HttpErrorResponse) => {
          this.apisErrorHandling.errorHandling(error);
          throw error.error;
        })

      );

  }

  public editCartQuantity(cartId, quantity) {
    var currentUser = this.local.get('currentUser');
    currentUser = JSON.parse(currentUser);
    var entity = currentUser["entity"][0];
    var headerss = new HttpHeaders({
      'content-type': 'application/json',
      'Accept': 'application/json',
      'TOKEN': entity["token"],
    });
    return this.httpClient.put(`${ConfigVariables.API_URL}/Cart/${cartId}`,
      {},
      {
        params: { quantity },
        headers: headerss
      }
    )
      .pipe(map(result => {
        return result;
      }), catchError(
        (error: HttpErrorResponse) => {
          this.apisErrorHandling.errorHandling(error);
          throw error.error;
        })

      );
  }

  public addOrder() {
    var currentUser = this.local.get('currentUser');
    currentUser = JSON.parse(currentUser);
    var entity = currentUser["entity"][0];
    var headerss = new HttpHeaders({
      'content-type': 'application/json',
      'Accept': 'application/json',
      'TOKEN': entity["token"],
    });
    return this.httpClient.post(`${ConfigVariables.API_URL}/Order`,
      {},
      {
        headers: headerss
      }
    )
      .pipe(map(result => {
        return result;
      }), catchError(
        (error: HttpErrorResponse) => {
          this.apisErrorHandling.errorHandling(error);
          throw error.error;
        })

      );
  }


  public addToWishlist(id) {
    var currentUser = this.local.get('currentUser');
    if (currentUser != null) {
      let country = this.getCountry();
      currentUser = JSON.parse(currentUser);
      var entity = currentUser["entity"][0];
      var headerss = new HttpHeaders({
        'content-type': 'application/json',
        'TOKEN': entity["token"],
        'Accept': 'application/json',
        'region': country
      });
      return this.httpClient.post(`${ConfigVariables.API_URL}/WishList/${id}`, {}, { headers: headerss })
        .pipe(map(result => {
          return result;
        }), catchError(
          (error: HttpErrorResponse) => {
            this.apisErrorHandling.errorHandling(error);
            throw error.error;
          })
        );
    }
    else {


      this.router.navigate(['login']).then(() => {
        window.location.reload();
      });
    }
  }

  public getAllWishlist() {
    var currentUser = this.local.get('currentUser');
    let country = this.getCountry();
    currentUser = JSON.parse(currentUser);
    var entity = currentUser["entity"][0];
    var headerss = new HttpHeaders({
      'content-type': 'application/json',
      'TOKEN': entity["token"],
      'Accept': 'application/json',
      'region': country
    });

    return this.httpClient.get(`${ConfigVariables.API_URL}/WishList`,
      { headers: headerss })
      .pipe(map(result => {
        return result;
      }), catchError(
        (error: HttpErrorResponse) => {
          this.apisErrorHandling.errorHandling(error);
          throw error.error;
        })

      );
  }

  public deleteWishlist(id) {
    var currentUser = this.local.get('currentUser');
    let country = this.getCountry();
    currentUser = JSON.parse(currentUser);
    var entity = currentUser["entity"][0];
    var headerss = new HttpHeaders({
      'content-type': 'application/json',
      'TOKEN': entity["token"],
      'Accept': 'application/json',
      'region': country
    });

    return this.httpClient.delete<any>(`${ConfigVariables.API_URL}/WishList/${id}`,
      { headers: headerss })
      .pipe(map(result => {
        return result;
      }), catchError(
        (error: HttpErrorResponse) => {
          this.apisErrorHandling.errorHandling(error);
          throw error.error;
        })

      );

  }

  public getAllOrder() {
    var currentUser = this.local.get('currentUser');
    currentUser = JSON.parse(currentUser);
    var entity = currentUser["entity"][0];
    var headerss = new HttpHeaders({
      'content-type': 'application/json',
      'TOKEN': entity["token"],
      'Accept': 'application/json',
    });

    return this.httpClient.get(`${ConfigVariables.API_URL}/Order`,
      { headers: headerss })
      .pipe(map(result => {
        return result;
      }), catchError(
        (error: HttpErrorResponse) => {
          this.apisErrorHandling.errorHandling(error);
          throw error.error;
        })

      );
  }

  public addProduct(objProduct) {
    var currentUser = this.local.get('currentUser');
    currentUser = JSON.parse(currentUser);
    var entity = currentUser["entity"][0];
    var headerss = new HttpHeaders({
      'content-type': 'application/json',
      'Accept': 'application/json',
      'TOKEN': entity["token"],
    });
    return this.httpClient.post(`${ConfigVariables.API_URL}/Product`, objProduct,
      {
        headers: headerss
      }
    )
      .pipe(map(result => {
        return result;
      }), catchError(
        (error: HttpErrorResponse) => {
          this.apisErrorHandling.errorHandling(error);
          throw error.error;
        })

      );
  }

  public getProductInfo(id) {
    var currentUser = this.local.get('currentUser');
    currentUser = JSON.parse(currentUser);

    let Id = id;
    var entity = currentUser["entity"][0];
    var headerss = new HttpHeaders({
      'content-type': 'application/json',
      'TOKEN': entity["token"],
      'Accept': 'application/json'
    });
    return this.httpClient.get(`${ConfigVariables.API_URL}/Product/${Id}`, { headers: headerss })
      .pipe(map(result => {
        return result;
      }), catchError(
        (error: HttpErrorResponse) => {
          this.apisErrorHandling.errorHandling(error);
          throw error.error;
        })
      );
  }

  public getAllProductCreated() {
    var currentUser = this.local.get('currentUser');
    currentUser = JSON.parse(currentUser);

    var entity = currentUser["entity"][0];
    var headerss = new HttpHeaders({
      'content-type': 'application/json',
      'TOKEN': entity["token"],
      'Accept': 'application/json'
    });
    return this.httpClient.get(`${ConfigVariables.API_URL}/Product`, { headers: headerss })
      .pipe(map(result => {
        return result;
      }), catchError(
        (error: HttpErrorResponse) => {
          this.apisErrorHandling.errorHandling(error);
          throw error.error;
        })
      );
  }

  public editProduct(objProduct, productId) {
    var currentUser = this.local.get('currentUser');
    currentUser = JSON.parse(currentUser);
    var entity = currentUser["entity"][0];
    var headerss = new HttpHeaders({
      'content-type': 'application/json',
      'Accept': 'application/json',
      'TOKEN': entity["token"],
    });
    return this.httpClient.put(`${ConfigVariables.API_URL}/Product/${productId}`, objProduct,
      {
        headers: headerss
      }
    )
      .pipe(map(result => {
        return result;
      }), catchError(
        (error: HttpErrorResponse) => {
          this.apisErrorHandling.errorHandling(error);
          throw error.error;
        })

      );
  }

}