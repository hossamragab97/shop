import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/network/api.service';
import { Router } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { NgxSpinnerService } from 'ngx-spinner';
import { LocalStorageService } from 'angular-web-storage';

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.css']
})
export class WishlistComponent implements OnInit {

  allWishlist = [
  ]


  constructor(
    private apiservice: ApiService,
    private router: Router,
    private notifierService: NotifierService,
    private spinner: NgxSpinnerService,
    private local: LocalStorageService
  ) {
  }

  ngOnInit(): void {
    //getAllWishlist
    this.getAllWishlist();
  }

  getAllWishlist() {
    let wishlist = this.local.get('wishlist')
    if (wishlist) {
      this.allWishlist = JSON.parse(wishlist)
    } else {
      this.allWishlist = []
    }

    // this.spinner.show('loadWishList');
    // this.apiservice.getAllWishlist().subscribe(
    //   (responce) => {
    //     this.allWishlist = responce['data'];
    //     this.spinner.hide('loadWishList');

    //   },
    //   (error) => {
    //     this.spinner.hide('loadWishList');
    //     console.log('error: ' + error['responseCode']);
    //   }
    // );
  }


  add_cart(id, wishlist) {

    let cart = this.local.get('cart')
    if (cart) {
      let allCart = JSON.parse(cart)
      this.notifierService.notify('success', 'Added To Cart');
      allCart.push(wishlist)
      this.local.set('cart', JSON.stringify(allCart))
      this.apiservice.changeCart(allCart.length)
    } else {
      this.local.set('cart', JSON.stringify([wishlist]))
      this.apiservice.changeCart(1)
    }
    this.deleteWishlist(id)


    // this.apiservice.deleteWishlist(id).subscribe(
    //   (response) => {
    //     if (response['message'] == 'success') {
    //       this.getAllWishlist();
    //       this.apiservice.addToCart(id, 1).subscribe(
    //         (response) => {
    //           if (response['message'] == 'success') {
    //             this.notifierService.notify('success', 'Added To Cart')
    //             this.apiservice.getNumOfCart().subscribe(
    //               res => {
    //                 let numCart = res['data']
    //                 this.apiservice.changeCart(numCart)
    //               }
    //             )
    //           }
    //         }
    //       )
    //     }
    //   });
  }

  deleteWishlist(id) {
    this.allWishlist = this.allWishlist.filter(item => item.id !== id);
    this.local.set('wishlist', JSON.stringify(this.allWishlist))

    // this.apiservice.deleteWishlist(id).subscribe(
    //   (response) => {
    //     if (response['message'] == 'success') {
    //       this.notifierService.notify('success', 'Deleted Successfully');
    //       this.getAllWishlist()
    //     }
    //   }
    // );
  }

}
