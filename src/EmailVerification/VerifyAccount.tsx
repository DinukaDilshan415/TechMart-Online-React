import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { TECHMART_BASE_URL, DEFAULT_HEADERS } from '../api/client';


const VerifyAccount = () => {

  const [verificationCode, setVerificationCode] = useState("");

  const verifyAccount = async () => {
    const verify = {
      verificationCode
    };

    try {
      const response = await fetch(`${TECHMART_BASE_URL}/VerifyAccount`, {
        method: "POST",
        credentials: "include",
        headers: {
          ...DEFAULT_HEADERS,
        },
        body: JSON.stringify(verify)
      });

      if (response.ok) {
        const json = await response.json();

        if (json.status) {

          window.location.href = "/";

          console.log(json);
          console.log("Verification successful, redirecting to home page...");
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

  const reSendEmail = async () => {
    // Use toast.promise to handle loading, success, and error alerts
    toast.promise(
      fetch(`${TECHMART_BASE_URL}/ReSendVerification`, {
        method: "GET",
        credentials: "include",
        headers: {
          ...DEFAULT_HEADERS,
        }
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

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-sm p-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">
          Check your email
        </h2>

        <p className="text-gray-600 mb-6">
          Validate Your Account by entering the six-digit code
        </p>

        <div className="space-y-6">
          <div>
            <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-2">
              Code
            </label>
            <input
              type="text"
              id="verificationCode"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              placeholder="Enter code"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              maxLength={6}
            />
          </div>

          <button onClick={verifyAccount} className="w-full bg-blue-600 text-white py-2 px-4 rounded-md font-medium hover:bg-blue-700 transition-colors cursor-pointer">
            Continue
          </button>
        </div>

        <div className="mt-6 text-center">
          <span className="text-sm text-gray-600">Didn't get the code? </span>
          <button onClick={reSendEmail} className="text-sm text-blue-600 hover:text-blue-800 font-medium underline focus:outline-none cursor-pointer">
            Resend
          </button>
        </div>
      </div>
    </div>
  );
}

export default VerifyAccount