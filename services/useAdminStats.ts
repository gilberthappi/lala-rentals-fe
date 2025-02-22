import {
	getPropertiesCount,
	getRenterCount,
	getHostCount,
} from "@/services/stats";
import { useEffect, useState } from "react";

export const useAdminStats = (year: string) => {
	const [rentersCounts, setrentersCounts] = useState<number[]>([]);
	const [hostCounts, setHostCounts] = useState<number[]>([]);
	const [propertiesCounts, setPropertiesCounts] = useState<number[]>([]);

	useEffect(() => {
		const fetchStats = async () => {
			try {
				const fetchedRentersCounts = await getRenterCount(year);
				const fetchedHostCounts = await getHostCount(year);
				const fetchedPropertiesCounts = await getPropertiesCount(year);

				setrentersCounts(fetchedRentersCounts);
				setHostCounts(fetchedHostCounts);
				setPropertiesCounts(fetchedPropertiesCounts);
			} catch (error) {
				console.error("Error fetching admin stats", error);
			}
		};

		fetchStats();
	}, [year]);
	return {
		rentersCounts,
		hostCounts,
		propertiesCounts,
	};
};
