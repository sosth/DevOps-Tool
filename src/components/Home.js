// HomePage.js
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import Modal from 'react-modal';

Modal.setAppElement('#root');  // Set the root element for accessibility

const HomePage = () => {
  const location = useLocation();
  const [userInfo, setUserInfo] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [folderName, setFolderName] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isRetrieveModalOpen, setIsRetrieveModalOpen] = useState(false);
  const [folders, setFolders] = useState([]);
  const [selectedFolder, setSelectedFolder] = useState('');

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const accessToken = location.state?.accessToken;
        console.log('Access Token:', accessToken);  // Debugging line
        const response = await axios.get('http://localhost:3001/salesforce/user-info', {
          params: { accessToken },
        });
        console.log('User Info Response:', response.data);  // Debugging line
        setUserInfo(response.data);
      } catch (error) {
        console.error('Error fetching user info:', error);
        setError('Failed to load user information.');
      }
    };

    fetchUserInfo();
  }, [location.state?.accessToken]);

  const handleOpenCreateModal = () => {
    setIsCreateModalOpen(true);
  };

  const handleCloseCreateModal = () => {
    setIsCreateModalOpen(false);
    setFolderName('');  // Clear the folder name input
  };

  const handleCreateFolder = async () => {
    if (!folderName) {
      setMessage('Please enter a folder name.');
      return;
    }
    
    if (!userInfo) {
      setMessage('User information not available.');
      return;
    }

    setLoading(true);
    setMessage('');
    try {
      const response = await axios.get('http://localhost:3001/createFolder', {
        params: { folderName, userName: userInfo.user_id },
      });
      setMessage(response.data.message);
      handleCloseCreateModal();  // Close the modal after successful creation
    } catch (error) {
      console.error('Error creating folder:', error);
      setMessage('Failed to create folder.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenRetrieveModal = async () => {
    if (!userInfo) {
      setMessage('User information not available.');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get('http://localhost:3001/listFolders', {
        params: { userName: userInfo.user_id },
      });
      setFolders(response.data.folders);
      setIsRetrieveModalOpen(true);
    } catch (error) {
      console.error('Error fetching folders:', error);
      setMessage('Failed to fetch folders.');
    } finally {
      setLoading(false);
    }
  };

  const handleCloseRetrieveModal = () => {
    setIsRetrieveModalOpen(false);
    setSelectedFolder('');  // Clear the selected folder
  };

  const handleRetrieveApexClass = async () => {
    if (!selectedFolder) {
      setMessage('Please select a folder.');
      return;
    }

    if (!userInfo) {
      setMessage('User information not available.');
      return;
    }

    setLoading(true);
    setMessage('');
    try {
      const response = await axios.get('http://localhost:3001/retrieveApexClass', {
        params: { folderName: selectedFolder, userName: userInfo.user_id },
      });
      setMessage(response.data.message);
      handleCloseRetrieveModal();  // Close the modal after retrieval
    } catch (error) {
      console.error('Error retrieving Apex class:', error);
      setMessage('Failed to retrieve Apex class.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeployApexClass = async () => {
    if (!selectedFolder) {
      setMessage('Please select a folder.');
      return;
    }

    if (!userInfo) {
      setMessage('User information not available.');
      return;
    }

    setLoading(true);
    setMessage('');
    try {
      const response = await axios.get('http://localhost:3001/deployApexClass', {
        params: { folderName: selectedFolder, userName: userInfo.user_id },
      });
      setMessage(response.data.message);
    } catch (error) {
      console.error('Error deploying Apex class:', error);
      setMessage('Failed to deploy Apex class.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteFolder = async (folder) => {
    if (!userInfo) {
      setMessage('User information not available.');
      return;
    }

    setLoading(true);
    setMessage('');
    try {
      const response = await axios.get('http://localhost:3001/deleteFolder', {
        params: { folderName: folder, userName: userInfo.user_id },
      });
      setMessage(response.data.message);
      setFolders(folders.filter(f => f !== folder));
    } catch (error) {
      console.error('Error deleting folder:', error);
      setMessage('Failed to delete folder.');
    } finally {
      setLoading(false);
    }
  };

  const handleConnectOrg = async () => {
    setLoading(true);
    setMessage('');
    try {
      const response = await axios.get('http://localhost:3001/connectOrg');
      setMessage(response.data.message);
    } catch (error) {
      console.error('Error connecting to Salesforce org:', error);
      setMessage('Failed to connect to Salesforce org.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Welcome to the Home Page</h1>
      {error ? (
        <p>{error}</p>
      ) : userInfo ? (
        <div>
          <h2>Welcome {userInfo.name}</h2>
          <p>User ID: {userInfo.user_id}</p>
          <p>Name: {userInfo.name}</p>
          <p>Email: {userInfo.email}</p>
        </div>
      ) : (
        <p>Loading user information...</p>
      )}
      <button onClick={handleConnectOrg} disabled={loading}>Connect to Salesforce Org</button>
      <button onClick={handleOpenCreateModal} disabled={loading}>Create Deployment Folder</button>
      <button onClick={handleOpenRetrieveModal} disabled={loading}>Retrieve Apex Class</button>
      <button onClick={handleDeployApexClass} disabled={loading}>Deploy Apex Class</button>
      {message && <p>{message}</p>}
      
      <Modal
        isOpen={isCreateModalOpen}
        onRequestClose={handleCloseCreateModal}
        contentLabel="Enter Folder Name"
      >
        <h2>Enter Folder Name</h2>
        <input 
          type="text" 
          placeholder="Enter folder name" 
          value={folderName} 
          onChange={(e) => setFolderName(e.target.value)} 
        />
        <button onClick={handleCreateFolder} disabled={loading}>Create</button>
        <button onClick={handleCloseCreateModal}>Cancel</button>
      </Modal>

      <Modal
        isOpen={isRetrieveModalOpen}
        onRequestClose={handleCloseRetrieveModal}
        contentLabel="Select Folder"
      >
        <h2>Select Folder to Retrieve Apex Class</h2>
        <select 
          value={selectedFolder}
          onChange={(e) => setSelectedFolder(e.target.value)}
        >
          <option value="" disabled>Select a folder</option>
          {folders.map(folder => (
            <option key={folder} value={folder}>{folder}</option>
          ))}
        </select>
        <button onClick={handleRetrieveApexClass} disabled={loading}>Retrieve</button>
        <button onClick={handleDeployApexClass} disabled={loading}>Deploy</button>
        <button onClick={handleCloseRetrieveModal}>Cancel</button>
        <h2>Delete Folder</h2>
        {folders.map(folder => (
          <div key={folder}>
            <span>{folder}</span>
            <button onClick={() => handleDeleteFolder(folder)} disabled={loading}>Delete</button>
          </div>
        ))}
      </Modal>
    </div>
  );
};

export default HomePage;
