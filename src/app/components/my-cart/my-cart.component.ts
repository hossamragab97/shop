import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/network/api.service';
import { Router } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { NgxSpinnerService } from 'ngx-spinner';
import { LocalStorageService } from 'angular-web-storage';

@Component({
  selector: 'app-my-cart',
  templateUrl: './my-cart.component.html',
  styleUrls: ['./my-cart.component.css']
})
export class MyCartComponent implements OnInit {
  total = 300;
  val = 1;
  selectedQuantity = 2;
  quantity = '';
  country;
  numOFQuantity = 0;
  allTotalPrice = 0;
  // currency;
  allCart = [
  ]

  allTotal = [];

  style = [];
  constructor(
    private apiservice: ApiService,
    private router: Router,
    private notifierService: NotifierService,
    private spinner: NgxSpinnerService,
    private local: LocalStorageService

  ) {
  }

  ngOnInit(): void {

    this.country = this.apiservice.getCountry();
    // getAllCart
    this.getAllCart()
  }

  getAllCart() {
    // this.spinner.show('loadCarts');
    let cart = this.local.get('cart')
    if (cart) {
      this.allCart = JSON.parse(cart)
      this.getDetails()
    } else {
      this.allCart = []
    }
    this.style = []

    // this.apiservice.getAllCart().subscribe(
    //   (responce) => {
    //     if (responce['message'] = 'success') {
    //       this.allCart = responce['data'];
    //       this.numOFQuantity = 0;
    //       this.allTotalPrice = 0;

    //       let totalegy = 0;
    //       let totalksa = 0;
    //       this.allTotal=[]
    //       this.allCart.forEach(
    //         (e) => {
    //               if(e.region=='Egypt'){
    //                 totalegy += e.price * e.quantity
    //               }else{
    //                 totalksa += e.price * e.quantity
    //               }
    //              this.numOFQuantity += e.quantity 
    //             }
    //             )
    //             this.allTotal.push({'egy':totalegy ,'ksa':totalksa})


    //       // this.cart.forEach(
    //       //   (e) => {
    //       //     this.numOFQuantity += e.quantity
    //       //     this.allTotalPrice += e.quantity * e.price
    //       //   }
    //       // )
    //       this.spinner.hide('loadCarts');

    //     }
    //   },
    //   (error) => {
    //     console.log('error: ' + error['responseCode']);
    //     this.spinner.hide('loadCarts');
    //   }
    // );
  }


  focusQuantity(ind) {
    if (this.allCart[ind].quantity) {
      this.style[ind] = true
    }
  }

  blurQuantity(ind) {
    this.style[ind] = false
  }

  changeQuantity(event, ind) {
    if (event) {
      this.style[ind] = true
    } else {
      this.style[ind] = false
    }
  }


  deleteIdCart(cartId) {
    this.allCart = this.allCart.filter(item => item.id !== cartId);
    this.local.set('cart', JSON.stringify(this.allCart))
    this.apiservice.changeCart(this.allCart.length)

    this.getDetails()



    // this.apiservice.deleteCart(cartId).subscribe(
    //   (response) => {
    //     if (response['message'] == 'success') {
    //       this.notifierService.notify('success', 'Deleted Successfully')
    //       this.getAllCart()
    //       this.apiservice.getNumOfCart().subscribe(
    //         res => {
    //           let numCart = res['data'][0]
    //           if (numCart != null) {
    //             this.apiservice.changeCart(numCart)
    //           } else {
    //             this.apiservice.changeCart(0)
    //           }
    //         }
    //       )
    //     }
    //   }
    // )
  }

  editCartQuantity(cartId, quantity, ind) {
    console.log('cartId', cartId)
    console.log('quantity', quantity)
    console.log('allCart', this.allCart)

    if (Number(quantity) == 0) {
      console.log('quantity hhh', Number(quantity))
      this.apiservice.deleteCart(cartId).subscribe(
        (response) => {
          if (response['message'] == 'success') {
            this.getAllCart()
            this.apiservice.getNumOfCart().subscribe(
              res => {
                let numCart = res['data'][0]
                if (numCart != null) {
                  this.apiservice.changeCart(numCart)
                } else {
                  this.apiservice.changeCart(0)
                }
              }
            )
          }
        }
      )
    } else {
      this.allCart.forEach(cart => {
        if (cart.id == cartId) {
          cart.quantity == Number(quantity)
          this.local.set('cart', JSON.stringify(this.allCart))
          this.getDetails()
          this.notifierService.notify('success', 'Updated Successfully')
          this.style[ind] = false
        }
      })



      // this.apiservice.editCartQuantity(cartId, quantity).subscribe(
      //   (response) => {
      //     if (response['message'] == 'success') {
      //       this.notifierService.notify('success', 'Updated Successfully')
      //       this.getAllCart()
      //       this.apiservice.getNumOfCart().subscribe(
      //         res => {
      //           let numCart = res['data'][0]
      //           if (numCart != null) {
      //             this.apiservice.changeCart(numCart)
      //           } else {
      //             this.apiservice.changeCart(0)
      //           }
      //         }
      //       )
      //     }
      //   }
      // )
    }

  }


  getDetails() {
    this.numOFQuantity = 0;
    this.allTotalPrice = 0;
    let totalegy = 0;
    let totalksa = 0;
    this.allTotal = []
    this.allCart.forEach(
      (e) => {
        if (e.region == 'Egypt') {
          totalegy += Number(e.price) * Number(e.quantity)
        } else {
          totalksa += Number(e.price) * Number(e.quantity)
        }
        this.numOFQuantity += Number(e.quantity)
      }
    )
    this.allTotal.push({ 'egy': totalegy, 'ksa': totalksa })
  }

  clearAll(){
    this.allCart = []
    this.local.set('cart', JSON.stringify(this.allCart))
    this.apiservice.changeCart(0)
  }

}
