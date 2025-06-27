import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { BookingListComponent } from './booking-list/booking-list.component';
import { BookingFormComponent } from './booking-form/booking-form.component';
import { ContactComponent } from './contact/contact.component';
import { HomeComponent } from './home/home.component';



const routes: Routes = [
      { path: '', redirectTo: 'bookings', pathMatch: 'full' },
      { path: '', component: HomeComponent }, 
      { path: 'book-cab', component: BookingFormComponent },
      { path: 'booking-list', component: BookingListComponent },
      { path: 'bookings', component: BookingListComponent },
      { path: 'booking-form', component: BookingFormComponent },
      { path: 'booking-form/:id', component: BookingFormComponent }, 
      { path: 'edit/:id', component: BookingFormComponent },
      { path: 'contact', component: ContactComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }