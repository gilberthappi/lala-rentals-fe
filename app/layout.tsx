import type { Metadata } from "next";
import "./globals.css";
import Provider from "@/utils/Providers/Provider";
import type React from "react";

export const metadata: Metadata = {
	title: "LALA HOMES",
	description: "Welcome to LALA HOMES - Your dream home awaits. Explore our listings and find the perfect place to call home.",
	icons: {
		icon: "/favicon.ico",
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body>
				<Provider>{children}</Provider>
			</body>
		</html>
	);
}
