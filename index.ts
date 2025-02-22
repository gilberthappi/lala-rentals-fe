export interface IProperty {
	id: string;
	title: string;
	location: string;
	description: string;
	size: string;
	pricePerNight: number;
	createdAt: string;
	updatedAt: string;
	bedrooms: number;
	bathrooms: number;
	thumbnail: string;
	gallery: string[];
	petFriendly: boolean;
	bookings: IBookings[];
	user: IUser;
}

export interface IUser {
	id: number;
	firstName: string;
	lastName: string;
	email: string;
	roles: [
        {
          id: number,
          userId: number,
          role: string,
        }
      ]
}

export interface IBookings {
	id: string;
	userId?: number;
	propertyId: string;
	checkInDate: string;
	checkOutDate: string;
	totalPrice: string;
	createdAt: string;
	updatedAt: string;
	bookingStatus: string;
	user: IUser;
	property: IProperty;
}
