import { z } from "zod";

export const CreatePropertySchema = z.object({
	title: z.string({ required_error: "Title required" }).min(3),
	location: z.string({ required_error: "Location required" }).min(2),
	description: z.string({ required_error: "Description required" }).min(1),
	size:z.string().optional(),
	pricePerNight: z.string({ required_error: "Price required" }),
	bedrooms: z.string({ required_error: "Bedrooms required" }),
	bathrooms: z.string({ required_error: "Bathrooms required" }),
	petFriendly: z.boolean(),
	thumbnail:  z
	.any()
	.optional()
	.refine((files) => {
		if (!files) return true;
		if (files.length === 0) return true;
		return files[0].size <= 15 * 1024 * 1024; // 15MB limit
	}, "File size must be less than 15MB"),
	gallery: z.array(
		z.any().refine((file) => file.size <= 15 * 1024 * 1024, "File size must be less than 15MB")
	).optional(),
});

export const UpdatePropertySchema = z.object({
	title: z.string({ required_error: "Title required" }).min(3),
	location: z.string({ required_error: "Location required" }).min(2),
	description: z.string({ required_error: "Description required" }).min(1),
	size:z.string().optional(),
	pricePerNight: z.number({ required_error: "Price required" }),
	bedrooms: z.number({ required_error: "Bedrooms required" }),
	bathrooms: z.number({ required_error: "Bathrooms required" }),
	petFriendly: z.boolean(),
	thumbnail:  z
	.any()
	.optional()
	.refine((files) => {
		if (!files) return true;
		if (files.length === 0) return true;
		return files[0].size <= 15 * 1024 * 1024; // 15MB limit
	}, "File size must be less than 15MB"),
	gallery: z.array(
		z.any().refine((file) => file.size <= 15 * 1024 * 1024, "File size must be less than 15MB")
	).optional(),
});
