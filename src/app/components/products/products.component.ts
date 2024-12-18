import { Component, OnInit, Input, EventEmitter, Output, ViewChild, AfterViewInit } from '@angular/core';
import { ApiService } from 'src/app/network/api.service';
import { NotifierService } from 'angular-notifier';
import { Router } from '@angular/router';
// import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { NgxSpinnerService } from 'ngx-spinner';
import { LocalStorageService } from 'angular-web-storage';

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
  // dropdownSettings: IDropdownSettings;
  allCategory = []
  selectedCatogry = '';


  constructor(
    private apiservice: ApiService,
    private notifierService: NotifierService,
    private router: Router,
    private spinner: NgxSpinnerService,
    private local: LocalStorageService

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

    // this.dropdownSettings = {
    //   singleSelection: true,
    //   idField: 'id',
    //   textField: 'name',
    //   selectAllText: 'selectAll',
    //   unSelectAllText: 'unSelectAll',
    //   itemsShowLimit: 2,
    //   allowSearchFilter: true,
    // };

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


  add_cart(id, quantity, product) {
    let cart = this.local.get('cart')
    if (cart) {
      let allCart = JSON.parse(cart)
      let allIds = allCart.map(cart => cart.id)
      if (allIds.includes(id)) {
        this.notifierService.notify('warning', 'Already added before')
      } else {
        let body = product
        body['quantity'] = quantity
        body['region'] = this.local.get('country')
        this.notifierService.notify('success', 'Added To Cart');
        console.log('allCart', allCart)
        allCart.push(body)
        this.local.set('cart', JSON.stringify(allCart))
        this.apiservice.changeCart(allCart.length)
      }

    } else {
      let body = product
      body['quantity'] = quantity
      body['region'] = this.local.get('country')

      this.notifierService.notify('success', 'Added To Cart');
      this.local.set('cart', JSON.stringify([body]))
      this.apiservice.changeCart(1)
    }

    // this.apiservice.addToCart(id, quantity).subscribe(
    //   (response) => {
    //     if (response['message'] == 'success') {
    //       this.notifierService.notify('success', 'Added To Cart');
    //       this.apiservice.getNumOfCart().subscribe(
    //         res => {
    //           let numCart = res['data']
    //           this.apiservice.changeCart(numCart)
    //         }
    //       )
    //     } else {
    //       this.notifierService.notify('warning', response['message']);
    //     }
    //   }
    // )
  }

  add_wishlist(id, product) {
    let wishlist = this.local.get('wishlist')
    let allCart = JSON.parse(this.local.get('cart'))
    let allIds = allCart.map(cart => cart.id)
    if (allIds.includes(id)) {
      this.notifierService.notify('warning', 'Exist in Cart before')
    }else{
      if (wishlist) {
        let allWishlist = JSON.parse(wishlist)
        let allIds = allWishlist.map(wishlist => wishlist.id)
        if (allIds.includes(id)) {
          this.notifierService.notify('warning', 'Already added before')
        } else {
          let body = product
          body['region'] = this.local.get('country')
          body['quantity'] = 1
          this.notifierService.notify('success', 'Added To Cart');
          allWishlist.push(body)
          this.local.set('wishlist', JSON.stringify(allWishlist))
        }
      } else {
        let body = product
        body['region'] = this.local.get('country')
        body['quantity'] = 1
        this.notifierService.notify('success', 'Added To Wishlist');
        this.local.set('wishlist', JSON.stringify([body]))
      }
    }

    // this.apiservice.addToWishlist(id).subscribe(
    //   (response) => {
    //     if (response['message'] == 'success') {
    //       this.notifierService.notify('success', 'Added To WishList');
    //     } else {
    //       this.notifierService.notify('warning', response['message']);
    //     }
    //   }
    // )

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
  }


  getAllProducts(search, selectedCatogry) {
    // this.spinner.show('loadProducts');
    // this.apiservice.getAllProducts(search, selectedCatogry).subscribe(
    //   (responce) => {
    //     this.products = responce['data'];
    //     this.spinner.hide('loadProducts');
    //   },
    //   (error) => {
    //     this.spinner.hide('loadProducts');
    //     console.log('error: ' + error['responseCode']);
    //   }
    // );

    fetch('https://fakestoreapi.com/products')
      .then(res => res.json())
      .then(json => {
        this.products = json
      }
      )
  }

  searchProduct(search: any) {
    if (search != '') {
      this.isPlaceholderError = false;
      console.log('this.selectedCatogry', this.selectedCatogry)
      if (this.selectedCatogry != '') {
        fetch('https://fakestoreapi.com/products/category/' + this.selectedCatogry)
          .then(res => res.json())
          .then(json => {
            this.products = json
            this.products = this.products.filter(product =>
              product.title.toLowerCase().includes(this.search.toLowerCase())
            );
          }
          )
      } else {
        fetch('https://fakestoreapi.com/products')
          .then(res => res.json())
          .then(json => {
            this.products = json
            this.products = this.products.filter(product =>
              product.title.toLowerCase().includes(this.search.toLowerCase())
            );
          }
          )
      }

      // this.spinner.show('loadProducts');
      // let idCategory = 0;
      // //check if category selected
      // if (this.selectedCatogry.length > 0) {
      //   console.log('idCategory', idCategory)
      //   idCategory = this.selectedCatogry[0].id;
      //   console.log('idCategory', idCategory)
      // }

      // this.apiservice.getAllProducts(search, idCategory).subscribe(
      //   (responce) => {
      //     console.log('')
      //     this.products = responce['data'];
      //     this.spinner.hide('loadProducts');
      //   },
      //   (error) => {
      //     this.spinner.hide('loadProducts');
      //     console.log('error: ' + error['responseCode']);
      //   }
      // );
    } else {
      this.isPlaceholderError = true;
    }
  }

  onSelectCatogry(item) {
    console.log('item', item)
    this.search = ''
    this.selectedCatogry = item
    if (item) {
      fetch('https://fakestoreapi.com/products/category/' + item)
        .then(res => res.json())
        .then(json => this.products = json)
    } else {
      this.getAllProducts('', '')
    }
    // this.search = ''
    // let idCategory = item.id;
    // this.spinner.show('loadProducts');
    // this.apiservice.getProductsByCategory(idCategory).subscribe(
    //   (responce) => {
    //     this.products = responce['data'];
    //     this.spinner.hide('loadProducts');
    //   },
    //   (error) => {
    //     this.spinner.hide('loadProducts');
    //     console.log('error: ' + error['responseCode']);
    //   }
    // );
  }

  onDeSelectCatogry() {
    this.getAllProducts(this.search, 0)
  }

  getAllCategory() {
    // this.apiservice.getAllCategory().subscribe(
    //   (responce) => {
    //     this.allCategory = responce['data'];
    //   },
    //   (error) => {
    //     console.log('error: ' + error['responseCode']);
    //   }
    // );

    fetch('https://fakestoreapi.com/products/categories')
      .then(res => res.json())
      .then(json => {
        console.log('json', json)
        this.allCategory = json
      }
      )
  }

  searchChange(event) {
    console.log('event ', event)
    if (event) {
      this.isPlaceholderError = false;
      this.searchProduct(this.search)
    } else {
      if (this.selectedCatogry != '') {
        this.onSelectCatogry(this.selectedCatogry)
      } else {
        this.getAllProducts(this.search, 0)
      }
    }
  }

}
