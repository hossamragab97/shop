import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { ProductsComponent } from './components/products/products.component';
import { AppRoutingModule } from './app-routing.module';
import { MyCartComponent } from './components/my-cart/my-cart.component';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { AuthGuard } from './security/AuthGuard';
import { LoginGuard } from './security/login.guard';

import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { WishlistComponent } from './components/wishlist/wishlist.component';

import { DataTablesModule } from 'angular-datatables';
import { AdminComponent } from './components/admin/admin.component';
import { AdminCreateComponent } from './components/admin/admin-create/admin-create.component';
import { AdminAddCategoryComponent } from './components/admin/admin-add-category/admin-add-category.component';

import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { NotifierModule, NotifierOptions } from 'angular-notifier';
import { AdminGuard } from './security/admin.guard';
import { AngularWebStorageModule } from 'angular-web-storage';
import { OrderComponent } from './components/order/order.component';

import { NgxSpinnerModule } from "ngx-spinner"
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { AdminTodayProductComponent } from './components/admin/admin-today-product/admin-today-product.component';
import { AdminPhotoSliderComponent } from './components/admin/admin-photo-slider/admin-photo-slider.component';
import { RegisterComponent } from './components/register/register.component';

const customNotifierOptions: NotifierOptions = {
  position: {
    horizontal: {
      position: 'right',
      distance: 12,
    },
    vertical: {
      position: 'top',
      distance: 60,
      gap: 10,
    },
  },
  theme: 'material',
  behaviour: {
    autoHide: 5000,
    onClick: 'hide',
    onMouseover: 'pauseAutoHide',
    showDismissButton: true,
    stacking: 4,
  },
  animations: {
    enabled: true,
    show: {
      preset: 'slide',
      speed: 300,
      easing: 'ease',
    },
    hide: {
      preset: 'fade',
      speed: 300,
      easing: 'ease',
      offset: 50,
    },
    shift: {
      speed: 300,
      easing: 'ease',
    },
    overlap: 150,
  },
};
@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    HomeComponent,
    LoginComponent,
    ProductsComponent,
    MyCartComponent,
    CheckoutComponent,
    WishlistComponent,
    AdminComponent,
    AdminCreateComponent,
    AdminAddCategoryComponent,
    OrderComponent,
    AdminTodayProductComponent,
    AdminPhotoSliderComponent,
    RegisterComponent,
  ],
  imports: [
    CommonModule,
    BrowserAnimationsModule,
    NgxSpinnerModule,
    AngularWebStorageModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserModule,
    AppRoutingModule,
    TranslateModule.forRoot({
      defaultLanguage:'en',
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    DataTablesModule,
    NgMultiSelectDropDownModule.forRoot(),
    NotifierModule.withConfig(customNotifierOptions),
    SweetAlert2Module.forRoot(),
  ],
  providers: [
    AuthGuard,
    LoginGuard,
    AdminGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

// required for AOT compilation
export function HttpLoaderFactory(http: HttpClient){
  return new TranslateHttpLoader(http , './assets/i18n/','.json');
}
