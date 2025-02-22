"use client";
import CreatePropertyForm from "@/components/property/CreatePropertyForm";
import Loader from "@/components/ui/Loader";
import { getProperty } from "@/services/property";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";

const EditPropertyPage = () => {
	const params = useParams();
	const id = params!.id as string;
	const { data, isLoading } = useQuery({
		queryKey: ["PROPERTY", id],
		queryFn: () => getProperty(id),
	});

	return (
		<div>
			{isLoading ? (
				<Loader />
			) : (
				<CreatePropertyForm isLoading={isLoading} isUpdate defaults={data} />
			)}
		</div>
	);
};

export default EditPropertyPage;
