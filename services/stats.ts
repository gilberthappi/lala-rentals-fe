import httpClient from "./httpClient";

export const getRenterCount = async (year: string): Promise<any[]> => {
	return (await httpClient.get(`/auth/user/renter-count-by-month/${year}`)).data
		.data;
};

export const getHostCount = async (year: string): Promise<any[]> => {
	return (await httpClient.get(`/auth/user/host-count-by-month/${year}`)).data
		.data;
};

export const getPropertiesCount = async (year: string): Promise<any[]> => {
	return (await httpClient.get(`/property/all/all/${year}`)).data
		.data;
};



export const getPropertyCount = async (year: string): Promise<any[]> => {
	return (await httpClient.get(`/property/properties/host/${year}`)).data
		.data;
};

export const getUnconfirmedBookings = async (year: string): Promise<any[]> => {
	return (await httpClient.get(`/booking/booking/unconfirmed/${year}`)).data
		.data;
};

export const getConfirmedBookings = async (year: string): Promise<any[]> => {
	return (await httpClient.get(`/booking/booking/host/${year}`)).data
		.data;
};
