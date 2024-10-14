import { Component, OnInit, Input, EventEmitter, Output, ViewChild, AfterViewInit } from '@angular/core';
import { ApiService } from 'src/app/network/api.service';
import { NotifierService } from 'angular-notifier';
import { Router } from '@angular/router';
import { IDropdownSettings } from 'ng-multiselect-dropdown';

import { NgxSpinnerService } from 'ngx-spinner';

declare var $: any;

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {
  isPlaceholderError = false
  currency;
  search = '';
  quantity = 1;
  products = [];
  modal = [];
  dropdownSettings: IDropdownSettings;
  allCategory = [
    // {
    // id:1,
    // name:'gateway'
    // },
    // {
    //   id:2,
    //   name:'sensor'
    //   },
  ]
  selectedCatogry = [
    // {
    //   id:1,
    //   name:'gateway'
    //   },
  ];


  constructor(
    private apiservice: ApiService,
    private notifierService: NotifierService,
    private router: Router,
    private spinner: NgxSpinnerService,
  ) {
    // this.products=apiservice.products;
  }

  ngOnInit(): void {

    let country = this.apiservice.getCountry();
    if (country == 'Egypt') {
      this.currency = 'EGP'
    } else {
      this.currency = 'SAR'
    }

    //get allProduct
    this.getAllProducts(this.search, 0)

    //get allCatogry
    this.getAllCategory();

    this.dropdownSettings = {
      singleSelection: true,
      idField: 'id',
      textField: 'name',
      selectAllText: 'selectAll',
      unSelectAllText: 'unSelectAll',
      itemsShowLimit: 2,
      allowSearchFilter: true,
    };

    $(document).ready(function () {
      let body = <HTMLDivElement>document.body;
      let script = document.createElement('script');
      script.innerHTML = '';
      script.src = '../assets/js/script.js';
      script.async = true;
      script.defer = true;
      body.appendChild(script);
    });
  }


  add_cart(id, quantity) {
    quantity = this.quantity;
    let check = this.apiservice.getUserLoggedIn()
    if (!check) {
      this.router.navigate(['/login'])
    } else {
      this.apiservice.addToCart(id, quantity).subscribe(
        (response) => {
          if (response['message'] == 'success') {
            this.notifierService.notify('success', 'Added To Cart');
            this.apiservice.getNumOfCart().subscribe(
              res => {
                let numCart = res['data']
                this.apiservice.changeCart(numCart)
              }
            )
          } else {
            this.notifierService.notify('warning', response['message']);
          }
        }
      )
      this.quantity = 1;
    }
  }

  add_wishlist(id) {
    let check = this.apiservice.getUserLoggedIn()
    if (!check) {
      this.router.navigate(['/login'])
    } else {
      this.apiservice.addToWishlist(id).subscribe(
        (response) => {
          if (response['message'] == 'success') {
            this.notifierService.notify('success', 'Added To WishList');
          } else {
            this.notifierService.notify('warning', response['message']);
          }
        }
      )
    }
  }

  plus() {
    this.quantity++;
  }
  mins() {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  getPrdouctInfo(i: any) {
    this.quantity = 1;
    this.modal = []
    this.modal.push(i)
    console.log('modalllllllllll', (this.modal))
  }


  getAllProducts(search, selectedCatogry) {
    this.spinner.show('loadProducts');
    this.apiservice.getAllProducts(search, selectedCatogry).subscribe(
      (responce) => {
        this.products = responce['data'];
        this.spinner.hide('loadProducts');
      },
      (error) => {
        this.spinner.hide('loadProducts');
        console.log('error: ' + error['responseCode']);
      }
    );
  }

  searchProduct(search: any) {
    if (search != '') {
      this.isPlaceholderError = false;
      this.spinner.show('loadProducts');

      let idCategory = 0;
      //check if category selected
      if (this.selectedCatogry.length > 0) {
        console.log('idCategory', idCategory)
        idCategory = this.selectedCatogry[0].id;
        console.log('idCategory', idCategory)
      }

      this.apiservice.getAllProducts(search, idCategory).subscribe(
        (responce) => {
          console.log('')
          this.products = responce['data'];
          this.spinner.hide('loadProducts');
        },
        (error) => {
          this.spinner.hide('loadProducts');
          console.log('error: ' + error['responseCode']);
        }
      );
    } else {
      this.isPlaceholderError = true;
    }
  }

  onSelectCatogry(item) {
    this.search = ''
    let idCategory = item.id;
    this.spinner.show('loadProducts');
    this.apiservice.getProductsByCategory(idCategory).subscribe(
      (responce) => {
        this.products = responce['data'];
        this.spinner.hide('loadProducts');
      },
      (error) => {
        this.spinner.hide('loadProducts');
        console.log('error: ' + error['responseCode']);
      }
    );
  }

  onDeSelectCatogry() {
    this.getAllProducts(this.search, 0)
  }

  getAllCategory() {
    this.apiservice.getAllCategory().subscribe(
      (responce) => {
        this.allCategory = responce['data'];
      },
      (error) => {
        console.log('error: ' + error['responseCode']);
      }
    );
  }

  searchChange(event) {
    if (event) {
      this.isPlaceholderError = false;
    }
  }

}
