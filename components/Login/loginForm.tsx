import TextBox from "@/components/ui/TextBox";
import { Form } from "@/components/ui/form";
import { loginSchema, resetPasswordSchema } from "@/constants/login";
import type { TLoginSchema, TResetPasswordSchema } from "@/services/auth";
import { forgot_password, reset_password } from "@/services/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import Image from "next/image";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { FaEye, FaEyeSlash } from "react-icons/fa6";
import Alert from "../ui/Alert";
import { Button } from "../ui/button";
import { GoogleSignInButton } from "../ui/authButtons";

export const LoginForm = () => {
  const [formType, setFormType] = useState<
    "login" | "register" | "forgot" | "reset"
  >("login");
  const [error, setError] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [showPasswordLogin, setShowPasswordLogin] = useState(false);
  const [showPasswordReset, setShowPasswordReset] = useState(false); 
  const loginForm = useForm<TLoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const resetForm = useForm<TResetPasswordSchema>({
    resolver: zodResolver(resetPasswordSchema), 
    defaultValues: {
      otp: "",
      email: "",
      newPassword: "",
    },
  });

  const handleSignIn = async (formData: TLoginSchema) => {
    setLoading(true);
    setError(undefined);
    const response = await signIn("credentials", {
      ...formData,
      callbackUrl: "/auth/signin",
      redirect: false,
    });
    if (response?.error) {
      setError(response.error);
    }
    setLoading(false);
  };

  const handleForgotPassword = async ({ email }: { email: string }) => {
    setLoading(true);
    setError(undefined);
    try {
      await forgot_password({ email });
      setFormType("reset");
    } catch (err) {
      setError("Failed to request password reset.");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (data: TResetPasswordSchema) => {
    setLoading(true);
    setError(undefined);
    try {
      await reset_password(data);
      setFormType("login"); 
    } catch (err) {
      setError("Failed to reset password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen lg:w-1/2 bg-white p-8 flex flex-col justify-center items-center">
      <Image
        src="/ngirologo1.png"
        alt="Logo"
        className="h-20 mb-8"
        width={200}
        height={100}
      />
      <h2 className="text-3xl font-semibold mb-4">
        {formType === "login"
          ? "Login"
          : formType === "forgot"
          ? "Forgot Password"
          : formType === "register"
          ? "Create Account"
          : "Reset Password"}
      </h2>

      {formType === "login" && (
        <Form {...loginForm}>
          <form
            onSubmit={loginForm.handleSubmit(handleSignIn)}
            className="space-y-2 w-full"
          >
            {error && <Alert>{error}</Alert>}
            <TextBox
              label="Email"
              type="text"
              name="email"
              placeholder="Email"
              control={loginForm.control}
            />
            <div className="relative">
              <TextBox
                label="Password"
                type={showPasswordLogin ? "text" : "password"}
                name="password"
                placeholder="Password"
                control={loginForm.control}
              />
              <button
                type="button"
                onClick={() => setShowPasswordLogin(!showPasswordLogin)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 mt-10"
              >
                {showPasswordLogin ? <FaEye /> : <FaEyeSlash />}
              </button>
            </div>
            <div className="flex justify-between mt-4">
              <Button
                disabled={
                  !!(
                    loginForm.formState.errors.email ||
                    loginForm.formState.errors.password
                  ) || loading
                }
                type="submit"
              >
                {!loading ? "Login" : "Loading ..."}
              </Button>
              <button
                type="button"
                className="text-sm text-blue-600 hover:underline"
                onClick={() => setFormType("forgot")}
              >
                Forgot Password?
              </button>
            </div>
          </form>
        </Form>
      )}

      {formType === "register" && (
        <Form {...loginForm}>
          <form
            onSubmit={loginForm.handleSubmit(handleSignIn)}
            className="space-y-2 w-full"
          >
            {error && <Alert>{error}</Alert>}
            <TextBox
              label="Email"
              type="text"
              name="email"
              placeholder="Email"
              control={loginForm.control}
            />
            <div className="relative">
              <TextBox
                label="Password"
                type={showPasswordLogin ? "text" : "password"}
                name="password"
                placeholder="Password"
                control={loginForm.control}
              />
              <button
                type="button"
                onClick={() => setShowPasswordLogin(!showPasswordLogin)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 mt-10"
              >
                {showPasswordLogin ? <FaEye /> : <FaEyeSlash />}
              </button>
            </div>
            <div className="flex justify-between mt-4">
              {/* <button
                type="button"
                className="text-sm text-blue-600 hover:underline"
                onClick={() => setFormType("forgot")}
              >
                Forgot Password?
              </button> */}
              <Button
                disabled={
                  !!(
                    loginForm.formState.errors.email ||
                    loginForm.formState.errors.password
                  ) || loading
                }
                type="submit"
              >
                {!loading ? "Register" : "Creating account ..."}
              </Button>
            </div>
            <div className="flex flex-col lg:flex-row w-full justify-between items-center mt-5">
          <div className="w-full lg:w-1/2 lg:pr-2 mb-2 lg:mb-0">
            <GoogleSignInButton />
          </div>
          <div className="w-full lg:w-1/2 lg:pl-2">
            <button
              className="w-full flex items-center font-semibold justify-center h-14 px-6 text-xl transition-colors duration-300 bg-white border-2 border-black text-black rounded-lg focus:shadow-outline hover:bg-slate-200"
              onClick={() => setFormType("login")}
            >
              Login with Email
            </button>
          </div>
        </div>
          </form>
        </Form>
      )}

      {formType === "forgot" && (
        <Form {...loginForm}>
          <form
            onSubmit={loginForm.handleSubmit(({ email }) =>
              handleForgotPassword({ email })
            )}
            className="space-y-2 w-full"
          >
            {error && <Alert>{error}</Alert>}
            <TextBox
              label="Email"
              type="text"
              name="email"
              placeholder="Enter your email"
              control={loginForm.control}
            />
            <div className="flex justify-between mt-4">
              <Button
                disabled={!!loginForm.formState.errors.email || loading}
                type="submit"
              >
                {!loading ? "Request Reset" : "Loading ..."}
              </Button>
              <div className="mt-4 text-end">
                <button
                  type="button"
                  className="text-sm text-blue-600 hover:underline"
                  onClick={() => setFormType("login")}
                >
                  Back to Login
                </button>
              </div>
            </div>
          </form>
        </Form>
      )}

      {formType === "reset" && (
        <Form {...resetForm}>
          <form
            onSubmit={resetForm.handleSubmit(handleResetPassword)}
            className="space-y-2 w-full"
          >
            {error && <Alert>{error}</Alert>}
            <TextBox
              label="OTP"
              type="text"
              name="otp"
              placeholder="Enter OTP"
              control={resetForm.control}
            />
            <TextBox
              label="Email"
              type="text"
              name="email"
              placeholder="Enter your email"
              control={resetForm.control}
            />
            <div className="relative">
              <TextBox
                label="New Password"
                type={showPasswordReset ? "text" : "password"}
                name="newPassword"
                placeholder="Enter new password"
                control={resetForm.control}
              />
              <button
                type="button"
                onClick={() => setShowPasswordReset(!showPasswordReset)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 mt-10"
              >
                {showPasswordReset ? <FaEye /> : <FaEyeSlash />}
              </button>
            </div>
            <div className="flex justify-between mt-4">
              <Button
                disabled={
                  !!(
                    resetForm.formState.errors.otp ||
                    resetForm.formState.errors.email ||
                    resetForm.formState.errors.newPassword
                  ) || loading
                }
                type="submit"
              >
                {!loading ? "Reset Password" : "Loading ..."}
              </Button>
              <div className="mt-4 text-end">
                <button
                  type="button"
                  className="text-sm text-blue-600 hover:underline"
                  onClick={() => setFormType("login")}
                >
                  Back to Login
                </button>
              </div>
            </div>
          </form>
        </Form>
      )}
      {formType !== "forgot" && formType !== "reset"  && formType !== "register" && (
        <div className="flex flex-col lg:flex-row w-full justify-between items-center mt-5">
          <div className="w-full lg:w-1/2 lg:pr-2 mb-2 lg:mb-0">
            <GoogleSignInButton />
          </div>
          <div className="w-full lg:w-1/2 lg:pl-2">
            <button
              className="w-full flex items-center font-semibold justify-center h-14 px-6 text-xl transition-colors duration-300 bg-white border-2 border-black text-black rounded-lg focus:shadow-outline hover:bg-slate-200"
              onClick={() => setFormType("register")}
            >
              Create Account
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
