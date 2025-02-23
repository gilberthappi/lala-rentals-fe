"use client";
import { LoginForm } from "@/components/Login/loginForm";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useSearchParams } from "next/navigation";
import React, { Suspense } from "react";

// eslint-disable-next-line no-unused-vars
const SearchParamsWrapper = ({ children }: { children: (searchParams: URLSearchParams) => React.ReactNode }) => {
  const searchParams = useSearchParams();
  return <>{searchParams ? children(searchParams) : null}</>;
};

const SignInPage = () => {
  const { status } = useSession();

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SearchParamsWrapper>
        {(searchParams: URLSearchParams) => {
          const callbackUrl = searchParams?.get("callbackUrl") || "/";
          if (status === "authenticated") {
            redirect(callbackUrl);
          }
          return (
            <div className="bg-blue-100 flex items-center justify-center h-screen">
              <div className="flex flex-col lg:flex-row w-full">
                <div className="h-screen lg:w-1/2 bg-primary p-8 text-white flex flex-col justify-center items-center">
                  <div className="text-center">
                    <h2 className="text-3xl font-semibold mb-4">
                      Welcome to Lala Home Rentals
                    </h2>
                    <p className="text-lg mb-8">
                      Rent or List your home with Lala Rentals
                    </p>
                  </div>
                </div>
                <LoginForm callbackUrl={callbackUrl} />
              </div>
            </div>
          );
        }}
      </SearchParamsWrapper>
    </Suspense>
  );
};

export default SignInPage;
