"use client";
import {
	Menu,
	MenuItem,
	MenuItems,
	Transition,
	TransitionChild,
} from "@headlessui/react";
import classNames from "classnames";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { Fragment } from "react";
import TopMenus from "../MenusLinks/TopMenus";
import { bottomMenu } from "../menus";

const MobileSidebar = ({
	sidebarOpen,
}: {
	sidebarOpen: boolean;
}) => {
	const currentRoute = usePathname();
	const { data } = useSession();
	const handleLogout = () => {
		signOut({ callbackUrl: "/" });
	};

	return (
		<Transition show={sidebarOpen} as={React.Fragment}>
			<TransitionChild
				as={React.Fragment}
				leaveTo="opacity-0"
				enterTo="opacity-100"
				enterFrom="opacity-0"
				leaveFrom="opacity-100"
				enter="transition-opacity duration-300"
				leave="transition-opacity duration-300"
			>
				<div className="fixed inset-y-0 left-0 z-50 w-64 bg-primary">
					<div className="flex flex-col flex-grow overflow-y-auto">
						<div className="flex flex-col py-6 rounded-lg bg-primary">
							<nav className="flex flex-col flex-1 px-4 pb-4 gap-7">
								<div>
									<div className="mb-8 text-white text-md">
										<Menu as="div" className="relative ml-3 md:block">
											{/* <div>
												<MenuButton className="flex left-0 max-w-xs text-sm">
													<Avatar className="mr-2 text-blue-900">
														<AvatarImage src={data?.user?.image || "https://img.freepik.com/premium-vector/user-profile-icon-flat-style-member-avatar-vector-illustration-isolated-background-human-permission-sign-business-concept_157943-15752.jpg"} />
														<AvatarFallback>{data?.user?.name?.charAt(0).toUpperCase()}</AvatarFallback>
													</Avatar>
												</MenuButton>
											</div> */}
											<Transition
												as={Fragment}
												enter="transition ease-out duration-100"
												enterFrom="transform opacity-0 scale-95"
												enterTo="transform opacity-100 scale-100"
												leave="transition ease-in duration-75"
												leaveFrom="transform opacity-100 scale-100"
												leaveTo="transform opacity-0 scale-95"
											>
												<MenuItems className="absolute right-0 z-10 w-48 py-1 mt-2 origin-top-right bg-white rounded-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
													<MenuItem>
														<div className="px-4 py-2 text-sm text-gray-700">
														{data?.user?.name}
														</div>
													</MenuItem>
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
												</MenuItems>
											</Transition>
										</Menu>
									</div>
									<TopMenus />
								</div>

								<hr className="h-px mt-20 bg-white border-0" />
								<div className="mt-auto">
									{bottomMenu.map((menu) => (
										<Link
											key={menu.name}
											href={menu.href}
											className={classNames(
												currentRoute?.includes(menu.href)
													? "bg-primary-foreground text-primary"
													: "text-white",
												"group rounded-md py-2 px-2 flex items-center text-sm ",
											)}
										>
											<menu.icon
												className={classNames(
													currentRoute?.includes(menu.href)
														? "text-primary"
														: "",
													"mr-3 flex-shrink-0 h-6 w-6",
												)}
												aria-hidden="true"
											/>
											{menu.name}
										</Link>
									))}
								</div>
							</nav>
						</div>
					</div>
				</div>
			</TransitionChild>
		</Transition>
	);
};

export default MobileSidebar;
