import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/network/api.service';
import { Router } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { NgxSpinnerService } from 'ngx-spinner';

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
    // }
  ]

  allTotal=[];

  style = [];
  constructor(
    private apiservice: ApiService,
    private router: Router,
    private notifierService: NotifierService,
    private spinner: NgxSpinnerService,
  ) {
  }

  ngOnInit(): void {

    this.country = this.apiservice.getCountry();
    // getAllCart
    this.getAllCart()
  }

  getAllCart() {
    this.spinner.show('loadCarts');
    this.style = []
    this.apiservice.getAllCart().subscribe(
      (responce) => {
        if (responce['message'] = 'success') {
          this.allCart = responce['data'];
          this.numOFQuantity = 0;
          this.allTotalPrice = 0;

          let totalegy = 0;
          let totalksa = 0;
          this.allTotal=[]
          this.allCart.forEach(
            (e) => {
                  if(e.region=='Egypt'){
                    totalegy += e.price * e.quantity
                  }else{
                    totalksa += e.price * e.quantity
                  }
                 this.numOFQuantity += e.quantity 
                }
                )
                this.allTotal.push({'egy':totalegy ,'ksa':totalksa})


          // this.cart.forEach(
          //   (e) => {
          //     this.numOFQuantity += e.quantity
          //     this.allTotalPrice += e.quantity * e.price
          //   }
          // )
          this.spinner.hide('loadCarts');

        }
      },
      (error) => {
        console.log('error: ' + error['responseCode']);
        this.spinner.hide('loadCarts');
      }
    );
  }


  focusQuantity(ind) {
    if (this.allCart[ind].quantity) {
      this.style[ind] = true
    }
  }

  changeQuantity(event, ind) {
    if (event) {
      this.style[ind] = true
    } else {
      this.style[ind] = false
    }
  }


  deleteIdCart(cartId) {
    this.apiservice.deleteCart(cartId).subscribe(
      (response) => {
        if (response['message'] == 'success') {
          this.notifierService.notify('success', 'Deleted Successfully')
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
  }

  editCartQuantity(cartId, quantity) {
    console.log('cartId', cartId)
    console.log('quantity', quantity)
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
      this.apiservice.editCartQuantity(cartId, quantity).subscribe(
        (response) => {
          if (response['message'] == 'success') {
            this.notifierService.notify('success', 'Updated Successfully')
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
    }

  }
}
