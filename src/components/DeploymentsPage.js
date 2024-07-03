import React, { useState, useEffect } from 'react';
import './DeploymentsPage.css';

const NewDeploymentForm = ({ setShowForm, setDeploymentInfo }) => {
  const [title, setTitle] = useState('');
  const [sourceOrg, setSourceOrg] = useState('');
  const [targetOrg, setTargetOrg] = useState('');
  const [orgs, setOrgs] = useState([]);

  useEffect(() => {
    const storedOrgs = JSON.parse(localStorage.getItem('organizations')) || [];
    setOrgs(storedOrgs);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (sourceOrg === targetOrg) {
      alert('Source and Target organizations cannot be the same.');
      return;
    }
    const deployment = { title, sourceOrg, targetOrg };
    setDeploymentInfo(deployment);
    localStorage.setItem('deploymentInfo', JSON.stringify(deployment));
    setShowForm(false);
  };

  return (
    <div>
      <h2>New Deployment</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            name="title"
            placeholder="change summary ..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="sourceOrg">Source Org</label>
          <select
            id="sourceOrg"
            name="sourceOrg"
            value={sourceOrg}
            onChange={(e) => setSourceOrg(e.target.value)}
          >
            <option value="">select</option>
            {orgs.map((org, index) => (
              <option key={index} value={org.alias}>{org.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="targetOrg">Target Org</label>
          <select
            id="targetOrg"
            name="targetOrg"
            value={targetOrg}
            onChange={(e) => setTargetOrg(e.target.value)}
          >
            <option value="">select</option>
            {orgs.map((org, index) => (
              <option key={index} value={org.alias}>{org.name}</option>
            ))}
          </select>
        </div>
        <button type="submit">Save</button>
        <button type="button" onClick={() => setShowForm(false)}>Cancel</button>
      </form>
    </div>
  );
};

const DeploymentDetails = ({ deploymentInfo }) => {
  const [activeTab, setActiveTab] = useState('components');
  const [componentType, setComponentType] = useState('');
  const [components, setComponents] = useState([]);

  const handleComponentTypeChange = (e) => {
    setComponentType(e.target.value);
  };

  const loadComponents = async () => {
    if (componentType === 'ApexClass') {
      try {
        const response = await fetch(`http://localhost:3001/listApexClasses?orgAlias=${deploymentInfo.sourceOrg}`);
        const data = await response.json();

        if (response.ok) {
          setComponents(data.apexClasses || []);
        } else {
          console.error('Error fetching Apex classes:', data);
          setComponents([]);
        }
      } catch (error) {
        console.error('Error fetching Apex classes:', error);
        setComponents([]);
      }
    }
    // Add logic for other component types here
  };

  return (
    <div>
      <h1>{deploymentInfo.title}</h1>
      <p>Source Org: {deploymentInfo.sourceOrg}</p>
      <p>Target Org: {deploymentInfo.targetOrg}</p>

      <div className="tabs">
        <button className={activeTab === 'components' ? 'active' : ''} onClick={() => setActiveTab('components')}>Components Selected</button>
        <button className={activeTab === 'addComponents' ? 'active' : ''} onClick={() => setActiveTab('addComponents')}>Add Components</button>
        <button className={activeTab === 'deploymentTasks' ? 'active' : ''} onClick={() => setActiveTab('deploymentTasks')}>Deployment Tasks</button>
        <button className={activeTab === 'deployOptions' ? 'active' : ''} onClick={() => setActiveTab('deployOptions')}>Deploy Options</button>
        <button className={activeTab === 'roboticTests' ? 'active' : ''} onClick={() => setActiveTab('roboticTests')}>Robotic Test Executions</button>
        <button className={activeTab === 'activities' ? 'active' : ''} onClick={() => setActiveTab('activities')}>Activities</button>
      </div>

      <div className="tab-content">
        {activeTab === 'components' && <div>No components selected.</div>}
        {activeTab === 'addComponents' && (
          <div>
            <div>
              <label htmlFor="componentType">Select Component Type</label>
              <select id="componentType" value={componentType} onChange={handleComponentTypeChange}>
                <option value="">Select</option>
                <option value="ApexClass">Apex Class</option>
                <option value="ApexTrigger">Apex Trigger</option>
                {/* Add other component types here */}
              </select>
              <button onClick={loadComponents}>Load Components</button>
            </div>
            <div>
              {components.length > 0 ? (
                <ul>
                  {components.map((component, index) => (
                    <li key={index}>{component}</li>
                  ))}
                </ul>
              ) : (
                <p>No components loaded.</p>
              )}
            </div>
          </div>
        )}
        {activeTab === 'deploymentTasks' && <div>Deployment Tasks content.</div>}
        {activeTab === 'deployOptions' && <div>Deploy Options content.</div>}
        {activeTab === 'roboticTests' && <div>Robotic Test Executions content.</div>}
        {activeTab === 'activities' && <div>Activities content.</div>}
      </div>
    </div>
  );
};

const DeploymentsPage = () => {
  const [showForm, setShowForm] = useState(false);
  const [deploymentInfo, setDeploymentInfo] = useState(null);

  useEffect(() => {
    const savedDeploymentInfo = JSON.parse(localStorage.getItem('deploymentInfo'));
    if (savedDeploymentInfo) {
      setDeploymentInfo(savedDeploymentInfo);
    }
  }, []);

  return (
    <div>
      <h1>Deployments</h1>
      {showForm ? (
        <NewDeploymentForm setShowForm={setShowForm} setDeploymentInfo={setDeploymentInfo} />
      ) : deploymentInfo ? (
        <>
          <button onClick={() => setShowForm(true)}>New Deployment</button>
          <DeploymentDetails deploymentInfo={deploymentInfo} />
        </>
      ) : (
        <button onClick={() => setShowForm(true)}>New Deployment</button>
      )}
    </div>
  );
};

export default DeploymentsPage;
