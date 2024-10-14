import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/network/api.service';
import { Router } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.css']
})
export class WishlistComponent implements OnInit {

  allWishlist = [
    // {
    //   id:'1',
    //   image:'../assets/images/skarpt_shop/sensor.png',
    //   name:'sensor',
    //   price:300,
    //   quantity:4,
    //   description:'ssss'
    // },
    // {
    //   id:'2',
    //   image:'../assets/images/skarpt_shop/gateway.png',
    //   name:'gateway',
    //   price:700,
    //   quantity:17,
    //   description:'md,.mc,,, /.,,/,sd.zxmc,.zxmc.,zxmc,.xzmcmzx.,cmz.,xmc.,zxmc.,zxmc.,czx.,mczx,mc,zxc'
    // },
    // {
    //   id:'3',
    //   image:'../assets/images/skarpt_shop/gateway2.png',
    //   name:'gateway',
    //   price:1000,
    //   quantity:1,
    //   description:'mc,.xzmcmzx.,cmz.,xmc.,zxmc.,zxmc.,czx.,mczx,mc,zxc'
    // }
  ]


  constructor(
    private apiservice: ApiService,
    private router: Router,
    private notifierService: NotifierService,
    private spinner: NgxSpinnerService,
  ) {
  }

  ngOnInit(): void {
    //getAllWishlist
    this.getAllWishlist();
  }

  getAllWishlist() {
    this.spinner.show('loadWishList');
    this.apiservice.getAllWishlist().subscribe(
      (responce) => {
        this.allWishlist = responce['data'];
        this.spinner.hide('loadWishList');

      },
      (error) => {
        this.spinner.hide('loadWishList');
        console.log('error: ' + error['responseCode']);
      }
    );
  }


  add_cart(id) {
    this.apiservice.deleteWishlist(id).subscribe(
      (response) => {
        if (response['message'] == 'success') {
          this.getAllWishlist();
          this.apiservice.addToCart(id, 1).subscribe(
            (response) => {
              if (response['message'] == 'success') {
                this.notifierService.notify('success', 'Added To Cart')
                this.apiservice.getNumOfCart().subscribe(
                  res=>{
                    let numCart=res['data']
                    this.apiservice.changeCart(numCart)      
                  }
                )
              }
            }
          )
        }
      });
  }

  deleteWishlist(id) {
    this.apiservice.deleteWishlist(id).subscribe(
      (response) => {
        if (response['message'] == 'success') {
          this.notifierService.notify('success', 'Deleted Successfully');
          this.getAllWishlist()
        }
      }
    );
  }

}
