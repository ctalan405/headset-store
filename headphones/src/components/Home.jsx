import { useEffect, useState } from "react";
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import 'bootstrap/dist/css/bootstrap.min.css';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import CarouselComponent from "./Carousel";
import Footer from './footer';
import './Home.css';


function Home() {
  const [data, setData] = useState([]);
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/get-headsets/');
      setData(response.data);
    } catch (error) {
      console.log("There was an error", error);
    }
  };
  useEffect(() => {
    fetchData()
  }, []);

  // Handler for button click - checks login
  const handleViewDetails = (id) => {
    const role = localStorage.getItem('role');
    const accessToken = localStorage.getItem('access_token');
    if (!role || !accessToken) {
      navigate('/login'); // Not logged in, go to login page
      return;
    }
    navigate(`/View_More/${id}`);
  }

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh'
    }}>
      <CarouselComponent />
      <Container className="my-4" style={{ flex: 1 }}>
        <Row className="g-4">
          {data.map((x) => (
            <Col key={x.Headset_id} xs={12} sm={6} md={4} lg={3}>
              <Card className="shadow-sm h-100 card-hover-effect">
                <Card.Img
                  variant="top"
                  src={`http://127.0.0.1:8000/${x.Headset_image}`}
                  style={{ height: "200px", objectFit: "cover" }}
                />
                <Card.Body className="d-flex flex-column">
                  <Card.Title>{x.Headset_name}</Card.Title>
                  <Card.Text>₹{x.Headset_price}</Card.Text>
                  <div className="mt-auto">
                    <Button
                      variant="primary"
                      className="w-100"
                      onClick={() => handleViewDetails(x.Headset_id)}
                    >
                      View Details
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
      <Footer />
    </div>
  );
}
export default Home;
