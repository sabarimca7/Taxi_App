import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Cab } from '../models/cab';

@Component({
  selector: 'app-booking-form',
  templateUrl: './booking-form.component.html',
  styleUrls: ['./booking-form.component.css']
})
export class BookingFormComponent implements OnInit {
  bookingForm!: FormGroup;
  availableCabs: Cab[] = [];
  bookingId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Initialize form
    this.bookingForm = this.fb.group({
      cabId: ['', Validators.required],
      fromLocation: ['', Validators.required],
      toLocation: ['', Validators.required],
      pickupDateTime: ['', Validators.required],
      returnDateTime: [''],
      customerName: ['', Validators.required],
      phoneNumber: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      address: ['', Validators.required]
    });

    // Load cab list
    // this.loadAvailableCabs();

    // Check for edit mode via route param
    this.route.paramMap.subscribe(params => {
      const idParam = params.get('id');
      if (idParam) {
        this.bookingId = +idParam;
        this.loadBookingData(this.bookingId);
      }
    });
  }

  loadAvailableCabs(): void {
    this.http.get<Cab[]>('https://localhost:7113/api/Cab')
      .subscribe({
        next: cabs => this.availableCabs = cabs,
        error: err => console.error('Error loading cabs:', err)
      });
  }

  loadBookingData(id: number): void {
    this.http.get<any>(`https://localhost:7113/api/Booking/id?id=${id}`)
      .subscribe({
        next: booking => {
          if (booking) {
            this.bookingForm.patchValue(booking);
          }
        },
        error: err => console.error('Error loading booking:', err)
      });
  }

  onSubmit(): void {
    const data = this.bookingForm.value;

    if (this.bookingId) {
      // UPDATE
      this.http.put(`https://localhost:7113/api/Booking/id?id=${this.bookingId}`, data)
        .subscribe({
          next: () => {
            alert('Booking updated successfully!');
            this.router.navigate(['/booking-list']);
          },
          error: err => {
            console.error('Update error:', err);
            alert('Update failed');
          }
        });
    } else {
      // CREATE
      this.http.post('https://localhost:7113/api/Booking', data)
        .subscribe({
          next: () => {
            alert('Booking created successfully!');
            this.router.navigate(['/booking-list']);
          },
          error: err => {
            console.error('Create error:', err);
            alert('Create failed');
          }
        });
    }
  }

  onCancel(): void {
    this.router.navigate(['/booking-list']);
  }
}
