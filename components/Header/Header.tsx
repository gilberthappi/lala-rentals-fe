"use client";

import Link from "next/link";
import React, { useState, Fragment } from "react";
import Typography from "../typography/Typography";
import { Button } from "../ui/button";
import { useSession, signOut } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Menu, Transition } from "@headlessui/react";

// Smooth scroll function with offset to account for the header height
const scrollToSection = (id: string) => {
  const section = document.getElementById(id);
  const headerOffset = 80;
  const elementPosition = section?.getBoundingClientRect().top ?? 0;
  const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

  window.scrollTo({
    top: offsetPosition,
    behavior: "smooth",
  });
};

const Header = () => {
  const [isMenuOpen, setMenuOpen] = useState(false);
  const { data } = useSession();

  return (
    <header className="px-4 py-2 bg-slate-200 flex justify-between items-center fixed top-0 left-0 right-0 shadow-md z-50">
      <div className="flex items-center">
        {/* Hamburger Icon */}
        <div className="sm:hidden pr-2">
          <button
            type="button"
            onClick={() => setMenuOpen(!isMenuOpen)}
            className="text-gray-700 focus:outline-none"
          >
            {/* Icon for hamburger menu */}
            <svg
              className="w-8 h-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>

        {/* Logo */}
        <Link href="/">
          <Typography variant="h4" className="text-blue-900 font-bold sm:pl-5">
            <span className="text-yellow-600">Lala</span> Rentals
          </Typography>
        </Link>
      </div>

      {/* Navigation and Book Now */}
      <div className="flex items-center">
        {/* Navigation Links */}
        <nav className="hidden sm:flex items-center gap-6">
          {["home", "property", "contact"].map((section) => (
            <button
              key={section}
              type="button"
              onClick={() => scrollToSection(section)}
              className="cursor-pointer"
            >
              <Typography
                variant="h6"
                className="text-blue-900 hover:text-yellow-600"
              >
                {section.charAt(0).toUpperCase() + section.slice(1)}
              </Typography>
            </button>
          ))}
        </nav>

        {/* Book Now Button */}
        <div className="ml-2 sm:ml-4 lg:ml-5">
          {data?.user ? (
            <Menu as="div" className="relative">
              <Menu.Button className="flex items-center max-w-xs text-sm">
                <Avatar className="mr-2 border-blue-200">
                  <AvatarImage src={data.user.image || "/default-avatar.png"} />
                  <AvatarFallback>{data.user.name?.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
              </Menu.Button>
              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="absolute right-0 w-64 py-1 mt-2 origin-top-right bg-white rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-20">
                  <Menu.Item>
                    <div className="px-4 py-2 text-sm text-gray-700 w-full">
                      {data.user.name}
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
                      onClick={() => signOut({ callbackUrl: "/" })}
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
          ) : (
            <Link href="/auth/signin">
              <Button className="text-white text-center bg-yellow-600">
                Login
              </Button>
            </Link>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="sm:hidden absolute top-16 left-1/2 transform -translate-x-1/2 w-80 bg-white shadow-md z-50 rounded-lg">
          {/* Close Button */}
          <div className="flex justify-end p-2">
            <button
              type="button"
              onClick={() => setMenuOpen(false)}
              className="text-gray-700 focus:outline-none"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <nav className="flex flex-col items-start py-2">
            {["home", "property", "contact"].map((section) => (
              <button
                key={section}
                type="button"
                onClick={() => {
                  scrollToSection(section);
                  setMenuOpen(false);
                }}
                className="cursor-pointer py-2 px-4 w-full text-left hover:bg-gray-100"
              >
                <Typography
                  variant="h6"
                  className="text-gray-700 hover:text-blue-600"
                >
                  {section.charAt(0).toUpperCase() + section.slice(1)}
                </Typography>
              </button>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
