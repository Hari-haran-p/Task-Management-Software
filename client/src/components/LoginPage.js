  import React, { useState } from "react";
  import axios from 'axios';
  import { Navigate, useNavigate } from "react-router-dom";
  function LoginPage() {
    const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);  // To show any errors
  const [userDetails, setUserDetails] = useState(null); // To store user data after login
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();  // Prevent form from refreshing the page
    // console.log(password);

    try {
      const response = await axios.post("http://localhost:4000/api/login", {
        email,
        password,
      }); 
      // If login is successful, store user details in localStorage
      localStorage.setItem('userDetails', JSON.stringify(response.data));
      setUserDetails(response.data);
      setError(null); 
      // console.log("User logged in:", response.data);
      navigate("/mytask");

    } catch (error) {
      if (error.response) {
        // If login fails, display error message from server response
        setError(error.response.data.message || "Invalid credentials");
      } else {
        // Handle other types of errors (network, etc.)
        setError("An error occurred. Please try again later.");
      }
      setUserDetails(null);
      console.error("Error during login:", error);
    }
  };


    return (
      <section className="bg-gray-50 dark:bg-gray-900">
        <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
          <a href="#" className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
            <img className="w-8 h-8 mr-2" src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/logo.svg" alt="logo" />
            Taskly
          </a>
          <div className="w-full bg-white rounded-lg shadow dark:border sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                Sign in to your account
              </h1>
              <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
                <div>
                  <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your Email</label>
                  <input
                    type="text"
                    name="email"
                    id="email"
                    className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white text-sm"
                    placeholder="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}  // Update username state
                    required
                  />
                </div>
                <div>
                  <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                  <input
                    type="password"
                    name="password"
                    id="password"
                    placeholder="••••••••"
                    className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white text-sm"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}  // Update password state
                    required
                  />
                </div>
                {error && <p className="text-red-500 text-sm">{error}</p>}
                <button type="submit" className="w-full text-white bg-blue-600 hover:bg-blue-700 font-medium rounded-lg text-sm px-5 py-2.5 text-center">
                  Sign in
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    );
  }

  export default LoginPage;
