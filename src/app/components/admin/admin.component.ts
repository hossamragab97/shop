import { Component, OnInit, ViewChild } from '@angular/core';
import { ApiService } from 'src/app/network/api.service';
import { HttpClient, HttpHeaders, HttpEvent, HttpHandler, HttpErrorResponse, HttpResponse, HttpHeaderResponse, HttpParams } from '@angular/common/http';
import { ConfigVariables } from '../../shared/config';
import { map, catchError } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { NotifierService } from 'angular-notifier';
import { LocalStorageService } from 'angular-web-storage';
import { Router } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { IDropdownSettings } from 'ng-multiselect-dropdown';

import Swal from 'sweetalert2';

var self;

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {


  constructor(
    private apiService: ApiService,
    private httpClient: HttpClient,
    private local: LocalStorageService,
    private notifierService: NotifierService,
    private translate: TranslateService,
    // private session: SessionStorageService, 
    private router: Router,
  ) { }

  @ViewChild(DataTableDirective)
  datatableElement: DataTableDirective;
  dtOptions: any = {};
  dtTrigger: Subject<any> = new Subject();


  products=[];
  dropdownSettings: IDropdownSettings;
  selectedAction;
  allAction=[
       {
      id: 1,
      name: 'Add Product'
    },
    {
      id: 2,
      name: 'Add Category'
    },
       {
      id: 3,
      name: 'Today Product'
    },
    {
      id: 4,
      name: 'Photo Slider'
    },

  ];

  ngOnInit(): void {

    this.dropdownSettings = {
      singleSelection: true,
      idField: 'id',
      textField: 'name',
      selectAllText: 'selectAll',
      unSelectAllText: 'unSelectAll',
      itemsShowLimit: 2,
      allowSearchFilter: true,
    };


    self = this;
    this.dtOptions = {
      pageLength: 10,
      // pagingType: 'simple',
      info: false,
      "bPaginate": false,
      lengthChange: false,
      responsive: true,
      serverSide: true,
      processing: true,
      searching: false,
      ajax: (dataTablesParameters: any, callback) => {
        var currentUser = this.apiService.getUserLoggedIn();
        currentUser = JSON.parse(currentUser);
        let country = this.apiService.getCountry();
        var entity = currentUser['entity'][0];
        // console.log("entity['token']", entity['token']);
        var headerss = new HttpHeaders({
          'content-type': 'application/json',
          TOKEN: entity['token'],
          Accept: 'application/json',
          'region': country
        });
        // let offset = dataTablesParameters['start'];
        // let search = dataTablesParameters['search'].value;
        this.httpClient
          .get(`${ConfigVariables.API_URL}/Product`, {
            // params: { offset, search },
            headers: headerss,
          })
          .pipe(
            catchError((error: HttpErrorResponse) => {
              if (error.status == 401) {
                this.local.set('currentUser', null);
                this.router.navigate(['login']).then(() => {
                  window.location.reload();
                });
              }
              if (error.status == 0) {
                this.translate
                  .get('Something went wrong, Please try again later')
                  .subscribe((res) => {
                    this.notifierService.notify('error', res);
                  });
                this.local.set('currentUser', null);
                this.router.navigate(['login']).then(() => {
                  window.location.reload();
                });
              }
              throw error.error;
            })
          )
          .subscribe((resp) => {
            self.roles = resp['data'];

            callback({
              recordsTotal: resp['size'],
              recordsFiltered: resp['size'],
              data: self.roles,
            });
          });
      },
      columns: [
        {
          data: function (row) {
            return row;
          },
          render: function (data) {
            let image = ConfigVariables.Image_Shop+ data.image;
            return '<img alt="'+data.image+'" class="cart_img" src="' + image + '" style="width: 100px;height:100px;border: 1px solid rgb(37, 32, 32) !important;">';
          }
        },
        { data: 'name' ,
        responsivePriority: 1,
      },
        { data: 'price' },
        {
          data: function (row) {
            return row;
          },
          // responsivePriority: 1,
          render: function (data) {
            var col = '';
            var def;
            self.translate.get('Edit').subscribe((res) => {
              def = res;
            });
            col +=
              '<button value="" id="goUpdate" style="padding: 6px;margin-right: 5px;border-radius: 5px !important;font-size: large;" title="' +
              def +
              '" class="btn btn-icon btn-warning">  <i class="fa fa-edit"></i> </button>';

            var def;
            self.translate.get('Deactivate').subscribe((res) => {
              def = res;
            });
            col +=
              '<button value="" id="goDeactivate"  style="padding: 6px;margin-right: 5px;border-radius: 5px !important;font-size: large;" title="' +
              def +
              '" class="btn btn-icon btn-danger">  <i class="fa fa-close"></i> </button>';
            return col;
          },
        },
      ],
      rowCallback: (row: Node, data: any[] | Object, index: number) => {
        const self = this;
        $('td', row).unbind('click');
        for (let i = 0; i < row.childNodes[3].childNodes.length; i++) {
          if (row.childNodes[3].childNodes[i]['id'] == 'goUpdate') {
            row.childNodes[3].childNodes[i].addEventListener(
              'click',
              () => {
                self.goUpdate(data['id']);
              });
          } else if (row.childNodes[3].childNodes[i]['id'] == 'goDeactivate') {
            row.childNodes[3].childNodes[i].addEventListener(
              'click',
              () => {
                console.log('goDeactivateRole', data['id']);
                self.goDeactivateProduct(data['id']);
              }
            );
          }
        }
        return row;
      },
    };
  
  }


  goUpdate(id) {
    this.router.navigate(['admin-create'], {
      queryParams: { id: id },
      skipLocationChange: false,
    });
  }

  goDeactivateProduct(Id) {

    let id = Id;
    Swal.fire({
      title: 'Are you sure you want to deactivate this Product?',
      // text: "You won't be able to revert this!",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'OK',
      cancelButtonText: 'Cancle',
      preConfirm: () => {
        this.apiService.deleteProduct(Id).subscribe(
          (res) => {
            if(res['message']=='success'){
              this.rerender()
            }
          }
        );
      },
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: 'Your Product has been deactivatd',
          icon: 'success',
          confirmButtonText: 'Ok',
          preConfirm: () => {
          },
        });
      }
      // location.reload();
    });

    // this.apiService.deleteProduct(Id).subscribe(
    //   (res)=>{
    //     this.rerender()
    //   }
    // );
  }

  rerender(): void {
    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.clear();
      dtInstance.ajax.reload();
    });
  }

  // ngAfterViewInit() {
  //   this.dtTrigger.next(1);
  // }


  onSelectCatogry(event){
     let id=event.id
     if(id==1){
         this.router.navigate(['admin-create'])
     }else if(id==2){
      this.router.navigate(['admin-add-category'])
     }else if(id==3){
      this.router.navigate(['admin-today-product'])
     }else{
      this.router.navigate(['admin-slider'])
     }
  }

}
