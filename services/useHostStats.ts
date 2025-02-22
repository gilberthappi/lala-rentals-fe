import {
	getPropertyCount,
	getUnconfirmedBookings,
	getConfirmedBookings,
} from "@/services/stats";
import { useEffect, useState } from "react";

export const useHostStats = (year: string) => {
	const [propertyCount, setPropertyCount] = useState<number[]>(
		[],
	);
	const [unconfirmedBookings, setUnconfirmedBookings] =
		useState<number[]>([]);
	const [confirmedBookings, setConfirmedBookings] = useState<
		number[]
	>([]);

	useEffect(() => {
		const fetchStats = async () => {
			try {
				const fetchedUnconfirmedBookings = await getUnconfirmedBookings(year);
				const fetchedPropertiesCount =
					await getPropertyCount(year);
				const fetchedConfirmedBookings =
					await getConfirmedBookings(year);

					setUnconfirmedBookings(fetchedUnconfirmedBookings);
					setPropertyCount(
						fetchedPropertiesCount,
				);
				setConfirmedBookings(fetchedConfirmedBookings);
			} catch (error) {
				console.error("Error fetching  stats", error);
			}
		};

		fetchStats();
	}, [year]);

	return {
		propertyCount,
		unconfirmedBookings,
		confirmedBookings,
	};
};
