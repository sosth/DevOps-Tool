import React from 'react';
import { FaArrowRight } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import illustration from '../images/dev.PNG'; // Make sure this path is correct

const HomePage = ({ login, isLoggedIn }) => {
  const navigate = useNavigate();

  const handleLogin = () => {
    if (isLoggedIn) {
      navigate('/dashboard');
    } else {
      login();
    }
  };

  return (
    <div className="bg-[#191919] min-h-screen flex flex-col items-center justify-center text-white">
      <header className="w-full flex justify-between items-center px-8 py-4">
        <h1 className="text-2xl font-bold">DEVO<span className="text-yellow-500">SPACE</span></h1>
        <div>
          <button onClick={handleLogin} className="bg-yellow-500 font-bold text-black px-4 py-2 rounded">
            {isLoggedIn ? 'Dashboard' : 'Login'}
          </button>
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
          <button onClick={handleLogin} className="bg-yellow-500 text-black px-6 py-3 rounded-full text-lg font-semibold flex items-center">
            Get Started Now <FaArrowRight className="ml-2" />
          </button>
        </div>
        <div className="w-1/2">
          <img src={illustration} alt="DevOps illustration" className="w-full max-w-md ml-auto"/>
        </div>
      </main>
    </div>
  );
}

export default HomePage;