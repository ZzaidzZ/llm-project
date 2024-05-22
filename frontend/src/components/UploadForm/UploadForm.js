import React, { useState } from 'react';
import axios from 'axios';

const UploadForm = () => {
  const [file, setFile] = useState(null);
  const [projectTitle, setProjectTitle] = useState('');
  const [projectId, setProjectId] = useState('');

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleTitleChange = (event) => {
    setProjectTitle(event.target.value);
  };

  const handleIdChange = (event) => {
    setProjectId(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!file || !projectTitle || !projectId) {
      alert('Please fill out all fields and select a file.');
      return;
    }

    const formData = new FormData();
    formData.append('document', file);
    formData.append('project_title', projectTitle);
    formData.append('project_id', projectId);

    try {
      const response = await axios.post('http://127.0.0.1:8000/api/encode-doc/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data) {
        alert('File uploaded and processed successfully!');
      } else {
        alert('Failed to process the file.');
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Error uploading file. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div style={{marginTop:"20px"}}>
        <label>Project Title:</label>
        <input type="text" value={projectTitle} onChange={handleTitleChange} />
      </div>
      <div style={{marginTop:"20px"}}>
        <label>Project ID:</label>
        <input type="text" value={projectId} onChange={handleIdChange} />
      </div>
      <div style={{marginTop:"20px"}}>
        <label>Upload Document:</label>
        <input type="file" onChange={handleFileChange}  />
      </div>
      <button type="submit"  style={{
    marginTop: "50px",
    backgroundColor: "grey",
    color: "white",
    cursor: "pointer" ,
    padding: "10px",
    fontSize: "16px",
    borderRadius: "15px"  // Add this line to make the button rounded
}}>Upload</button>
    </form>
  );
};

export default UploadForm;
