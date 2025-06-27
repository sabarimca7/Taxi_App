export interface Booking {
  id: number;
  cabId: number;
  fromLocation: string;
  toLocation: string;
  pickupDateTime: string;
  returnDateTime?: string;
  customerName: string;
  phoneNumber: string;
}
