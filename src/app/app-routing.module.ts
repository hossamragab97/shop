import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { HomeComponent } from "./components/home/home.component";
import { LoginComponent } from "./components/login/login.component";
import { MyCartComponent } from "./components/my-cart/my-cart.component";
import { ProductsComponent } from "./components/products/products.component";
import { AuthGuard as AuthGuard } from '../app/security/AuthGuard';
import { LoginGuard as LoginGuard } from "./security/login.guard";

import { CheckoutComponent } from "./components/checkout/checkout.component";
import { WishlistComponent } from "./components/wishlist/wishlist.component";
import { AdminComponent } from "./components/admin/admin.component";
import { AdminCreateComponent } from "./components/admin/admin-create/admin-create.component";
import { AdminAddCategoryComponent } from "./components/admin/admin-add-category/admin-add-category.component";
import { AdminGuard as AdminGuard } from "./security/admin.guard";
import { OrderComponent } from "./components/order/order.component";
import { AdminTodayProductComponent } from "./components/admin/admin-today-product/admin-today-product.component";
import { AdminPhotoSliderComponent } from "./components/admin/admin-photo-slider/admin-photo-slider.component";
import { RegisterComponent } from "./components/register/register.component";

const appRoutes: Routes = [
    { path:'home' ,component:HomeComponent,},
    { 
        path:'admin' ,component:AdminComponent,
        canActivate: [AdminGuard],       
    },
    { 
        path:'admin-create' ,component:AdminCreateComponent,
        canActivate: [AdminGuard],       
    },
    {
        path:'admin-add-category' ,component:AdminAddCategoryComponent,
        canActivate: [AdminGuard],       
    },
    {
        path:'admin-today-product' ,component:AdminTodayProductComponent,
        canActivate: [AdminGuard],       
    },
    {
        path:'admin-slider' ,component:AdminPhotoSliderComponent,
        canActivate: [AdminGuard],       
    },
    {
         path:'products' ,component:ProductsComponent,
         canActivate: [AuthGuard],
    },
    {
        path:'cart' ,component:MyCartComponent,
        canActivate: [AuthGuard],
    },
    {
        path:'wishlist' ,component:WishlistComponent,
        canActivate: [AuthGuard],
    },
    {
        path:'order' ,component:OrderComponent,
        canActivate: [AuthGuard],
    },
    { 
        path:'login' ,component:LoginComponent,
        canActivate: [LoginGuard],
    },
    { 
        path:'register' ,component:RegisterComponent,
        canActivate: [LoginGuard],
    },
    { path:'checkout' ,component:CheckoutComponent},
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    { path: '**', redirectTo: '/home', pathMatch: 'full' },]

@NgModule({
    imports: [RouterModule.forRoot(appRoutes)],
    exports: [RouterModule]
})

export class AppRoutingModule { }
