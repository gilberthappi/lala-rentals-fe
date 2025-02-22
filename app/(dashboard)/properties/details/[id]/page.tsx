"use client";
import PageContent from "@/components/shared/PageContent";
import Loader from "@/components/ui/Loader";
import { Button } from "@/components/ui/button";
import { getProperty } from "@/services/property";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import Link from "next/link";
import { useParams } from "next/navigation";
import type React from "react";

const PropertyDetailsPage: React.FC = () => {
	const { id } = useParams() as { id: string };
		const { data: property, isLoading } = useQuery({
			queryKey: ["PROPERTY", id],
			queryFn: () => getProperty(id as string),
		});


	if (isLoading) return <Loader />;

	const formatDate = (dateString: string) => {
		const date = new Date(dateString);
		return format(date, "dd MMMM yyyy");
	};

	return (
		<PageContent>
			<Link href="/properties">
				<Button variant="ghost">
					<ArrowLeftIcon className="w-5 h-5 text-gray-700" />
				</Button>
			</Link>
			<div className="max-w-4xl mx-auto mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
				<div className="text-black">
					<section className="mb-8">
						<h2 className="text-xl font-medium mb-3">Description</h2>
						<p className="text-gray-700 text-sm">
							{property?.description.replace(/<\/?[^>]+(>|$)/g, "")}
						</p>
					</section>
					<div className="mb-4 h-30">
						<p className="text-sm font-medium">
							<strong>Date Posted:</strong> {property?.createdAt ? formatDate(property.createdAt) : "N/A"}
						</p>
					</div>
				</div>
				<div className="bg-blue-900 text-white rounded-lg p-8 flex-1">
					<div className="mb-4 h-10">
						<h2 className="text-xl font-medium">{property?.title}</h2>
					</div>
					<div className="mb-4 h-30">
						<p className="text-sm font-medium">
							<strong>Location:</strong> {property?.location}
						</p>
					</div>
					<div className="mb-4 h-30">
						<p className="text-sm font-medium">
							<strong>Bedroom</strong> {property?.bedrooms}
						</p>
					</div>
					<div className="mb-4 h-30">
						<p className="text-sm font-medium">
							<strong>Bathrooms</strong> {property?.bathrooms}
						</p>
					</div>
					<div className="mb-4 h-30">
						<p className="text-sm font-medium">
							<strong>Size</strong> {property?.size}
						</p>
					</div>
					<div className="mb-4 h-30">
						<p className="text-sm font-medium">
							<strong>Price per Night</strong> {property?.pricePerNight}
						</p>
					</div>
					<div className="mb-4 h-30">
						<p className="text-sm font-medium">
							<strong>petFriendly</strong> {property?.petFriendly ? "Yes" : "No"}
						</p>
					</div>


				</div>
			</div>
		</PageContent>
	);
};

export default PropertyDetailsPage;
