import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BookingListComponent } from './booking-list/booking-list.component';
import { BookingFormComponent } from './booking-form/booking-form.component';
const routes: Routes = [
      { path: '', redirectTo: 'bookings', pathMatch: 'full' },
      { path: 'booking-list', component: BookingListComponent },
      { path: 'bookings', component: BookingListComponent },
      { path: 'booking-form', component: BookingFormComponent },
        { path: 'booking-form/:id', component: BookingFormComponent }, 
      { path: 'edit/:id', component: BookingFormComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }