import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Cab } from '../models/cab';


@Component({
  selector: 'app-booking-list',
  templateUrl: './booking-list.component.html',
  styleUrls: ['./booking-list.component.css']
})
export class BookingListComponent implements OnInit {
  bookings: any[] = [];

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.loadBookings();
  }

  loadBookings(): void {
    this.http.get<any[]>('https://localhost:7113/api/Booking')
      .subscribe({
        next: res => this.bookings = res,
        error: err => console.error('Failed to load bookings:', err)
      });
  }

  editBooking(id: number): void {
    this.router.navigate(['/booking-form', id]);     
  }

  deleteBooking(id: number): void {
    if (confirm('Are you sure you want to delete this booking?')) {
      this.http.delete(`https://localhost:7113/api/Booking/${id}`)
        .subscribe({
          next: () => {
            alert('Booking deleted successfully!');
            this.loadBookings();
          },
          error: err => {
            console.error('Delete failed:', err);
            alert('Delete failed!');
          }
        });
    }
  }

  createNewBooking(): void {
    this.router.navigate(['/booking-form']);
  }
}