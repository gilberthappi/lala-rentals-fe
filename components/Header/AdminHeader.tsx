"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import React from "react";
import Typography from "../typography/Typography";

const AdminHeader = () => {
	const path = usePathname();
	const { data } = useSession();
	const handleLogout = () => {
		signOut();
	};
	return (
		<div className="bg-slate-200 p-3 w-full fixed top-0 sm:left-[20%] sm:w-[80%] left-0">
			<div className="flex justify-between items-center">
				<Typography variant="h5">{path}</Typography>
				<div>
					<DropdownMenu>
						<DropdownMenuTrigger>
							<Avatar>
								<AvatarImage src={data?.user?.image || "https://img.freepik.com/premium-vector/user-profile-icon-flat-style-member-avatar-vector-illustration-isolated-background-human-permission-sign-business-concept_157943-15752.jpg"} />
								<AvatarFallback>{data?.user?.name?.charAt(0).toUpperCase()}</AvatarFallback>
							</Avatar>
						</DropdownMenuTrigger>
						<DropdownMenuContent>
							<DropdownMenuLabel>{data?.user?.name}</DropdownMenuLabel>
							<DropdownMenuSeparator />
							<DropdownMenuItem>Profile</DropdownMenuItem>
							<DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</div>
		</div>
	);
};

export default AdminHeader;
