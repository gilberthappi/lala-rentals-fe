"use client";
import PageContent from "@/components/shared/PageContent";
import Section from "@/components/shared/Section";
import TextBox from "@/components/ui/TextBox";
import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/components/ui/use-toast";
import { CreatePropertySchema } from "@/constants/property.schema";
import { createProperty, updateProperty } from "@/services/property";
import { zodResolver } from "@hookform/resolvers/zod";
import { QueryClient, useMutation } from "@tanstack/react-query";
import dynamic from "next/dynamic";
import React, { useState } from "react";
import { Controller, type SubmitHandler, useForm } from "react-hook-form";
import type z from "zod";
import "react-quill/dist/quill.snow.css";
import type { IProperty } from "@/types/index";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { Checkbox } from "@/components/ui/checkbox";
import { useRouter } from "next/navigation";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });


type PropertyFormProps = {
	isLoading: boolean;
	isUpdate?: boolean;
	defaults?: Partial<IProperty>;
};

export default function CreatePropertyForm({
	isLoading,
	isUpdate,
	defaults,
}: PropertyFormProps) {
	const { toast } = useToast();
	const queryClient = new QueryClient();
	const [formLoading, setFormLoading] = useState(false);
	const router = useRouter();

	const form = useForm<z.infer<typeof CreatePropertySchema>>({
		resolver: zodResolver(CreatePropertySchema),
		defaultValues: {
			title: defaults?.title || "",
			location: defaults?.location || "",
			description: defaults?.description || "",
			pricePerNight: defaults?.pricePerNight || 0,
			bedrooms: defaults?.bedrooms || 0,
			bathrooms: defaults?.bathrooms || 0,
			petFriendly: defaults?.petFriendly || false,
			thumbnail: defaults?.thumbnail || "",
			gallery: defaults?.gallery || [],
			size: defaults?.size || "",
		},
	});


	const mutation = useMutation({
		mutationFn: (data: FormData) =>
			isUpdate && defaults?.id
				? updateProperty(defaults.id, data)
				: createProperty(data),
		onSuccess: () => {
			toast({
				title: `Property ${isUpdate ? "updated" : "created"}`,
				variant: "primary",
			});
			queryClient.invalidateQueries({ queryKey: ["PROPERTY"] });
			setFormLoading(false);
			router.push("/properties");
		},
		onError: () => {
			toast({
				title: `Failed to ${isUpdate ? "update" : "create"} Property`,
				variant: "destructive",
			});
			setFormLoading(false);
		},
	});

	const onSubmit: SubmitHandler<z.infer<typeof CreatePropertySchema>> = async (
		data,
	) => {
		setFormLoading(true);
		const formData = new FormData();
		formData.append("title", data.title);
		formData.append("location", data.location);
		formData.append("description", data.description);
		formData.append("bedrooms", data.bedrooms.toString());
		formData.append("bathrooms", data.bathrooms.toString());
		formData.append("pricePerNight", data.pricePerNight.toString());
		formData.append("petFriendly", data.petFriendly.toString());
		formData.append("size", data.size || "");

		if (data.thumbnail?.[0]) {
			formData.append("thumbnail", data.thumbnail[0]);
		}

		if (data.gallery?.[0]){
			(data.gallery || []).forEach((file) => formData.append("gallery", file as File));
		}


		mutation.mutate(formData);
	};

	return (
		<PageContent>
			<div className="space-y-6">
				<div className="flex items-center justify-between mb-6">
					<h1 className="text-2xl font-semibold">
						{isUpdate ? "Update Property" : "Create Property"}
					</h1>
					<Link href="/properties">
						<Button variant="ghost">
							<ArrowLeftIcon className="w-5 h-5 text-gray-700" />
						</Button>
					</Link>
				</div>

				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
						<Section title="Property Info">
							<div className="grid md:grid-cols-2 gap-6">
								<TextBox
									control={form.control}
									name="title"
									type="text"
									placeholder="Title"
									label="Title"
								/>
								<TextBox
									control={form.control}
									name="location"
									type="text"
									placeholder="Location"
									label="Location"
								/>
								<TextBox
									control={form.control}
									name="bedrooms"
									type="number"
									placeholder="3"
									label="Bedrooms"
								/>
								<TextBox
									control={form.control}
									name="bathrooms"
									type="number"
									placeholder="3"
									label="Bathrooms"
									/>
								<TextBox
									control={form.control}
									name="size"
									type="text"
									placeholder="300cm, 400cm"
									label="Size"
								/>
								<TextBox
									control={form.control}
									name="pricePerNight"
									type="number"
									placeholder="1000$"
									label="Price per Night"
								/>
								<FormField
									control={form.control}
									name="thumbnail"
									render={({ field }) => (
										<div>
											<FormLabel className="text-gray-500 text-xs">
												Upload Thumbnail
											</FormLabel>
											<FormControl>
												<input
													type="file"
													onChange={(e) => field.onChange(e.target.files)}
													className="w-full rounded-md border bg-background px-3 py-3 text-sm"
												/>
											</FormControl>
											<FormMessage />
										</div>
									)}
									/>
								<FormField
									control={form.control}
									name="gallery"
									render={({ field }) => (
										<div>
											<FormLabel className="text-gray-500 text-xs">
												Upload Gallery
											</FormLabel>
											<FormControl>
												<input
													type="file"
													multiple
													onChange={(e) => field.onChange(e.target.files ? Array.from(e.target.files) : [])}
													className="w-full rounded-md border bg-background px-3 py-3 text-sm"
												/>
											</FormControl>
											<FormMessage />
										</div>
									)}
								/>

								<div className="flex items-center space-x-2">
									<Controller
										name="petFriendly"
										control={form.control}
										render={({ field }) => (
											<Checkbox
												checked={field.value}
												onCheckedChange={field.onChange}
												id="petFriendly"
											/>
										)}
									/>
									<label htmlFor="petFriendly" className="text-sm font-medium">
										Pet Friendly
									</label>
								</div>
							</div>
						</Section>

						<Section title="Description">
							<FormField
								control={form.control}
								name="description"
								render={() => (
									<div>
										<FormControl>
											<Controller
												name="description"
												control={form.control}
												render={({ field }) => (
													<div className="border rounded-lg overflow-hidden">
														<ReactQuill {...field} className="h-48" />
													</div>
												)}
											/>
										</FormControl>
										<FormMessage />
									</div>
								)}
							/>
						</Section>

						<div className="text-right">
							<Button type="submit" disabled={isLoading || formLoading}>
								{isLoading || formLoading
									? isUpdate
										? "Updating..."
										: "Creating..."
									: isUpdate
										? "Update"
										: "Create"}
							</Button>
						</div>
					</form>
				</Form>
			</div>
		</PageContent>
	);
}
