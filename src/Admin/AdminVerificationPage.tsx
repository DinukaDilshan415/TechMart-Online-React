import React, { useEffect, useState, useRef } from 'react';
import { toast } from 'react-toastify';

/**
 * Props for the VerificationIcon component.
 */
interface VerificationIconProps {
  className?: string;
  stroke: string;
}

/**
 * A reusable SVG icon component for the verification envelope.
 * @param {VerificationIconProps} props - Component props.
 * @returns {JSX.Element} The rendered SVG icon.
 */
const VerificationIcon: React.FC<VerificationIconProps> = ({ className, stroke }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke={stroke}
    strokeWidth={1}
    aria-hidden="true"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M10 12h4"
      strokeWidth={2}
    />
  </svg>
);

/**
 * AdminVerificationPage Component
 * A component that renders a verification page for administrators.
 * It prompts the user to enter a code sent to their email.
 *
 * @returns {JSX.Element} The rendered admin verification page.
 */
const AdminVerificationPage: React.FC = () => {
  // State for the verification code input
  const [code, setCode] = useState<string>('');

  // User-defined assets and theme colors
  const companyLogoUrl: string = 'https://raw.githubusercontent.com/DinukaDilshan415/images/7a5f610434dedce8344f98788f3eaffcaf11b708/tmsvg.svg';
  const primaryColor: string = '#0096ed';
  const secondaryColor: string = '#b2d235'; // Available for use if needed

  // Handler for form submission
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();

    console.log('Verifying code:', code);
  };

  const reSendEmail = async () => {

    toast.promise(
      fetch("http://localhost:8080/techmart/ReSendAdminVerification", {
        method: "GET",
        credentials: "include", // <- this sends cookies like JSESSIONID
      }).then(async (response) => {
        if (!response.ok) {
          throw new Error("Verification Code Send failed. Please try again");
        }

        const json = await response.json();

        if (!json.status) {
          throw new Error(json.message || "Verification failed");
        }

        // Success — return something to access in toast if needed
        return json;
      }),

      {
        pending: 'Sending verification email...',
        success: 'New verification code sent successfully ✅',
        error: {
          render({ data }: { data: Error }) {
            // data is the error object thrown in catch or in .then
            return data.message || 'Something went wrong ❌';
          }
        }
      }
    );
  };

const hasRun = useRef(false);

useEffect(() => {
  
  if (!hasRun.current) {
    reSendEmail();
    hasRun.current = true;
  }
}, []);

  const verifyAccount = async () => {
    const verify = {
      code
    };

    try {
      const response = await fetch("http://localhost:8080/techmart/VerifyAdminAccount", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(verify)
      });

      if (response.ok) {
        const json = await response.json();

        if (json.status) {
          window.location.href = "/admin/dashboard";

          console.log("Verification successful, redirecting to admin dashboard...");
        } else {
          console.log(json.message);
          toast.error(json.message);
        }
      } else {
        console.log("Verification failed. Please try again");
        toast.error("Verification failed. Please try again");
      }
    } catch (error) {
      toast.error("Something Wrong ! Please try again");
      console.error("Verification Error:", error);
    }
  };

  return (
    // Main container with a light gray background, centering content vertically and horizontally
    <div className="bg-slate-50 font-sans text-gray-800 min-h-screen flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md">
        {/* Company Logo */}
        <header className="flex justify-center mb-8">
          <img
            src={companyLogoUrl}
            alt="Company Logo"
            className="h-10"
            onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
              const target = e.target as HTMLImageElement;
              target.onerror = null; // prevents looping
              target.src = 'https://placehold.co/150x40/cccccc/000000?text=Logo';
            }}
          />
        </header>

        <main>
          {/* Main verification card */}
          <div className="bg-white p-6 sm:p-8 rounded-xl shadow-md">
            {/* Icon */}
            <div className="flex justify-center mb-4">
              <VerificationIcon className="h-16 w-16" stroke={primaryColor} />
            </div>

            {/* Heading and Subheading */}
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Verify your Identity</h1>
              <p className="text-gray-600">
                Enter the code sent to your email to verify your identity.
              </p>
            </div>

            {/* Verification Form */}
            <form onSubmit={handleSubmit}>
              {/* Input Field for Verification Code */}
              <div className="mb-4">
                <label htmlFor="verificationCode" className="block text-sm font-medium text-gray-500 mb-2">
                  Verification code
                </label>
                <input
                  id="verificationCode"
                  name="verificationCode"
                  type="text"
                  required
                  className="w-full text-center tracking-[0.5em] font-semibold text-lg px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0096ed] transition-shadow duration-200"
                  placeholder="______"
                  maxLength={6}
                  autoComplete="one-time-code"
                  value={code}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCode(e.target.value)}
                />
              </div>

              {/* Resend Code Link */}
              <div className="text-center mb-6">
                <button
                  type="button"
                  onClick={reSendEmail}
                  className="cursor-pointer text-sm font-medium text-[#0096ed] hover:underline focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-[#0096ed] rounded-md"
                >
                  Resend code
                </button>
              </div>

              {/* Submit Button */}
              <button onClick={verifyAccount}
                type="submit"
                style={{ backgroundColor: primaryColor }}
                className="cursor-pointer w-full text-white font-bold py-3 px-4 rounded-lg hover:opacity-90 active:scale-[0.98] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0096ed]"
              >
                Continue logging in
              </button>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminVerificationPage;
