import { Component , OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from 'src/app/network/api.service';
import { NotifierService } from 'angular-notifier';
import { Router } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { catchError, Subject } from 'rxjs';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';
import { LocalStorageService } from 'angular-web-storage';
import { ConfigVariables } from 'src/app/shared/config';
import Swal from 'sweetalert2';

var self;

@Component({
  selector: 'app-admin-add-category',
  templateUrl: './admin-add-category.component.html',
  styleUrls: ['./admin-add-category.component.css']
})
export class AdminAddCategoryComponent implements OnInit  {
  addForm: FormGroup;
  @ViewChild(DataTableDirective)
  datatableElement: DataTableDirective;
  dtOptions: any = {};
  dtTrigger: Subject<any> = new Subject();

  submitted;
  category;

  constructor(
    private formBuilder: FormBuilder,
    private apiService: ApiService,
    private notifierService:NotifierService,
    private router:Router,
    private httpClient: HttpClient,
    private local: LocalStorageService,
    private translate: TranslateService,
    // private session: SessionStorageService, 
  ) {}

  ngOnInit(): void {
    this.addForm = this.formBuilder.group({
      category: ['', [Validators.required]],
    });

    // this.local.set("isLogged",true);

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
          Accept: 'application/json',
        });
        // let offset = dataTablesParameters['start'];
        // let search = dataTablesParameters['search'].value;
        this.httpClient
          .get(`${ConfigVariables.API_URL}/Category`, {
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
        { data: 'name' },
        {
          data: function (row) {
            return row;
          },
          // responsivePriority: 1,
          render: function (data) {
            var col = '';
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
        for (let i = 0; i < row.childNodes[1].childNodes.length; i++) {
           if (row.childNodes[1].childNodes[i]['id'] == 'goDeactivate') {
            row.childNodes[1].childNodes[i].addEventListener(
              'click',
              () => {
                console.log('goDeactivateRole', data['id']);
                self.goDeactivateCategory(data['id']);
              }
            );
          }
        }
        return row;
      },
    };


  }
  get formFields() {
    return this.addForm.controls;
  }


  onSubmit(){
    this.submitted = true ;
    if (!this.formFields.category.errors) {
      this.apiService.addCategory(this.category).subscribe(
        (response)=>{
          console.log('ress'  , response)
          if ((response['message'] == 'success')) {
            this.notifierService.notify('success', 'successful added');
            // location.reload()
            this.rerender();
            
          }else{
            this.notifierService.notify('warning', response['message']);
          }
        }
      );
    }
  }

  goDeactivateCategory(Id) {

    Swal.fire({
      title: 'Are you sure you want to deactivate this Category?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'OK',
      cancelButtonText: 'Cancle',
      preConfirm: () => {
    document.body.style.paddingRight = '0px';

         this.apiService.deleteCategory(Id).subscribe(
          (res) => {
            // this.rerender()
          }
        );
      },
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: 'Your Category has been deactivatd',
          icon: 'success',
          confirmButtonText: 'Ok',
          preConfirm: () => {
            this.rerender();
            // location.reload()
          },
        }).then(result => {
        });
      }
      // location.reload();
    });
  }


  rerender(): void {
    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.clear();
      dtInstance.ajax.reload();
    });
  }

}
