import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Booking } from '../models/booking';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private apiUrl = 'https://localhost:7113/api/Booking';

  constructor(private http: HttpClient) {}

  

  getBookings(): Observable<Booking[]> {
    return this.http.get<Booking[]>(this.apiUrl);
  }

  getBookingById(id: number): Observable<Booking> {
    return this.http.get<Booking>(`${this.apiUrl}/${id}`);
  }
CreateBooking(booking: any): Observable<any> {
  return this.http.post('https://localhost:7113/api/Booking', booking);
}

 UpdateBooking(id: number): void {
  if (confirm("Are you sure you want to update this booking?")) {
    const updatedData = {
      id: id,
      cabId: 2, // example values - replace with actual form input
      fromLocation: "UpdatedFrom",
      toLocation: "UpdatedTo",
      pickupDateTime: "2025-06-25T10:00:00",
      returnDateTime: "2025-06-25T12:00:00",
      customerName: "Updated Name",
      phoneNumber: "9876543210",
      address: "Updated Address"
    };

    this.http.put(`https://localhost:7113/api/Booking`, updatedData)
      .subscribe({
        next: () => {
          alert('Booking updated successfully');
        },
        error: error => {
          console.error('Update failed:', error);
          alert('Update failed');
        }
      });
  }
}

 DeleteUser(id: number): void {
  if (confirm("Are you sure you want to delete this booking?")) {
    this.http.delete(`https://localhost:7113/api/Booking/${id}`)
      .subscribe({
        next: () => {
          alert('Booking deleted successfully');
        },
        error: error => {
          console.error('Delete failed:', error);
          alert('Delete failed');
        }
      });
  }
}
}
