// frontend/src/components/CreateDeploymentPage.js

import React, { useState, useEffect } from 'react';
import { createDeployment, getDeployments, getOrganizations } from '../../services/createDeployment';

const CreateDeploymentPage = () => {
  const [deploymentName, setDeploymentName] = useState('');
  const [sourceOrg, setSourceOrg] = useState('');
  const [targetOrg, setTargetOrg] = useState('');
  const [orgs, setOrgs] = useState([]);
  const [deployments, setDeployments] = useState([]);

  useEffect(() => {
    fetchOrgs();
    fetchDeployments();
  }, []);

  const fetchOrgs = async () => {
    try {
      const organizations = await getOrganizations();
      setOrgs(organizations);
    } catch (error) {
      console.error('Error fetching orgs:', error);
    }
  };

  const fetchDeployments = async () => {
    try {
      const existingDeployments = await getDeployments();
      setDeployments(existingDeployments);
    } catch (error) {
      console.error('Error fetching deployments:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createDeployment({ deploymentName, sourceOrg, targetOrg });
      alert('Deployment created successfully!');
      setDeploymentName('');
      setSourceOrg('');
      setTargetOrg('');
      fetchDeployments();
    } catch (error) {
      console.error('Error creating deployment:', error);
      alert('Failed to create deployment. Please try again.');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Create New Deployment</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="deploymentName" className="block mb-1">Deployment Name:</label>
          <input
            type="text"
            id="deploymentName"
            value={deploymentName}
            onChange={(e) => setDeploymentName(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label htmlFor="sourceOrg" className="block mb-1">Source Organization:</label>
          <select
            id="sourceOrg"
            value={sourceOrg}
            onChange={(e) => setSourceOrg(e.target.value)}
            className="w-full p-2 border rounded"
            required
          >
            <option value="">Select Source Org</option>
            {orgs.map((org) => (
              <option key={org.id} value={org.id}>{org.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="targetOrg" className="block mb-1">Target Organization:</label>
          <select
            id="targetOrg"
            value={targetOrg}
            onChange={(e) => setTargetOrg(e.target.value)}
            className="w-full p-2 border rounded"
            required
          >
            <option value="">Select Target Org</option>
            {orgs.map((org) => (
              <option key={org.id} value={org.id}>{org.name}</option>
            ))}
          </select>
        </div>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          Create Deployment
        </button>
      </form>

      <h2 className="text-xl font-bold mt-8 mb-4">Existing Deployments</h2>
      <div className="space-y-4">
        {deployments.map((deployment) => (
          <div key={deployment.id} className="bg-gray-100 p-4 rounded">
            <h3 className="font-semibold">{deployment.dep_name}</h3>
            <p>Source: {deployment.source_org_name}</p>
            <p>Target: {deployment.target_org_name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CreateDeploymentPage;