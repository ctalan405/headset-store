import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

function Update() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [data, setData] = useState({
    'Headset_name': '',
    'description': '',
    'Headset_price': 0,
    'Headset_image': null
  });

  // Fetch single headset details for this id
  const fetchData = async () => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/get-headset/${id}/`);
      setData({
        'description': response.data.description,
        'Headset_name': response.data.Headset_name,
        'Headset_price': response.data.Headset_price,
        'Headset_image': null // Reset file input for edit
      });
    } catch (error) {
      console.log("something went wrong", error);
    }
  };

  // Handle input/data changes
  const InputData = (e) => {
    const files = e.target.files;
    if (files && files[0]) {
      setData({ ...data, [e.target.name]: files[0] });
    } else {
      setData({ ...data, [e.target.name]: e.target.value });
    }
  };

  // Submit updated data to backend
  const updateData = async () => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      navigate('/login');
      return;
    }
    try {
      const formData = new FormData();
      formData.append('Headset_name', data.Headset_name);
      formData.append('description', data.description);
      formData.append('Headset_price', data.Headset_price);
      if (data.Headset_image) {
        formData.append('Headset_image', data.Headset_image);
      }
      await axios.put(
        `http://127.0.0.1:8000/update-headset/${id}/`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`
          }
        }
      );
      navigate('/');
    } catch (error) {
      console.log("something went wrong", error);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, []);

  return (
    <>
      <form style={{ maxWidth: "400px", margin: "auto" }}>
        <h2>Update Headset</h2>

        <div>
          <label>Headset Name:</label>
          <input
            type="text"
            name="Headset_name"
            value={data.Headset_name}
            onChange={InputData}
            required
          />
        </div>

        <div>
          <label>Description:</label>
          <input
            type="text"
            name="description"
            value={data.description}
            onChange={InputData}
            required
          />
        </div>

        <div>
          <label>Price:</label>
          <input
            type="number"
            name="Headset_price"
            value={data.Headset_price}
            onChange={InputData}
            min="0"
            required
          />
        </div>

        <div>
          <label>Headset Image:</label>
          <input
            type="file"
            name="Headset_image"
            accept="image/*"
            onChange={InputData}
          />
        </div>

        <button type="button" onClick={updateData}>Update Headset</button>
      </form>
    </>
  );
}

export default Update;
