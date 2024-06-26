"use client";
import { useEffect, useState } from "react";
import useLocalStorage from "@/app/hooks/useLocalStorage";
import Image from "next/image";
import { useAppDispatch, useAppSelector } from "@/app/store/hooks";
import { loginStart } from "@/app/store/slices/auth/authSlices";
import Snackbar from "@/app/components/Snackbar";

export default function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const { isLoading, user, error } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const local = useLocalStorage("user");
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await dispatch(loginStart(formData));
  };

  useEffect(() => {
    if (user) {
      local.setStoredValue({
        ...user?.user,
      });
      window.location.href = "/";
    }
  }, [user]);

  function formChangeHandler(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md animate-fadeIn">
        <div className="text-center flex justify-center mix-blend-multiply">
          <Image
            src={"/logo.png"}
            alt="Logo"
            width={70}
            height={70}
            draggable="false"
          />
        </div>
        <h2 className="text-2xl font-bold text-center text-gray-900">Login</h2>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div className="animate-fadeIn">
              <label htmlFor="email-address" className="sr-only">
                Email address
              </label>
              <input
                id="email-address"
                name="email"
                onChange={formChangeHandler}
                type="email"
                autoComplete="email"
                required
                className="relative block w-full px-3 py-2 border border-gray-300 rounded-t-md appearance-none focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                placeholder="Email address"
              />
            </div>
            <div className="animate-fadeIn delay-200">
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                onChange={formChangeHandler}
                type="password"
                autoComplete="current-password"
                required
                className="relative block w-full px-3 py-2 border border-gray-300 rounded-b-md appearance-none focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                placeholder="Password"
              />
            </div>
          </div>

          <div className="flex items-center justify-between animate-fadeIn delay-300">
            {/* <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
              />
              <label
                htmlFor="remember-me"
                className="block ml-2 text-sm text-gray-900"
              >
                Remember me
              </label>
            </div> */}

            <div className="text-sm">
              <a
                href="/auth/signup"
                className="font-medium text-indigo-600 hover:text-indigo-500"
              >
                Not signed in?
              </a>
            </div>
          </div>

          <div className="animate-fadeIn delay-400">
            <button
              type="submit"
              className={`group relative flex w-full justify-center rounded-md border border-transparent ${
                isLoading ? "bg-gray-400" : "bg-indigo-600"
              } py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}
              disabled={isLoading}
            >
              {isLoading ? (
                <svg
                  className="w-5 h-5 text-white animate-spin"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              ) : (
                "Sign in"
              )}
            </button>
          </div>
        </form>
        {error ? <Snackbar message={error} isError={true} /> : null}
      </div>
    </div>
  );
}
