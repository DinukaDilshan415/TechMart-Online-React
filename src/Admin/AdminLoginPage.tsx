import { useState} from 'react';
import type {FC, SVGProps, FormEvent, ChangeEvent, SyntheticEvent} from 'react'
import { toast } from 'react-toastify';

// Type for SVG Icon props
const MailIcon: FC<SVGProps<SVGSVGElement>> = (props) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        {...props}
    >
        <rect width="20" height="16" x="2" y="4" rx="2" />
        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
);

const LockIcon: FC<SVGProps<SVGSVGElement>> = (props) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        {...props}
    >
        <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
);


const AdminLoginPage: FC = () => {
    // State for form inputs with explicit types
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [rememberMe, setRememberMe] = useState<boolean>(false);

    // Handle form submission with event type
    const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
        event.preventDefault();
        // In a real application, you would handle authentication here.
        console.log('Login attempt with:', { email, password, rememberMe });
    };

    // Handle image loading error with event type
    const handleImageError = (e: SyntheticEvent<HTMLImageElement, Event>): void => {
        const target = e.target as HTMLImageElement;
        target.onerror = null; // prevents looping
        target.src = 'https://placehold.co/200x50/0096ed/ffffff?text=TechMartOnline';
    }

    const adminSignIn = async () => {
        const signIn = {
            email,
            password
        };

        try {
            const response = await fetch("http://localhost:8080/techmart/AdminSignIn", {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(signIn)
            });

            if (response.ok) {
                const json = await response.json();
                if (json.status) {
                    console.log(json);
                    window.location.href = "/admin/verification";

                } else {
                    console.log(json.message);
                    toast.error(json.message);
                }
            } else {
                console.log("LogIn failed. Please try again");
                toast.error("LogIn failed. Please try again");
            }
        } catch (error) {
            toast.error("Something wrong ! Please try again");
            console.error("SignIn Error:", error);
        }
    };

    // Login functionality

    return (
        <div className="min-h-screen w-full bg-gray-100 text-gray-800 flex justify-center items-center font-sans">
            <div className="w-full max-w-5xl m-4 sm:m-8 bg-white shadow-2xl rounded-3xl flex flex-col md:flex-row">

                {/* Left Side: Image */}
                <div className="hidden md:flex w-1/2 bg-cover bg-center rounded-l-3xl"
                    style={{ backgroundImage: "url('https://png.pngtree.com/png-clipart/20230813/original/pngtree-login-page-on-laptop-screen-picture-image_7907597.png')" }}>
                    <div className="w-full h-full bg-edumartHover/10 rounded-l-3xl"></div>
                </div>

                {/* Right Side: Login Form */}
                <div className="w-full md:w-1/2 p-8 sm:p-12 flex flex-col justify-center">
                    <div className="mx-auto w-full max-w-md">
                        <div className="flex justify-center mb-8">
                            <img
                                src="https://raw.githubusercontent.com/DinukaDilshan415/images/7a5f610434dedce8344f98788f3eaffcaf11b708/tmsvg.svg"
                                alt="Company Logo"
                                className="w-48"
                                onError={handleImageError}
                            />
                        </div>
                        <h1 className="text-3xl font-extrabold text-center text-gray-900 mb-2">Admin Sign In</h1>
                        <p className="text-center text-gray-500 mb-8">Welcome back! Please sign in to your account.</p>

                        <form onSubmit={handleSubmit}>
                            <div className="space-y-6">
                                {/* Email Input */}
                                <div className="relative">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2">
                                        <MailIcon className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="email"
                                        placeholder="Email Address"
                                        value={email}
                                        onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                                        required
                                        className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-300 focus:border-[#0096ed] focus:ring-2 focus:ring-[#0096ed]/50 transition duration-200 ease-in-out"
                                    />
                                </div>

                                {/* Password Input */}
                                <div className="relative">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2">
                                        <LockIcon className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="password"
                                        placeholder="Password"
                                        value={password}
                                        onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                                        required
                                        className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-300 focus:border-[#0096ed] focus:ring-2 focus:ring-[#0096ed]/50 transition duration-200 ease-in-out"
                                    />
                                </div>

                                {/* Remember Me & Forgot Password */}
                                <div className="flex items-center justify-between text-sm">
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            id="rememberMe"
                                            checked={rememberMe}
                                            onChange={(e: ChangeEvent<HTMLInputElement>) => setRememberMe(e.target.checked)}
                                            className="h-4 w-4 rounded border-gray-300 text-[#0096ed] focus:ring-[#0096ed]"
                                        />
                                        <label htmlFor="rememberMe" className="text-gray-600">Remember me</label>
                                    </div>
                                    <a href="#" className="font-medium text-[#0096ed] hover:text-[#007cc4] transition-colors">
                                        Forgot password?
                                    </a>
                                </div>

                                {/* Submit Button */}
                                <button onClick={adminSignIn}
                                    type="submit"
                                    style={{ backgroundColor: '#0096ed' }}
                                    className="cursor-pointer w-full py-3 rounded-lg text-white font-bold text-lg tracking-wider uppercase transform hover:scale-105 transition-transform duration-300 focus:outline-none focus:ring-4 focus:ring-[#0096ed]/50"
                                >
                                    Sign In
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

            </div>
        </div>
    );
}

export default AdminLoginPage;
