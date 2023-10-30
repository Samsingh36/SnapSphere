import React, { useState, useEffect, useCallback } from "react";
import { Modal, Button, Spinner, Form } from "react-bootstrap";
import { FaSearch, FaHeart } from "react-icons/fa"; // Import only the search icon
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import { useTheme } from "./ThemeContext";

const apiUrl = `https://api.unsplash.com/photos/?page=1&per_page=40&client_id=X2AlpbN5tmHRZRWEnrb4WFCB7zitZ5N4PcQbO8M380c`;

const App = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  const [searchTerm, setSearchTerm] = useState("");
  const [photos, setPhotos] = useState([]);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPhotos = useCallback(async () => {
    try {
      const endpoint = searchTerm
        ? `https://api.unsplash.com/search/photos?page=1&query=${searchTerm}&per_page=40&client_id=X2AlpbN5tmHRZRWEnrb4WFCB7zitZ5N4PcQbO8M380c`
        : apiUrl;

      const response = await fetch(endpoint);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      const formattedPhotos = data.results
        ? data.results.map((photo) => ({
            id: photo.id,
            imageUrl: photo.urls.small,
            userName: photo.user.username,
            likes: photo.likes,
          }))
        : data.map((photo) => ({
            id: photo.id,
            imageUrl: photo.urls.small,
            userName: photo.user.username,
            likes: photo.likes,
          }));

      setPhotos(formattedPhotos);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Error fetching data. Please try again later.");
      setLoading(false);
    }
  }, [searchTerm]);

  useEffect(() => {
    fetchPhotos();
  }, [searchTerm, fetchPhotos]);

  const handleImageClick = (photo) => {
    setSelectedPhoto(photo);
    setShowModal(true);
  };

  return (
    <div className={`container-fluid mt-3 ${isDarkMode ? "dark-mode" : "light-mode"}`}>
      <div className="row align-items-center mb-3">
        <div className="col-3 text-left">
          <h1>SnapSphere</h1> 
        </div>
        <div className="col-6 text-center">
          <Form className="search-form mt-0" onSubmit={(e) => e.preventDefault()}>
            <Form.Group controlId="formSearch">
              <div className="input-group">
                <Form.Control
                  type="text"
                  placeholder="Search Photos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{
                     fontSize: "0.9rem",
                    padding: "0.25rem 0.5rem",
                    borderRadius: "0rem",}}
                />
                <div className="input-group-append">
                  <Button variant="primary" onClick={fetchPhotos} >
                  
                    <FaSearch />
                  </Button>
                </div>
              </div>
            </Form.Group>
          </Form>
        </div>
        <div className="col-3 d-flex justify-content-end">
          <Button className="ml-3" variant={isDarkMode ? "light" : "dark"} onClick={toggleTheme}>
            {isDarkMode ? "Light Mode" : "Dark Mode"}
          </Button>
        </div>
      </div>

      {error && <p className="text-danger">{error}</p>}

      {loading && (
        <div className="text-center mt-5">
          <Spinner animation="border" role="status">
            <span className="sr-only">Loading...</span>
          </Spinner>
        </div>
      )}

      <div className="row mt-3">
        {photos.map((photo) => (
          <div key={photo.id} className="col-sm-6 col-md-4 col-lg-3 mb-3">
            <div className="card" onClick={() => handleImageClick(photo)}>
              <img
                className="card-img-top img-fluid"
                src={photo.imageUrl}
                alt={`${photo.userName}`}
              />
              <div className="card-body">
                <p className="card-text">{`By: ${photo.userName}`}</p>
                <p className="card-text">
                  <FaHeart /> {photo.likes}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedPhoto && (
        <Modal show={showModal} onHide={() => setShowModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>{selectedPhoto.userName}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <img
              className="img-fluid"
              src={selectedPhoto.imageUrl}
              alt={`${selectedPhoto.userName}`}
            />
            <p>{`Likes: ${selectedPhoto.likes}`}</p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
};

export default App;
