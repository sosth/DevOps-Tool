import React, { useState, useEffect } from 'react';
import axios from 'axios';

function ConnectPage() {
  const [authUrl, setAuthUrl] = useState('');
  const [orgInfo, setOrgInfo] = useState(null);
  const [connectedOrgs, setConnectedOrgs] = useState([]);

  useEffect(() => {
    fetchAuthUrl();
    fetchOrgInfoData();
    fetchOrgInfo();
  }, []);

  const fetchAuthUrl = async () => {
    try {
      const response = await axios.get('/auth-url');
      setAuthUrl(response.data.url);
    } catch (error) {
      console.error('Error fetching auth URL:', error);
    }
  };

  const fetchOrgInfoData = async () => {
    try {
      const response = await axios.get('/org-info-data');
      setConnectedOrgs([response.data]);
    } catch (error) {
      console.error('Error fetching org info data:', error);
    }
  };

  const fetchOrgInfo = async () => {
    try {
      const response = await axios.get('/get-org-info');
      setOrgInfo(response.data);
    } catch (error) {
      console.error('Error fetching org info:', error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Connect to Salesforce Org</h1>
      <a href={authUrl} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        Authenticate with Salesforce
      </a>
      
      <h2 className="text-2xl font-semibold mt-8 mb-4">Connected Orgs</h2>
      <ul className="list-disc pl-5">
        {connectedOrgs.map((org, index) => (
          <li key={index} className="mb-2">
            Access Token: {org.accessToken}, Instance URL: {org.instanceUrl}
          </li>
        ))}
      </ul>

      <h2 className="text-2xl font-semibold mt-8 mb-4">Salesforce Org Info</h2>
      {orgInfo && (
        <div className="bg-gray-100 p-4 rounded">
          <p><span className="font-semibold">Salesforce URL:</span> {orgInfo.attributes.url}</p>
          <p><span className="font-semibold">Org ID:</span> {orgInfo.Id}</p>
          <p><span className="font-semibold">Name:</span> {orgInfo.Name}</p>
          <p><span className="font-semibold">Instance Name:</span> {orgInfo.InstanceName}</p>
          <p><span className="font-semibold">Organization Type:</span> {orgInfo.OrganizationType}</p>
          <p><span className="font-semibold">Is Sandbox:</span> {orgInfo.IsSandbox ? 'Yes' : 'No'}</p>
          <p><span className="font-semibold">Created Date:</span> {new Date(orgInfo.CreatedDate).toLocaleString()}</p>
          <p><span className="font-semibold">Primary Contact:</span> {orgInfo.PrimaryContact}</p>
          <p><span className="font-semibold">Country:</span> {orgInfo.Country}</p>
          <p><span className="font-semibold">Default Locale:</span> {orgInfo.DefaultLocaleSidKey}</p>
          <p><span className="font-semibold">Time Zone:</span> {orgInfo.TimeZoneSidKey}</p>
          <p><span className="font-semibold">Language:</span> {orgInfo.LanguageLocaleKey}</p>
        </div>
      )}
    </div>
  );
}

export default ConnectPage;