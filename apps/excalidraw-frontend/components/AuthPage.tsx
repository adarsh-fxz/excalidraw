"use client"

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export function AuthPage({ isSignIn }: {
    isSignIn: boolean
}) {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const endpoint = isSignIn 
                ? "http://localhost:3001/api/auth/signin" 
                : "http://localhost:3001/api/auth/signup";
            const response = await fetch(endpoint, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email,
                    password,
                    ...(isSignIn ? {} : { name }),
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Something went wrong");
            }

            if (isSignIn) {
                // Store the token in localStorage
                localStorage.setItem("token", data.token);
                // Redirect to home page after successful sign in
                router.push("/");
            } else {
                // After successful signup, redirect to signin
                router.push("/signin");
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-screen flex justify-center items-center bg-gradient-to-br from-blue-50 to-indigo-100">
            <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-2xl shadow-xl">
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-gray-900">
                        {isSignIn ? "Welcome Back" : "Create Account"}
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        {isSignIn 
                            ? "Sign in to your account to continue" 
                            : "Join us to start drawing and collaborating"}
                    </p>
                </div>

                {error && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-sm text-red-600">{error}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                    {!isSignIn && (
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                Full Name
                            </label>
                            <input
                                id="name"
                                type="text"
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                                placeholder="John Doe"
                            />
                        </div>
                    )}

                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                            Email Address
                        </label>
                        <input
                            id="email"
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                            placeholder="you@example.com"
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                            placeholder="••••••••"
                        />
                    </div>

                    {isSignIn && (
                        <div className="flex items-center justify-end">
                            <Link 
                                href="/forgot-password" 
                                className="text-sm font-medium text-blue-600 hover:text-blue-500"
                            >
                                Forgot your password?
                            </Link>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <span className="flex items-center">
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Processing...
                            </span>
                        ) : (
                            isSignIn ? "Sign In" : "Create Account"
                        )}
                    </button>
                </form>

                <div className="text-center">
                    <p className="text-sm text-gray-600">
                        {isSignIn ? "Don't have an account? " : "Already have an account? "}
                        <Link 
                            href={isSignIn ? "/signup" : "/signin"} 
                            className="font-medium text-blue-600 hover:text-blue-500"
                        >
                            {isSignIn ? "Sign up" : "Sign in"}
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}