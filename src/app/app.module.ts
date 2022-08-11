import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTabsModule } from '@angular/material/tabs';
import { PhoneDirectoryComponent } from './phone-directory/phone-directory.component';
import { AuthorizationComponent } from './authorization/authorization.component';
import { StaffListComponent } from './staff-list/staff-list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DropdownStringComponent } from './dropdown-string/dropdown-string.component';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatProgressBarModule} from '@angular/material/progress-bar';





const appRoute: Routes = [
  {    path: '', component:  PhoneDirectoryComponent},
  {    path: 'phone-directory', component: PhoneDirectoryComponent}
  
]
@NgModule({
  declarations: [
    AppComponent,
    PhoneDirectoryComponent,
    AuthorizationComponent,
    StaffListComponent,
    DropdownStringComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(appRoute,{useHash: true}),
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatDialogModule,
    MatTabsModule,
    FormsModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule,
    MatProgressBarModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
