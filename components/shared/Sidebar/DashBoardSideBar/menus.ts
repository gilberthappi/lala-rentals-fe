import type { IRole } from "@/constants/roles";
import {
	
	BuildingStorefrontIcon,
	Cog8ToothIcon,
	HomeIcon,
	RectangleStackIcon,
	Squares2X2Icon,
	UsersIcon,
} from "@heroicons/react/24/outline";
import { HiDesktopComputer } from "react-icons/hi";
import { RiLogoutCircleLine } from "react-icons/ri";
import { HiOutlineCalendarDays } from "react-icons/hi2";

type MenuItemWithIcon = {
	name: string;
	href: string;
	icon: any;
	isCollapsible: boolean;
	roles?: IRole[];
};

export interface ExpandableMenu
	extends Omit<MenuItemWithIcon, "isCollapsible"> {
	items: MenuItemNoIcon[];
}

export interface SubMenus extends Omit<MenuItemWithIcon, "isCollapsible"> {
	parent: string;
}

type MenuItemNoIcon = Omit<
	Pick<
		MenuItemWithIcon,
		Exclude<keyof MenuItemWithIcon, "icon" | "isCollapsible">
	>,
	"isCollapsible"
>;

export const mainMenu: MenuItemWithIcon[] = [
	{
		name: "Welcome",
		href: "/welcome",
		icon: HiDesktopComputer,
		isCollapsible: false,
	},
	{
		name: "Home",
		href: "/home",
		icon: HomeIcon,
		isCollapsible: false,
	},
	{
		name: "Dashboard",
		href: "/dashboard",
		icon: Squares2X2Icon,
		isCollapsible: false,
		roles: ["ADMIN"],
	},
	{
		name: "Dashboard",
		href: "/host",
		icon: Squares2X2Icon,
		isCollapsible: false,
		roles: ["HOST"],
	},
	{
		name: "Users",
		href: "/users",
		icon: UsersIcon,
		isCollapsible: false,
		roles: ["ADMIN"],
	},
	{
		name: "Properties",
		href: "/properties",
		icon: BuildingStorefrontIcon,
		isCollapsible: false,
		roles: ["HOST"],
	},
	{
		name: "Bookings",
		href: "/bookings",
		icon: HiOutlineCalendarDays,
		isCollapsible: false,
		roles: ["HOST"],
	},
	{
		name: "Bookings",
		href: "/history",
		icon: HiOutlineCalendarDays,
		isCollapsible: false,
		roles: ["RENTER"],
	},
];

export const secondaryMenu: MenuItemNoIcon[] = [];

export const bottomMenu: MenuItemWithIcon[] = [
	{
		name: "settings",
		href: "/settings",
		icon: Cog8ToothIcon,
		isCollapsible: false,
	},
	{
		name: "logout",
		href: "/logout",
		icon: RiLogoutCircleLine,
		isCollapsible: false,
	},
];

export const subMenus: SubMenus[] = [
	{
		name: "expandable1",
		href: "#",
		icon: RectangleStackIcon,
		parent: "expandable",
	},
	{
		name: "expandable2",
		href: "#",
		icon: RectangleStackIcon,
		parent: "expandable2",
	},
];
