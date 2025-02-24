"use client";
import { customStyles } from "@/components/ui/helper.css";
import type { IBookings } from "@/types";
import { HiOutlineCheck, HiOutlineXMark } from "react-icons/hi2";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { useMemo } from "react";
import DataTable from "react-data-table-component";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import { getAllHostBookings, updateBookingstatus } from "@/services/property";
import Typography from "@/components/typography/Typography";

const BookingsPages = () => {
	const client = useQueryClient();
	const { toast } = useToast();
	const { data, isLoading } = useQuery({
		queryKey: ["BOOKINGS"],
		queryFn: getAllHostBookings,
		gcTime: 0,
	});

	const updateBookingMutation = useMutation({
		mutationFn: ({ id, status }: { id: string; status: string }) => updateBookingstatus(id, status),
		onSuccess: () => {
			toast({
				title: "Booking status Updated!",
				variant: "primary",
			});
			client.invalidateQueries({
				queryKey: ["BOOKINGS"],
			});
		},
		onError: () => {
			toast({
				title: "Failed to update Booking status",
				variant: "destructive",
			});
		}
	});

	const handleUpdateBooking = React.useCallback((property: IBookings, status: string) => {
		updateBookingMutation.mutate({ id: property.id.toString(), status });
	}, [updateBookingMutation]);


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
				name: "FirstName",
				selector: (row: IBookings) => row.user.firstName,
				sortable: true,
			},
			{
				name: "LastName",
				selector: (row: IBookings) => row.user.lastName,
				sortable: true,
			},
			{
				name: "Email",
				selector: (row: IBookings) => row.user.email,
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
				cell: (row: IBookings) => (
					<span className={row.bookingStatus === "confirmed" ? "text-green-500" : row.bookingStatus === "cancelled" ? "text-red-500" : ""}>
						{row.bookingStatus ?? ''}
					</span>
				),
				sortable: true,
			},
			{
				name: "Action",
				cell: (row: IBookings) => (
					<>
						<HiOutlineCheck className="text-green-500 w-4 h-4 hover:text-green-700 mr-2" onClick={() => handleUpdateBooking(row, "confirmed")} />
						<HiOutlineXMark className="text-red-500 w-4 h-4 hover:text-red-700 mr-2" onClick={() => handleUpdateBooking(row, "cancelled")} />
					</>
				),
			},
		],
		[handleUpdateBooking],
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
