import React, { useState, useEffect } from 'react';
import { GoogleLogin, googleLogout, useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { FaArrowRight } from 'react-icons/fa';

function App() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = useGoogleLogin({
    onSuccess: (codeResponse) => {
      setUser(codeResponse);
      setLoading(true);
      setError(null);
    },
    onError: (error) => {
      console.log("Login Failed:", error);
      setError("Login failed. Please try again.");
    },
  });

  useEffect(() => {
    if (user) {
      axios
        .get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${user.access_token}`)
        .then((res) => {
          setProfile(res.data);
          return axios.post('https://devto-f2687ab8b235.herokuapp.com/api/google', {
            email: res.data.email,
            given_name: res.data.given_name,
            family_name: res.data.family_name,
            id: res.data.id
          });
        })
        .then(response => {
          console.log('User data saved successfully:', response.data);
        })
        .catch((err) => {
          console.error('Error:', err);
          setError("An error occurred. Please try again.");
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [user]);

  const logOut = () => {
    googleLogout();
    setProfile(null);
    setUser(null);
  };

  return (
    <div className="bg-[#191919] min-h-screen flex flex-col items-center justify-center text-white font-['Inter']">
      <header className="w-full flex justify-between items-center px-8 py-4">
        <h1 className="text-2xl font-bold">DEVO<span className="text-yellow-500">SPACE</span></h1>
        <div>
          {profile ? (
            <button onClick={logOut} className="bg-yellow-500 font-bold text-black px-4 py-2 rounded hover:bg-yellow-600 transition duration-300">Logout</button>
          ) : (
            <button onClick={() => login()} className="bg-yellow-500 font-bold text-black px-4 py-2 rounded hover:bg-yellow-600 transition duration-300">Login</button>
          )}
        </div>
      </header>
      <main className="flex-grow flex items-center px-8 py-12 w-full max-w-7xl">
        <div className="w-1/2 pr-8">
          <button className="bg-yellow-500 text-black px-4 py-2 rounded-full text-sm font-semibold mb-8 flex items-center hover:bg-yellow-600 transition duration-300">
            Explore our Features <FaArrowRight className="ml-2" />
          </button>
          <h1 className="text-5xl font-bold mb-4">
            Innovate <span className="text-yellow-500">DevOps</span><br />
            Without Limits
          </h1>
          <p className="text-gray-400 mb-8">
            Streamlines your DevOps processes, enabling seamless
            automation, integration, and continuous delivery for
            Salesforce.
          </p>
          {loading ? (
            <div className="text-yellow-500">Loading...</div>
          ) : profile ? (
            <div className="text-white">
              <h2 className="text-2xl font-bold mb-4">Welcome, {profile.name}!</h2>
              <p>Email: {profile.email}</p>
              <button onClick={logOut} className="bg-yellow-500 text-black px-6 py-3 rounded-full text-lg font-semibold flex items-center mt-4 hover:bg-yellow-600 transition duration-300">
                Logout <FaArrowRight className="ml-2" />
              </button>
            </div>
          ) : (
            <button onClick={() => login()} className="bg-yellow-500 text-black px-6 py-3 rounded-full text-lg font-semibold flex items-center hover:bg-yellow-600 transition duration-300">
              Get Started Now <FaArrowRight className="ml-2" />
            </button>
          )}
          {error && <p className="text-red-500 mt-4">{error}</p>}
        </div>
        <div className="w-1/2">
          {/* Replace with your actual illustration */}
          <div className="w-full max-w-md ml-auto bg-gray-700 h-64 rounded-lg"></div>
        </div>
      </main>
    </div>
  );
}

export default App;