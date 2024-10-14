import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/network/api.service';
import { Router } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit {


  listOrder = [];
  allTotal = []


  constructor(
    private apiservice: ApiService,
    private router: Router,
    private notifierService: NotifierService,
    private spinner: NgxSpinnerService,
  ) {
  }


  ngOnInit(): void {
    //get all order
    this.getAllOrder();
  }
  // Object.keys(....)
  getAllOrder() {
    this.spinner.show('loadOrder');
    this.apiservice.getAllOrder().subscribe(
      (response) => {
        this.listOrder = response['data']
        if (this.listOrder.length > 0) {
          this.listOrder = Object.values(this.listOrder[0])
          this.listOrder.forEach(
            (element) => {
              let totalegy = 0;
              let totalksa = 0;
              element.forEach(
                (e) => {
                  if (e.region == 'Egypt') {
                    totalegy += e.price * e.quantity
                  } else {
                    totalksa += e.price * e.quantity
                  }
                }
              )
              this.allTotal.push({ 'egy': totalegy, 'ksa': totalksa })
            }
          )
        }

        this.spinner.hide('loadOrder');

        console.log(' this.listOrder', (this.listOrder))
      },
      (error) => {
        this.spinner.hide('loadOrder');
        console.log('error: ' + error['responseCode']);
      }
    );
  }

}
