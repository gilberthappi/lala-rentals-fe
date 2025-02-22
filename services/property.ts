import type { IBookings, IProperty } from "@/types/index";
import httpClient from "./httpClient";

export const createProperty = async (data: FormData): Promise<IProperty> => {
	return (await httpClient.post("/property", data, {
		headers: {
			"Content-Type": "multipart/form-data",
		},
	})).data.data;
};

export const getAllProperties = async (): Promise<IProperty[]> => {
	const response = await httpClient.get("/property");
	return response.data.data;
};

export const getAllMyProperties = async (): Promise<IProperty[]> => {
	const response = await httpClient.get("/property/my");
	return response.data.data;
};

export const getAllMyBookings = async (): Promise<IBookings[]> => {
	const response = await httpClient.get("/booking/my");
	return response.data.data;
};

export const getProperty = async (id: string): Promise<IProperty> => {
	const response = await httpClient.get(`/property/${id}`);
	return response.data.data;
};

export const getBooking = async (id: string): Promise<IBookings> => {
	const response = await httpClient.get(`/booking/${id}`);
	return response.data.data;
};

export const updateProperty = async (
	id: string,
	data: FormData,
): Promise<IProperty> => {
	return (await httpClient.put(`/property/${id}`, data, {
		headers: {
			"Content-Type": "multipart/form-data",
		},
	})).data.data;
};

export const deleteProperty = async (id: string): Promise<void> => {
	await httpClient.delete(`/property/${id}`);
};


export const updateBookingstatus = async (
	id: string,
	bookingStatus: string,
): Promise<any> => {
	const response = await httpClient.put(
		`/booking/${id}`,
		{ bookingStatus },
	);
	return response.data;
};