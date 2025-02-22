"use client";

import Image from "next/image";
import googleLogo from "@/public/google.png";
import { signIn } from "next-auth/react";
import { useState } from "react";

export function GoogleSignInButton() {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    await signIn("google");
    setLoading(false);
  };

  return (
    <button
      onClick={handleClick}
      className="w-full flex items-center font-semibold justify-center h-14 px-6 mt-4 lg:mt-0 text-xl transition-colors duration-300 bg-white border-2 border-black text-black rounded-lg focus:shadow-outline hover:bg-slate-200"
      disabled={loading}
    >
      {loading ? (
        <span>Loading...</span>
      ) : (
        <>
          <Image src={googleLogo} alt="Google Logo" width={20} height={20} />
          <span className="ml-1">Continue with Google</span>
        </>
      )}
    </button>
  );
}
