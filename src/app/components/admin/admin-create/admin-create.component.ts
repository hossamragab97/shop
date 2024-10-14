import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from 'src/app/network/api.service';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { ActivatedRoute, Router } from '@angular/router';
import { Products } from 'src/app/shared/products';
import { NotifierService } from 'angular-notifier';
import { ConfigVariables } from 'src/app/shared/config';

@Component({
  selector: 'app-admin-create',
  templateUrl: './admin-create.component.html',
  styleUrls: ['./admin-create.component.css']
})
export class AdminCreateComponent implements OnInit {
  addOrEdit;
  addForm: FormGroup;
  submitted;
  @Input() productId: number;
  groupf: Products;
  name;
  description;
  cairoOrRiyadh;
  selectCategory = [];
  price;
  photo;
  dropdownSettings: IDropdownSettings;
  allCategory = [
    // {
    //   id: 1,
    //   name: 'gateway'
    // },
    // {
    //   id: 2,
    //   name: 'sensor'
    // },
  ]
  reigon = [
    {
      id: 1,
      name: 'Egypt'
    },
    {
      id: 2,
      name: 'Ksa'
    },
  ]
  selectedCountry=[];
  priceNotNumber = false;

  selectedFile: File = null;
  imageUrl: string = '';
  changePhoto: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private apiService: ApiService,
    private routerActive: ActivatedRoute,
    private router: Router,
    private notifierService: NotifierService
  ) {

    this.groupf = new Products();

    this.routerActive.queryParams.subscribe((params) => {
      this.productId = params['id'];
    });
    this.router.routeReuseStrategy.shouldReuseRoute = function () {
      return false;
    };
    this.router.navigated = false;
  }

  ngOnInit(): void {

    // $('.addfiles').on('click', function() { $('#fileupload').click();return false;});


    // getAllCategory
    this.getAllCategory();

    this.addForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      description: ['', [Validators.required]],
      category: ['', [Validators.required]],
      price: ['', [Validators.required]],
      cairoOrRiyadh: ['', [Validators.required]],
      // photo: ['', [Validators.required]],
    });

    this.dropdownSettings = {
      singleSelection: true,
      idField: 'id',
      textField: 'name',
      selectAllText: 'selectAll',
      unSelectAllText: 'unSelectAll',
      itemsShowLimit: 2,
      allowSearchFilter: true,
      closeDropDownOnSelection:true
    };

    if (this.productId) {
      this.addOrEdit='edit'
      this.apiService.getProductInfo(this.productId).subscribe(
        (response) => {
          this.groupf = response['data'][0];
          this.groupf.image = ConfigVariables.Image_Shop+ this.groupf.image;
          
          // this.groupf.image='../assets/images/skarpt_shop/sensor.png'
          console.log(' this.groupf jjjjjjjj' ,  this.groupf.image)
          this.apiService.getAllCategory().subscribe(
            (responce)=>{
              this.allCategory=responce['data'];
              this.allCategory.filter(
                (element)=>{
                  if(element.id == this.groupf.categoryId){
                     this.selectCategory=[element]
                  }
                }
              );
            },
            (error) => {
              console.log('error: ' + error['responseCode']);
            }
          );

          this.reigon.filter(
            (element)=>{
              if(element.name == this.groupf.region){
                 this.selectedCountry=[element]
              }
            }
          );
        },
        (error) => {
          console.log('error: ' + error['responseCode']);
        }
      );
    }else{
      this.addOrEdit='add'
    }

    // this.local.set("isLogged",true);
  }
  get formFields() {
    return this.addForm.controls;
  }


  onSubmit() {
    // console.log(this.email,this.password);
    this.submitted = true;
    if (
      !this.formFields.name.errors &&
      !this.formFields.category.errors &&
      !this.formFields.price.errors &&
      // !this.formFields.photo.errors &&
      !this.formFields.cairoOrRiyadh.errors &&
      !this.priceNotNumber &&
      this.groupf.image
    ) {
      //edit product
      if(this.productId){
        this.apiService.editProduct(this.groupf,this.productId).subscribe(
          (response) => {
            console.log('mess  ', typeof response['message']);
            if ((response['message'] == 'success')) {
              this.notifierService.notify('success', "saved Successfully.");
              this.router.navigate(['admin']);
            }else{
              this.notifierService.notify('warning', response['message']);
            }
          },
          (error) => {
            console.log('errror' , error)
            this.notifierService.notify('error', error.message);
          }
        );
      //add product
      }else{
        console.log('this.groupf  ', this.groupf);
        this.groupf.categoryId=this.selectCategory[0].id;
        this.groupf.region=this.selectedCountry[0].name;
        this.apiService.addProduct(this.groupf).subscribe(
          (response) => {
            console.log('mess  ', typeof response['message']);
            if ((response['message'] == 'success')) {
              this.notifierService.notify('success', "added Successfully.");
              this.router.navigate(['admin']);
            }else{
              this.notifierService.notify('error', response['message']);
            }
          },
          (error) => {
            this.notifierService.notify('error', error.message);
          }
        );
      }
      console.log('ddddddddddd')
    }
  }



  onFileSelected(file: FileList) {
    this.selectedFile = file.item(0);
    var reader = new FileReader();
    reader.onload = (event: any) => {
      // this.savePhoto(event.target.result);
      this.groupf.image=event.target.result
      this.imageUrl = event.target.result;
    }
    reader.readAsDataURL(this.selectedFile);
    // if ((this.selectedFile.size / 1000) > 1000) {
    //   this.selectedFileSize = true;
    //   this.noPhoto = true;
    // }
    // if ((this.selectedFile.type != "image/png") && (this.selectedFile.type != "image/jpg") && (this.selectedFile.type != "image/jpeg")) {
    //   this.selectedFileType = true;
    //   this.noPhoto = true;
    // }
  }

  // savePhoto(image) {
  //   this.submittedImage = image;
  // }


  priceNotNum(e) {
    let number = e
    if (number == null || number == '') {
      this.priceNotNumber = false;
    } else if (!Number(number)) {
      this.priceNotNumber = true
    } else {
      this.priceNotNumber = false;
    }
  }

  getAllCategory(){
    this.apiService.getAllCategory().subscribe(
      (responce)=>{
        this.allCategory=responce['data'];
      },
      (error) => {
        console.log('error: ' + error['responseCode']);
      }
    );
  }
  
}
