import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../CSS files/PastUploads.css';

const PastUploads = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [uploads, setUploads] = useState([]);
  const navigate = useNavigate();

  const handleSelectUpload = (upload) => {
    navigate(`/render-view/${upload.fileName}`, {
      state: {
        outputString: upload.outputString,
        title: upload.title,
        doi: upload.doi,
        dateAccessed: upload.dateAccessed,
      },
    });
  };

  useEffect(() => {
    (async () => {
      try {
        const authResponse = await fetch('http://localhost:5000/api/auth/status', {
          credentials: 'include',
        });
        const authData = await authResponse.json();
        setIsAuthenticated(authData.isAuthenticated);

        if (authData.isAuthenticated) {
          const uploadsResponse = await fetch('http://localhost:5000/api/toJson/research-papers');
          const uploadsData = await uploadsResponse.json();
          setUploads(uploadsData);
        }
      } catch (error) {
        console.error('Error during initialization:', error);
      }
    })();
  }, []);

  if (!isAuthenticated) {
    return (
      <div className="login-prompt">
        <h2>Please log in to view your past uploads</h2>
      </div>
    );
  }

  return (
    <div className="wrapper">
      <div className="headAndFirst">
        <h2>Past Uploads</h2>

        {uploads.length > 0 ? (
          <>
            <div
              className="recentUpload"
              onClick={() => handleSelectUpload(uploads[0])}
            >
              <a id="uploadWrapperLink">
                <h1>{uploads[0].title}</h1>
                <div id="dateID">
                  <h3>{uploads[0].doi}</h3>
                  <h3>{new Date(uploads[0].dateAccessed).toLocaleDateString()}</h3>
                </div>
              </a>
            </div>

            {uploads.slice(1).map((upload, index) => (
              <div
                key={upload._id || index}
                className="genUploads"
                onClick={() => handleSelectUpload(upload)}
              >
                <a id="uploadWrapperLink">
                  <h1>{upload.title}</h1>
                  <div id="dateID">
                    <h3>{upload.doi}</h3>
                    <h3>{new Date(upload.dateAccessed).toLocaleDateString()}</h3>
                  </div>
                </a>
              </div>
            ))}
          </>
        ) : (
          <div className="login-prompt">
            <h2>No uploads found.</h2>
          </div>
        )}
      </div>
    </div>
  );
};

export default PastUploads;
