import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CreateDeployment = () => {
  const [deploymentName, setDeploymentName] = useState('');
  const [sourceOrg, setSourceOrg] = useState('');
  const [targetOrg, setTargetOrg] = useState('');
  const [orgs, setOrgs] = useState([]);
  const [deployments, setDeployments] = useState([]);

  useEffect(() => {
    // Fetch the list of organizations and deployments when the component mounts
    fetchOrgs();
    fetchDeployments();
  }, []);

  const fetchOrgs = async () => {
    try {
      const response = await axios.get('/connected-orgs');
      setOrgs(response.data);
    } catch (error) {
      console.error('Error fetching orgs:', error);
    }
  };

  const fetchDeployments = async () => {
    try {
      const response = await axios.get('/api/deployments');
      setDeployments(response.data);
    } catch (error) {
      console.error('Error fetching deployments:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/deployments/create', {
        deploymentName,
        sourceOrg,
        targetOrg,
      });
      console.log('Deployment created:', response.data);
      fetchDeployments(); // Refresh the deployments list
      setDeploymentName('');
      setSourceOrg('');
      setTargetOrg('');
    } catch (error) {
      console.error('Error creating deployment:', error);
    }
  };

  return (
    <div>
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
            <option key={org.org_id} value={org.org_id}>
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
            <option key={org.org_id} value={org.org_id}>
              {org.name}
            </option>
          ))}
        </select>
        <button type="submit">Create Deployment</button>
      </form>
      <div>
        <h2>Existing Deployments</h2>
        {deployments.map((deployment) => (
          <div key={deployment.dep_id}>
            <p>{deployment.dep_name}</p>
            <p>Source: {deployment.source_org_name}</p>
            <p>Target: {deployment.target_org_name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CreateDeployment;
