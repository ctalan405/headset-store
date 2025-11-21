import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import axios from "axios";
import './ViewMore.css'; // Optional, for custom styles

function ViewMore() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [data, setData] = useState({});
  const role = localStorage.getItem('role');
  const accessToken = localStorage.getItem('access_token');

  useEffect(() => {
    if (!role || !accessToken) {
      navigate('/login');
      return;
    }
    axios.get(`http://127.0.0.1:8000/get-headset/${id}/`)
      .then(res => setData(res.data))
      .catch(() => alert("Product not found"));
  }, [id, role, accessToken, navigate]);

  const deleteHeadset = async () => {
    try {
      await axios.delete(`http://127.0.0.1:8000/delete-headset/${id}/`, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      navigate('/');
    } catch (error) {
      alert("Delete failed");
    }
  };

  const handleBuyNow = () => {
    navigate('/order', { state: { headsetId: data.Headset_id } });
  };

  if (!data.Headset_name) return <div>Loading...</div>;

  return (
    <div className="container my-5">
      <div className="row g-0 shadow-lg rounded overflow-hidden align-items-center product-detail-card">
        <div className="col-md-5 p-0 d-flex justify-content-center bg-light">
          {/* Use your product image or attached image */}
          <img src={`http://127.0.0.1:8000/${data.Headset_image}`} 
               alt={data.Headset_name}
               className="img-fluid h-100 product-image"
               style={{ objectFit: 'cover', maxHeight: "340px", borderRadius: '20px 0 0 20px' }} />
        </div>
        <div className="col-md-7 p-4 d-flex flex-column justify-content-between">
          <div>
            <h3 className="mb-2">{data.Headset_name}</h3>
            <h4 className="text-success mb-3">₹{data.Headset_price}</h4>
            <p className="mb-3"><strong>Description:</strong> {data.description}</p>
          </div>
          <div>
            {role === 'admin' && (
              <>
                <Button variant="danger" onClick={deleteHeadset} className="me-2">Delete</Button>
                <Link to={`/update/${data.Headset_id}`}>
                  <Button variant="primary">Update</Button>
                </Link>
              </>
            )}
            {role === 'user' && (
              <>
                <Button
                  variant="warning"
                  onClick={() => {
                    axios.post(
                      "http://127.0.0.1:8000/cart/add/",
                      { headset_id: data.Headset_id, quantity: 1 },
                      { headers: { Authorization: `Bearer ${accessToken}` } }
                    )
                      .then(() => alert("Added to cart!"))
                      .catch(() => alert("Cart error"));
                  }}
                  className="me-2 mb-2">
                  Add to Cart
                </Button>
                <Button
                  variant="success"
                  onClick={handleBuyNow}
                  style={{ width: '150px' }}>
                  Buy Now
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ViewMore;
