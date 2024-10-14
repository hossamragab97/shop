
import { Component, OnInit, ViewChild } from '@angular/core';
import { ApiService } from 'src/app/network/api.service';
import { HttpClient, HttpHeaders, HttpEvent, HttpHandler, HttpErrorResponse, HttpResponse, HttpHeaderResponse, HttpParams } from '@angular/common/http';
import { ConfigVariables } from '../../../shared/config';
import { map, catchError, elementAt } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { NotifierService } from 'angular-notifier';
import { LocalStorageService } from 'angular-web-storage';
import { Router } from '@angular/router';
import { IDropdownSettings } from 'ng-multiselect-dropdown';

import Swal from 'sweetalert2';
@Component({
  selector: 'app-admin-today-product',
  templateUrl: './admin-today-product.component.html',
  styleUrls: ['./admin-today-product.component.css']
})
export class AdminTodayProductComponent implements OnInit {

  isProductSelect=false
  dropdownSettings: IDropdownSettings;
  selectedProducts=[];
  allProducts=[];
  // allProducts=[
  //      {
  //     id: 1,
  //     name: 'sensor'
  //   },
  //   {
  //     id: 2,
  //     name: 'gateway'
  //   },
  //      {
  //     id: 3,
  //     name: 'temp sensor'
  //   },
  // ];



  constructor(
    private apiService: ApiService,
    private httpClient: HttpClient,
    private local: LocalStorageService,
    private notifierService: NotifierService,
    private translate: TranslateService,
    // private session: SessionStorageService, 
    private router: Router,
  ) { }


  ngOnInit(): void {

    //get allProduct
    this.getAllProducts()

    this.dropdownSettings = {
      singleSelection: false,
      idField: 'id',
      textField: 'name',
      selectAllText: 'selectAll',
      unSelectAllText: 'unSelectAll',
      itemsShowLimit: 3,
      allowSearchFilter: true,
    };



  }

  getAllProducts() {
    this.apiService.getAllProducts('',0).subscribe(
      (responce) => {
        console.log('')
        this.allProducts = responce['data'];

        this.apiService.getTodayProducts().subscribe(
          (res)=>{
              let allData= res['data']
              this.selectedProducts=[];
              allData.forEach(
                (e)=>{
                  this.selectedProducts.push({id:e.id , name:e.name})
                }
     
                )
          }
        );

      },
      (error) => {
        console.log('error: ' + error['responseCode']);
      }
    );
  }

  onSelectProduct(e){
    if(e){
      this.isProductSelect=false
    }
  }

  onDeSelectProduct(){
    if(this.selectedProducts.length == 0){
      this.isProductSelect=true
    }
  }

  onDeSelectAll(){
    this.isProductSelect=true
  }

  save_products(){
    if(this.selectedProducts.length == 0){
      this.isProductSelect=true
    }else{
      this.isProductSelect=false

      let allId=[]
      this.selectedProducts.forEach(
        (element)=>{
          allId.push(element.id)
        }
      )
      this.apiService.addTodayProducts(allId).subscribe(
        (response)=>{
          if ((response['message'] == 'success')) {
            this.notifierService.notify('success', 'successful added');
          }
        }
      );
    }
  }
}