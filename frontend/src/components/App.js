import React, { useState, useEffect } from "react";
import { GoogleLogin, googleLogout, useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { FaArrowRight } from 'react-icons/fa';
import illustration from './images/dev.PNG'; // Make sure this path is correct

function App() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);

  const login = useGoogleLogin({
    onSuccess: (codeResponse) => setUser(codeResponse),
    onError: (error) => console.log("Login Failed:", error),
  });

  useEffect(() => {
    if (user) {
      axios
        .get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${user.access_token}`)
        .then((res) => {
          setProfile(res.data);
          axios.post('https://devto-f2687ab8b235.herokuapp.com/api/google', {
            email: res.data.email,
            given_name: res.data.given_name,
            family_name: res.data.family_name,
            id: res.data.id
          })
          .then(response => {
            console.log('User data saved successfully:', response.data);
          })
          .catch(err => {
            console.error('Error saving user data:', err.response ? err.response.data : err.message);
          });
        })
        .catch((err) => console.log(err));
    }
  }, [user]);

  const logOut = () => {
    googleLogout();
    setProfile(null);
  };

  return (
    <div className="bg-[#191919] min-h-screen flex flex-col items-center justify-center text-white">
      <header className="w-full flex justify-between items-center px-8 py-4">
        <h1 className="text-2xl font-bold">DEVO<span className="text-yellow-500">SPACE</span></h1>
        <div>
          <button className="font-bold text-white px-4 py-2 rounded mr-4">Sign Up</button>
          {profile ? (
            <button onClick={logOut} className="bg-yellow-500 font-bold text-black px-4 py-2 rounded">Logout</button>
          ) : (
            <button onClick={() => login()} className="bg-yellow-500 font-bold text-black px-4 py-2 rounded">Login</button>
          )}
        </div>
      </header>
      <main className="flex-grow flex items-center px-8 py-12">
        <div className="w-1/2 pr-8">
          <button className="bg-yellow-500 text-black px-4 py-2 rounded-full text-sm font-semibold mb-8 flex items-center">
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
          {profile ? (
            <div>
              <h2 className="text-2xl font-bold mb-4">Welcome, {profile.name}</h2>
              <p>Email: {profile.email}</p>
              <p>ID: {profile.id}</p>
              <p>First Name: {profile.given_name}</p>
              <p>Last Name: {profile.family_name}</p>
            </div>
          ) : (
            <button onClick={() => login()} className="bg-yellow-500 text-black px-6 py-3 rounded-full text-lg font-semibold flex items-center">
              Get Started Now <FaArrowRight className="ml-2" />
            </button>
          )}
        </div>
        <div className="w-1/2">
          <img src={illustration} alt="DevOps illustration" className="w-full max-w-md ml-auto"/>
        </div>
      </main>
    </div>
  );
}

export default App;