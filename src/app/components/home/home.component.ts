import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/network/api.service';
import { Router } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { ConfigVariables } from 'src/app/shared/config';
import { LocalStorageService } from 'angular-web-storage';
declare var $: any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  currency;
  quantity = 1;
  products = [];
  modal = [];
  image_path = ConfigVariables.Image_Shop;

  images =
    // []
    ["../assets/images/banner11.jpg", "../assets/images/banner22.jpg", "../assets/images/banner33.jpg"]
  //  ["../assets/images/skarpt_shop/banner1.jpeg" , "../assets/images/skarpt_shop/banner2.jpeg" , "../assets/skarpt.jpg"]
  //  ["../assets/images/skarpt_shop/banner1.jpg" , "../assets/images/skarpt_shop/banner2.jpg" , "../assets/images/skarpt_shop/banner2.jpg" "../assets/skarpt.jpg"]
  constructor(
    private apiservice: ApiService,
    private router: Router,
    private notifierService: NotifierService,
    private local: LocalStorageService
  ) {
    // this.products = apiservice.products;
  }

  ngOnInit() {

    $(document).ready(function () {
      let body = <HTMLDivElement>document.body;
      let script = document.createElement('script');
      script.innerHTML = '';
      script.src = '../assets/js/script.js';
      script.async = true;
      script.defer = true;
      body.appendChild(script);
    });

    //get country
    let country = this.apiservice.getCountry();
    if (country == 'Egypt') {
      this.currency = 'EGP'
    } else {
      this.currency = 'SAR'
    }

    //PhotoSlider
    // this.getPhotoSlider();

    //get products
    this.getTodayProducts();

  }

  getPhotoSlider() {
    this.apiservice.getPhotoSlider().subscribe(
      (response) => {
        let data = response['data'];
        data.forEach(
          (photoName) => {
            this.images.push(this.image_path + photoName)
          }
        )
      }
    )
  }

  getTodayProducts() {

    // this.apiservice.getTodayProducts().subscribe(
    //   (responce) => {
    //     this.products = responce['data'];
    //   },
    //   (error) => {
    //     console.log('error: ' + error['responseCode']);
    //   }
    // );

    fetch('https://fakestoreapi.com/products?limit=4')
      .then(res => res.json())
      .then(json => {
        this.products = json
      })

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
    // this.quantity = 1;

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

  // shopNow() {
  //   let check = this.apiservice.getUserLoggedIn()
  //   if (check) {
  //     this.router.navigate(['/products'])
  //   } else {
  //     this.router.navigate(['/login'])
  //   }
  // }

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


}
