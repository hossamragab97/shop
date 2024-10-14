import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/network/api.service';
import { Router } from '@angular/router';
import { NotifierService } from 'angular-notifier';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {
  listOrder=[];
  // listOrder=
  //    [
  //      {   
  //          orderId:"1",
  //          PRODUCTS:[
  //           {name:"****1", quantity:7, price:50},
  //           {name:"****2", quantity:5, price:20},
  //           {name:"****3", quantity:2, price:70}
  //          ]
  //      }
  // ];
  allTotal=[];
  constructor(
    private apiservice: ApiService,
    private router: Router,
    private notifierService: NotifierService
  ) {
  }

 
  ngOnInit(): void {
    //get all cart
    this.getAllCart();
  }

  getAllCart() {
    this.apiservice.getAllCart().subscribe(
      (response) => {
        this.listOrder = response['data']
        let totalegy = 0;
        let totalksa = 0;
        this.listOrder.forEach(
            (e) => {
              if(e.region=='Egypt'){
                totalegy += e.price * e.quantity
              }else{
                totalksa += e.price * e.quantity
              }
            }
            )
            this.allTotal.push({'egy':totalegy ,'ksa':totalksa})
          },
      (error) => {
        console.log('error: ' + error['responseCode']);
      }
    );
  }

  placeOrder(){
    // this.router.navigate(['order']);
    // this.notifierService.notify('success', "added Successfully.");
    this.apiservice.addOrder().subscribe(
      (response) => {
        if ((response['message'] == 'success')) {
          this.notifierService.notify('success', "added Successfully.");
          this.router.navigate(['order']);
          this.apiservice.changeCart(0)      
        }
      }
    )
  }

}
