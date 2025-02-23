"use client";
import { customStyles } from "@/components/ui/helper.css";
import type { IBookings } from "@/types";
import { AiOutlineEye } from "react-icons/ai";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { useMemo } from "react";
import DataTable from "react-data-table-component";
import { getAllMyBookings } from "@/services/property";
import Typography from "@/components/typography/Typography";
import Link from "next/link";

const BookingsPages = () => {
	const { data, isLoading } = useQuery({
		queryKey: ["BOOKINGS"],
		queryFn: getAllMyBookings,
		gcTime: 0,
	});

	function formatDate(dateString: string): string {
		const date = new Date(dateString);
		const year = date.getFullYear();
		const month = String(date.getMonth() + 1).padStart(2, "0");
		const day = String(date.getDate()).padStart(2, "0");
		return `${year}-${month}-${day}`;
	}

	const columns = useMemo(
		() => [
			{
				name: "Title",
				selector: (row: IBookings) => row.property.title,
				sortable: true,
			},
			{
				name: "Location",
				selector: (row: IBookings) => row.property.location,
				sortable: true,
			},
			{
				name: "CheckIn",
				selector: (row: IBookings) => formatDate(row.checkInDate),
				sortable: true,
			},
			{
				name: "CheckOut",
				selector: (row: IBookings) => formatDate(row.checkOutDate),
				sortable: true,
			},
			{
				name: "Total",
				selector: (row: IBookings) => row.totalPrice,
				sortable: true,
			},
			{
				name: "Status",
				selector: (row: IBookings) => row.bookingStatus,
				sortable: true,
			},
			{
				name: "Action",
				cell: (row: IBookings) => (
					<>
						<Link href={`/history/details/${row.id}`}>
							<AiOutlineEye className="text-blue-900 w-4 h-4  hover:text-blue-900" />
						</Link>
						</>
				),
			},
		],
		[],
	);

	return (
		<div className="w-full space-y-4 p-4 bg-white rounded-lg shadow-md">
			<Typography>BOOKINGS</Typography>
			<div className="w-full shadow-sm">
				<DataTable
					progressPending={isLoading}
					columns={columns}
					data={data ?? []}
					striped
					highlightOnHover
					pagination
					responsive
					customStyles={customStyles}
				/>
			</div>
		</div>
	);
};

export default BookingsPages;
