import { Component, OnInit, ViewChild } from '@angular/core';
import { ApiService } from 'src/app/network/api.service';
import { HttpClient, HttpHeaders, HttpEvent, HttpHandler, HttpErrorResponse, HttpResponse, HttpHeaderResponse, HttpParams } from '@angular/common/http';
import { ConfigVariables } from '../../../shared/config';
import { map, catchError, elementAt } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { NotifierService } from 'angular-notifier';
import { LocalStorageService } from 'angular-web-storage';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-photo-slider',
  templateUrl: './admin-photo-slider.component.html',
  styleUrls: ['./admin-photo-slider.component.css']
})
export class AdminPhotoSliderComponent {

  selectedPhotos=[];
  allImages = []
  // ["../assets/images/skarpt_shop/banner1.jpeg" , "../assets/images/skarpt_shop/banner2.jpeg" , "../assets/skarpt.jpg"]

  selectedFile: File = null;
  noPhoto: boolean = false;
  imageUrl: string = '';
  changePhoto: boolean = false;
  submittedImage: string = null;

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


    //get allPhoto
    // this.getPhotoSlider()

    // $('.addfiles').on('click', function() { $('#fileupload').click();return false;});

  //   $('.addfiles').on('click', function() {
  //     $('#fileupload').trigger('click');
  // });

  this.getPhotoSlider()
  }

  getPhotoSlider() {
    this.apiService.getPhotoSlider().subscribe(
      (responce) => {
        let data=responce['data'];
        // this.allImages = responce['data'];
        if(data.length==0){
          this.allImages.push("")
        }else{
           data.forEach(
            (e)=>{
              this.allImages.push(ConfigVariables.Image_Shop + e)
            }
           )
        }
      },
      (error) => {
        console.log('error: ' + error['responseCode']);
      }
    );
  }

  deleteImage(index){
      this.allImages.splice(index,1)
  }

  addImage(){
    this.allImages.push("");
  }

  onFileSelected(file: FileList , ind) {
    this.selectedFile = file.item(0);
    this.noPhoto = false;
    var reader = new FileReader();
    reader.onload = (event: any) => {
      this.allImages[ind]=event.target.result;
      console.log('this.allImages[ind]'  , this.allImages[ind])
      // this.selectedPhotos[ind]=event.target.result
    }
    reader.readAsDataURL(this.selectedFile);
  }


  save_change(){
    let imagesNotEmpty=false;
    console.log('images' , this.allImages)
    let images=[]
    this.allImages.forEach(
      (e)=>{
        if(e!=''){
          imagesNotEmpty=true
          images.push(e)
        } 
      }
    )
    if(imagesNotEmpty){
      this.apiService.addPhotoSlider(images).subscribe(
        (res)=>{
          if(res['message'] == 'success')
          this.notifierService.notify('success', 'saved Successfully.')
        }
      );
    }else{
      this.notifierService.notify('error', 'choose at least one image')
    }
  }
}