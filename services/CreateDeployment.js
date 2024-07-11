import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CreateDeployment = () => {
  const [deploymentName, setDeploymentName] = useState('');
  const [sourceOrg, setSourceOrg] = useState('');
  const [targetOrg, setTargetOrg] = useState('');
  const [orgs, setOrgs] = useState([]);

  useEffect(() => {
    // Fetch the list of organizations when the component mounts
    fetchOrgs();
  }, []);

  const fetchOrgs = async () => {
    try {
      const response = await axios.get('/connected-orgs');
      setOrgs(response.data);
    } catch (error) {
      console.error('Error fetching orgs:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/deployments/create', {
        deploymentName,
        sourceOrg,
        targetOrg
      });
      console.log('Deployment created:', response.data);
      // Reset form or redirect user
    } catch (error) {
      console.error('Error creating deployment:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={deploymentName}
        onChange={(e) => setDeploymentName(e.target.value)}
        placeholder="Deployment Name"
        required
      />
      <select
        value={sourceOrg}
        onChange={(e) => setSourceOrg(e.target.value)}
        required
      >
        <option value="">Select Source Org</option>
        {orgs.map((org) => (
          <option key={org.id} value={org.id}>
            {org.name}
          </option>
        ))}
      </select>
      <select
        value={targetOrg}
        onChange={(e) => setTargetOrg(e.target.value)}
        required
      >
        <option value="">Select Target Org</option>
        {orgs.map((org) => (
          <option key={org.id} value={org.id}>
            {org.name}
          </option>
        ))}
      </select>
      <button type="submit">Create Deployment</button>
    </form>
  );
};

export default CreateDeployment;