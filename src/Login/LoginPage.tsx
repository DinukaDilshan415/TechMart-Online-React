import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

const LoginPage = () => {

  useEffect(() => {
    const container = document.getElementById('container');
    const switchToRegister = document.getElementById('switch-to-register');
    const switchToLogin = document.getElementById('switch-to-login');

    if (!container || !switchToRegister || !switchToLogin) return;

    const handleSwitchToRegister = () => {
      container.style.transform = 'translateX(-100%)';
    };

    const handleSwitchToLogin = () => {
      container.style.transform = 'translateX(0)';
    };

    switchToRegister.addEventListener('click', handleSwitchToRegister);
    switchToLogin.addEventListener('click', handleSwitchToLogin);

    return () => {
      // Clean up
      switchToRegister.removeEventListener('click', handleSwitchToRegister);
      switchToLogin.removeEventListener('click', handleSwitchToLogin);
    };
  }, []);

  // Registration functionality
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [comfpassword, setComfPassword] = useState("");

  const signUp = async () => {
    const user = {
      username,
      email,
      mobile,
      password,
      comfpassword
    };

    try {
      const response = await fetch("http://localhost:8080/techmart/signup", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(user)
      });
      if (response.ok) {
        const json = await response.json();

        if (json.status) {
          // redirect to verify page
          window.location.href = "/Auth/VrifyAccount";

          console.log(json);

          console.log("Signup successful, redirecting to verify page...");
        } else {
          console.log(json.message);
          toast.error(json.message);
        }
      } else {
        console.log("Registration failed. Please try again");
        toast.error("Registration failed. Please try again");
      }
    } catch (error) {
      toast.error("Error connecting to server");
      console.error("Signup Error:", error);
    }
  };
  // Registration functionality

  // Login functionality
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const signIn = async () => {
    const signIn = {
      loginEmail,
      loginPassword
    };

    try {
      const response = await fetch("http://localhost:8080/Edumart-Backend/SignIn", {
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

          if (json.message == "not verified") {
            window.location.href = "/Auth/VrifyAccount";
          } else {
            window.location.href = "/";
          }
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
    <>
      <div className="w-full flex items-center justify-center mt-36 mb-16">
        <div className="w-10/12 flex items-center justify-center">

          <div className="relative w-full max-w-4xl h-[600px] overflow-hidden shadow-2xs rounded-2xl">
            <div id="container" className="absolute inset-0 flex transition-transform duration-500 ease-in-out">

              {/* <!-- Login Section --> */}
              <div id="login-section" className="w-full flex">
                <div className="md:w-1/2 bg-blue-600 text-white hidden md:flex items-center justify-center">
                  <div className="text-center">
                    <h2 className="text-3xl font-bold mb-4">Welcome Back!</h2>
                    <p>Please login to continue</p>
                  </div>
                </div>
                <div className="w-full md:w-1/2 bg-white p-12 flex items-center justify-center">
                  <div className="w-full max-w-md">

                    <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
                    <div className="mb-4">
                      <label htmlFor="login-email" className="block mb-2 text-sm">Email</label>
                      <input type="email" name="login-email" id="login-email"
                        className="w-full px-3 py-2 border rounded-md" placeholder="Enter your email" value={loginEmail} onChange={e => setLoginEmail(e.target.value)} />
                    </div>
                    <div className="mb-4">
                      <label htmlFor="login-password" className="block mb-2 text-sm">Password</label>
                      <input type="password" name="password" id="login-password"
                        className="w-full px-3 py-2 border rounded-md" placeholder="Enter your password" value={loginPassword} onChange={e => setLoginPassword(e.target.value)} />
                    </div>
                    <div className="flex items-center justify-between mb-4">
                      <label className="flex items-center">
                        <input type="checkbox" className="mr-2" />
                        <span className="text-sm">Remember Me</span>
                      </label>
                      <a href="#" className="text-sm text-blue-600 hover:underline">Forgot Password?</a>
                    </div>
                    <button type="submit" onClick={signIn}
                      className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition cursor-pointer">Login</button>
                    <div className="mt-4 text-center">
                      <p className="text-sm">Don't have an account?
                        <button type="button" id="switch-to-register"
                          className="text-blue-600 hover:underline cursor-pointer">Sign
                          Up</button>
                      </p>
                    </div>

                    <div className="mt-4 w-full items-center justify-center">
                      <div className="w-full ">
                        <button type="button"
                          className=" w-full cursor-pointer shadow-lg text-black bg-[#ffffff] hover:bg-[#efefef]  border border-black font-semibold rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center justify-center mr-2 mb-2">
                          <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" className="mr-2 -ml-1" width="24"
                            height="24" viewBox="0 0 48 48">
                            <path fill="#fbc02d"
                              d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12	s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20	s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z">
                            </path>
                            <path fill="#e53935"
                              d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039	l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z">
                            </path>
                            <path fill="#4caf50"
                              d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36	c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z">
                            </path>
                            <path fill="#1565c0"
                              d="M43.611,20.083L43.595,20L42,20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571	c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z">
                            </path>
                          </svg>
                          Sign in with Google
                        </button>
                      </div>
                      <div className="w-full">
                        <button type="button"
                          className="w-full cursor-pointer shadow-lg text-blue-600 bg-[#ffffff] hover:bg-[#d5e2ff] border border-blue-600 font-semibold rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center justify-center mr-2 mb-2">
                          <svg xmlns="http://www.w3.org/2000/svg" className="mr-2 -ml-1" x="0px" y="0px" width="24" height="24" viewBox="0 0 48 48">
                            <linearGradient id="Ld6sqrtcxMyckEl6xeDdMa_uLWV5A9vXIPu_gr1" x1="9.993" x2="40.615" y1="9.993" y2="40.615" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#2aa4f4"></stop><stop offset="1" stop-color="#007ad9"></stop></linearGradient><path fill="url(#Ld6sqrtcxMyckEl6xeDdMa_uLWV5A9vXIPu_gr1)" d="M24,4C12.954,4,4,12.954,4,24s8.954,20,20,20s20-8.954,20-20S35.046,4,24,4z"></path><path fill="#fff" d="M26.707,29.301h5.176l0.813-5.258h-5.989v-2.874c0-2.184,0.714-4.121,2.757-4.121h3.283V12.46 c-0.577-0.078-1.797-0.248-4.102-0.248c-4.814,0-7.636,2.542-7.636,8.334v3.498H16.06v5.258h4.948v14.452 C21.988,43.9,22.981,44,24,44c0.921,0,1.82-0.084,2.707-0.204V29.301z"></path>
                          </svg>
                          Sign in with Facebook
                        </button>
                      </div>

                    </div>
                  </div>
                </div>
              </div>

              {/* <!-- Registration Section --> */}
              <div id="register-section" className="w-full flex absolute top-0 left-full h-full">
                <div className="w-1/2 bg-white p-12 flex items-center justify-center">

                  <div className="w-full max-w-md">

                    <h2 className="text-2xl font-bold mb-6 text-center">Create Account</h2>
                    <div className="mb-4">
                      <label htmlFor="username" className="block mb-2 text-sm">Username</label>
                      <input type="text" id="username" className="w-full px-3 py-2 border rounded-md"
                        placeholder="Choose a username" value={username} onChange={e => setUsername(e.target.value)} />
                    </div>
                    <div className="mb-4">
                      <label htmlFor="email" className="block mb-2 text-sm">Email</label>
                      <input type="email" id="email" className="w-full px-3 py-2 border rounded-md"
                        placeholder="Enter your email" value={email} onChange={e => setEmail(e.target.value)} />
                    </div>
                    <div className="mb-4">
                      <label htmlFor="mobile" className="block mb-2 text-sm">Mobile Number</label>
                      <input type="text" id="mobile" className="w-full px-3 py-2 border rounded-md"
                        placeholder="Enter your mobile number" value={mobile} onChange={e => setMobile(e.target.value)} />
                    </div>
                    <div className="mb-4">
                      <label htmlFor="password" className="block mb-2 text-sm">Password</label>
                      <input type="password" id="password"
                        className="w-full px-3 py-2 border rounded-md" placeholder="Create a password" value={password} onChange={e => setPassword(e.target.value)} />
                    </div>
                    <div className="mb-4">
                      <label htmlFor="confirm-password" className="block mb-2 text-sm">Confirm
                        Password</label>
                      <input type="password" id="confirm-password"
                        className="w-full px-3 py-2 border rounded-md" placeholder="Confirm your password" value={comfpassword} onChange={e => setComfPassword(e.target.value)} />
                    </div>
                    <button type="button" onClick={signUp}
                      className="w-full cursor-pointer bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition">Sign Up
                    </button>
                    <div className="mt-4 text-center">
                      <p className="text-sm">Already have an account?
                        <button type="button" id="switch-to-login"
                          className="text-blue-600 hover:underline cursor-pointer">Login</button>
                      </p>
                    </div>

                  </div>

                </div>
                <div className="w-1/2 bg-blue-600 text-white flex items-center justify-center">
                  <div className="text-center">
                    <h2 className="text-3xl font-bold mb-4">Hello, Friend!</h2>
                    <p>Enter your details and start your journey</p>
                  </div>
                </div>
              </div>

              {/* <!-- Registration Section --> */}

            </div>
          </div>

        </div>
      </div>
    </>
  )
}

export default LoginPage