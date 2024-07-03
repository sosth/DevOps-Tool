import React, { useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const NewOrganizationForm = ({ setShowForm }) => {
  const [type, setType] = useState('salesforce');
  const [name, setName] = useState('');
  const [environment, setEnvironment] = useState('sandbox');
  const [loading, setLoading] = useState(false);

  const handleAuthorize = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      const response = await axios.get('http://localhost:3001/connectOrg');
      toast.success(response.data.message || 'Authorization completed successfully.');

      const newOrg = { type, name, environment };
      const orgs = JSON.parse(localStorage.getItem('organizations')) || [];
      orgs.push(newOrg);
      localStorage.setItem('organizations', JSON.stringify(orgs));

      setShowForm(false);
    } catch (error) {
      console.error('Error connecting to Salesforce org:', error);
      toast.error('Failed to connect to Salesforce org');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>New Organization</h2>
      <form onSubmit={handleAuthorize}>
        <div>
          <label htmlFor="type">Type</label>
          <select id="type" name="type" value={type} onChange={(e) => setType(e.target.value)}>
            <option value="salesforce">Salesforce Org</option>
            <option value="git">Git Repository</option>
            {/* Add more options here if needed */}
          </select>
        </div>
        <div>
          <label htmlFor="name">Name</label>
          <input 
            type="text" 
            id="name" 
            name="name" 
            placeholder="QA sandbox" 
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="environment">Environment</label>
          <select 
            id="environment" 
            name="environment" 
            value={environment}
            onChange={(e) => setEnvironment(e.target.value)}
          >
            <option value="sandbox">Sandbox</option>
            <option value="production">Production/Developer</option>
            {/* Add more options here if needed */}
          </select>
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Authorizing...' : 'Authorize'}
        </button>
        <button type="button" onClick={() => setShowForm(false)}>Cancel</button>
      </form>
    </div>
  );
};

const OrganizationPage = () => {
  const [showForm, setShowForm] = useState(false);

  return (
    <div>
      <h1>Organization</h1>
      {showForm ? (
        <NewOrganizationForm setShowForm={setShowForm} />
      ) : (
        <>
          <button onClick={() => setShowForm(true)}>Add Organization</button>
          {/* Add the list of organizations here */}
        </>
      )}
      <ToastContainer />
    </div>
  );
};

export default OrganizationPage;
