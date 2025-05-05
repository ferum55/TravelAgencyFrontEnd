export interface HotelShortDto {
  hotelId: number;
  hotelName: string;
  hotelAddress: string;
  hotelCity: string;
}

export interface TransportBookingDto {
  departureCountry: number;
  departureCity: number;
  departurePoint: number;
  departurePointName: string;
  arrivalCountry: number;
  arrivalCity: number;
  arrivalPoint: number;
  arrivalPointName: string;
  transportType: string;
  departureDate: string;
  arrivalDate: string;
  price: number;
}

export interface TourCardDto {
  tourId: number;
  startDate: string;
  endDate: string;
  country: string;
  city: string;
  baseTourId: number;  
  baseTourPrice: number;         
  activityName: string;
  totalCost: number;
  hotel: HotelShortDto;
  hotelBookingId: number
  hotelRoomNumber: string;
  hotelBookingPrice: number;
  checkInDate: string;
  duration: number;
  employeeId: number;
  transportBookings: TransportBookingDto[];
}

