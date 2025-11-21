import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';

function Add() {
  const navigate = useNavigate();
  const [data, setData] = useState({
    Headset_name: '',
    Headset_price: '',
    description: '',
    Headset_image: null
  });

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setData(prev => ({ ...prev, [name]: files[0] }));
    } else {
      setData(prev => ({ ...prev, [name]: value }));
    }
  };

  const submitData = async () => {
    try {
      const formData = new FormData();
      formData.append('Headset_name', data.Headset_name);
      formData.append('Headset_price', data.Headset_price);
      formData.append('description', data.description);
      formData.append('Headset_image', data.Headset_image);

      // Get access token from localStorage
      const accessToken = localStorage.getItem('access_token');      

      await axios.post('http://127.0.0.1:8000/add-headset/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${accessToken}`
        }
      });

      navigate('/'); // redirect after success
    } catch (error) {
      console.error('Error adding headset:', error);
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: "500px" }}>
      <h2 className="mb-4">Add New Headset</h2>
      <form>
        <div className="mb-3">
          <label htmlFor="Headset_name" className="form-label">Headset Name</label>
          <input
            type="text"
            id="Headset_name"
            name="Headset_name"
            value={data.Headset_name}
            onChange={handleInputChange}
            className="form-control"
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="Headset_price" className="form-label">Price</label>
          <input
            type="number"
            id="Headset_price"
            name="Headset_price"
            value={data.Headset_price}
            onChange={handleInputChange}
            min="0"
            className="form-control"
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="description" className="form-label">Description</label>
          <textarea
            id="description"
            name="description"
            value={data.description}
            onChange={handleInputChange}
            className="form-control"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="Headset_image" className="form-label">Headset Image</label>
          <input
            type="file"
            id="Headset_image"
            name="Headset_image"
            accept="image/*"
            onChange={handleInputChange}
            className="form-control"
            required
          />
        </div>

        <button type="button" className="btn btn-primary" onClick={submitData}>
          Add Headset
        </button>
      </form>
    </div>
  );
}

export default Add;
