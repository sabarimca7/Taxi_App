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

  
  public hours: string[] = Array.from({ length: 12 }, (_, i) => (i + 1).toString().padStart(2, '0'));
  public minutes: string[] = Array.from({ length: 60 }, (_, i) => (i + 1).toString().padStart(2, '0'));

  

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
  pickupDate: ['', Validators.required],
  pickupHour: ['', Validators.required],
  pickupMinute: ['', Validators.required],
  pickupAmPm: ['', Validators.required],
  returnDate: [''],
  customerName: ['', Validators.required],
  phoneNumber: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]]
  


      
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
  const formValue = this.bookingForm.value;
  
const returnDate = formValue.returnDate ? new Date(formValue.returnDate) : null;


let hour = parseInt(formValue.pickupHour, 10);
const minute = parseInt(formValue.pickupMinute, 10);
const amPm = formValue.pickupAmPm;

if (amPm === 'PM' && hour < 12) hour += 12;
if (amPm === 'AM' && hour === 12) hour = 0;

const pickupDate = new Date(formValue.pickupDate);
pickupDate.setHours(hour, minute, 0, 0);


  const dataToSend = {
    cabId: formValue.cabId,
    fromLocation: formValue.fromLocation,
    toLocation: formValue.toLocation,
      pickupDateTime: pickupDate.toISOString(),                         // ✅ Match your model
  returnDateTime: returnDate ? returnDate.toISOString() : null,     // ✅ Send null if empty
    customerName: formValue.customerName,
    phoneNumber: formValue.phoneNumber
    
  };
console.log("Navigating to booking list...");
this.router.navigate(['/booking-list']);
  if (this.bookingId) {
    // UPDATE
    this.http.put(`https://localhost:7113/api/Booking/id?id=${this.bookingId}`, dataToSend)
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
    this.http.post('https://localhost:7113/api/Booking', dataToSend)
      .subscribe({
        next: () => {
          alert('Booking created successfully!');
          this.router.navigate(['/booking-list']);
        },
        error: err => {
          console.error('Create error:', err);
          if (err.status === 400 && err.error?.errors) {
            console.log("Validation errors:", err.error.errors);
          }
          alert('Create failed');
        }
      });
  }
}

  formattedPickupTime: string | null = null;
onTimeChange(event: any) {
    if (this.bookingForm.invalid) return;

    const formValue = this.bookingForm.value;

    // Combine time fields into a single string if needed:
    const pickupTime = `${formValue.pickupHour}:${formValue.pickupMinute} ${formValue.pickupAmPm}`;

    const bookingData = {
      ...formValue,
      pickupTimeFormatted: pickupTime
    };

    console.log('Submitted Booking:', bookingData);

    // Navigate or submit to backend
    this.router.navigate(['/booking-list']);
    

    
}





  onCancel(): void {
    this.router.navigate(['/booking-list']);
  }
}
