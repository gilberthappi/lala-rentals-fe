"use client";
import { Button } from "@/components/ui/button";
import { customStyles } from "@/components/ui/helper.css";
import { getAllUsers, updateUserRole } from "@/services/user";
import type { IUser } from "@/types";
import { PencilIcon } from "@heroicons/react/24/outline";
import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { useMemo } from "react";
import DataTable from "react-data-table-component";
import ConfirmationModal from "@/components/ui/ConfirmDialog2";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import Typography from "@/components/typography/Typography";

const UserPages = () => {
	const [searchQuery, setSearchQuery] = useState<string>("");
	const client = useQueryClient();
	const { toast } = useToast();
	const { data, isLoading } = useQuery({
		queryKey: ["USER"],
		queryFn: getAllUsers,
		gcTime: 0,
	});
	const [selectedUser, setSelectedUser] = useState<IUser | null>(null);
	const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);

	const handleUpdateRole = (user: IUser) => {
		setSelectedUser(user);
		setShowConfirmModal(true);
	};

	const updateUserRoleMutation = useMutation({
		mutationFn: (userId: string) => updateUserRole(userId),
		onSuccess: () => {
			toast({
				title: "User Role Updated!",
				variant: "primary",
			});
			client.invalidateQueries({
				queryKey: ["USER"],
			});
		},
		onError: () => {
			toast({
				title: "Failed to update User Role",
				variant: "destructive",
			});
		}
	});

	const confirmUpdateRole = () => {
		if (selectedUser) {
			updateUserRoleMutation.mutate(selectedUser.id.toString());
			setShowConfirmModal(false);
		}
	};

	const closeModal = () => {
		setShowConfirmModal(false);
		setSelectedUser(null);
	};

	const filteredUsers = data?.filter((user: IUser) => {
		const searchString = searchQuery.toLowerCase();

		// Convert all relevant fields to strings and check if the searchQuery is included
		return (
			`${user.firstName}`.toLowerCase().includes(searchString) ||
			user.lastName.toLowerCase().includes(searchString) ||
			user.email.toLowerCase().includes(searchString) 
		);
	});

	const columns = useMemo(
		() => [
			{
				name: "First Name",
				selector: (row: IUser) => row.firstName ,
				sortable: true,
			},
			{
				name: "Last Name",
				selector: (row: IUser) => row.lastName,
				sortable: true,
			},
			{ name: "Email", selector: (row: IUser) => row.email, sortable: true },
			{
				name: "Role",
				selector: (row: IUser) => row.roles[0].role,
				sortable: true,
			},

			{
				name: "Action",
				cell: (row: IUser) => (
					<>
						<Button onClick={() => handleUpdateRole(row)}><PencilIcon className="text-red-500 w-4 h-4 hover:text-red-700 mr-2" />update role</Button>
					</>
				),
			},
		],
		[],
	);

	return (
		<div className="w-full space-y-4 p-4 bg-white rounded-lg shadow-md">
       <Typography>USERS</Typography>
			<div className="w-full shadow-sm">
				{/* Search Input */}
				<div className="mt-4">
					<input
						type="text"
						placeholder="Search user..."
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						className="border border-gray-300 rounded-md p-2 w-full"
					/>
				</div>
				<DataTable
					progressPending={isLoading}
					columns={columns}
					data={filteredUsers ?? []}
					striped
					highlightOnHover
					pagination
					responsive
					customStyles={customStyles}
				/>
			</div>
			<ConfirmationModal
				show={showConfirmModal}
				onClose={closeModal}
				onConfirm={confirmUpdateRole}
				message={
					<>
						Are you sure you want to update the role of <strong>{selectedUser?.firstName} {selectedUser?.lastName}</strong>?
					</>
				}
				title="Confirm Role Update"
			/>
		</div>
	);
};

export default UserPages;
