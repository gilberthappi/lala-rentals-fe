import { Menu, Transition } from "@headlessui/react";
import { signOut, useSession } from "next-auth/react";
import React, { Fragment} from "react";
import { MenuIcon } from "../../CustomIcons";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";

const DashboardNavBar = ({
	sidebarOpen,
	setSidebarOpen,
}: {
	sidebarOpen: boolean;
	// eslint-disable-next-line no-unused-vars
	setSidebarOpen: (_x: boolean) => void;
}) => {
	const { data } = useSession();

	const handleLogout = () => {
		signOut({ callbackUrl: "/" });
	};


	return (
		<div className="z-10 flex flex-shrink-0 h-16 bg-white border-b">
			<button
				title="sidebar"
				type="button"
				className="px-4 text-gray-500 border-r outline-none border-gray-200 focus:outline-none lg:hidden"
				onClick={() => setSidebarOpen(!sidebarOpen)}
			>
				<MenuIcon />
			</button>
			<div className="flex justify-end flex-1 px-4 md:px-8">
				<div className="flex items-center ml-4 md:ml-6">
					<Menu as="div" className="relative">
						<div>
							<Menu.Button className="">
								<Avatar className="mr-2 left-0">
									<AvatarImage src={data?.user?.image || "https://img.freepik.com/premium-vector/user-profile-icon-flat-style-member-avatar-vector-illustration-isolated-background-human-permission-sign-business-concept_157943-15752.jpg"} />
									<AvatarFallback>{data?.user?.name?.charAt(0).toUpperCase()}</AvatarFallback>
								</Avatar>
							</Menu.Button>
						</div>
						<Transition
							as={Fragment}
							enter="transition ease-out duration-100"
							enterFrom="transform opacity-0 scale-95"
							enterTo="transform opacity-100 scale-100"
							leave="transition ease-in duration-75"
							leaveFrom="transform opacity-100 scale-100"
							leaveTo="transform opacity-0 scale-95"
						>
							<Menu.Items className="absolute right-0 w-48 py-1 mt-2 origin-top-right bg-white rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-20">
								<Menu.Item>
									<div className="px-4 py-2 text-sm text-gray-700">
									{data?.user?.name}
									</div>
								</Menu.Item>
								<Menu.Item>
								{({ active }) => (
									<Link href="/welcome" className={`${
										active ? "bg-gray-100" : ""
									} block py-2 px-4 text-sm text-gray-700 w-full text-left`}>
										Dashboard
									</Link>
									)}
								</Menu.Item>
								<Menu.Item>
									{({ active }) => (
										<button
											type="button"
											onClick={handleLogout}
											className={`${
												active ? "bg-gray-100" : ""
											} block py-2 px-4 text-sm text-gray-700 w-full text-left`}
										>
											Logout
										</button>
									)}
								</Menu.Item>
							</Menu.Items>
						</Transition>
					</Menu>
				</div>
			</div>
		</div>
	);
};

export default DashboardNavBar;
