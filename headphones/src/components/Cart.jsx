import React, { useEffect, useState } from 'react';
import { fetchCart, updateCartItem, removeCartItem } from '../cartApi';
import { Card, Table, Button, Image, Form, Alert } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';

function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [status, setStatus] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchCart()
      .then(res => {
        setCartItems(res.data.cart);
        setTotal(res.data.total);
      })
      .catch(() => setStatus('Could not load cart.'));
  }, []);

  const handleRemove = id => {
    removeCartItem(id).then(() => {
      setCartItems(c => c.filter(item => item.id !== id));
      setStatus('Item removed from cart');
      setTimeout(() => setStatus(''), 1500);
    });
  };

  const handleQuantityChange = (id, quantity) => {
    if (quantity < 1) return;
    updateCartItem(id, quantity).then(res => {
      setCartItems(c =>
        c.map(item => (item.id === id ? res.data : item))
      );
      setStatus('Quantity updated');
      setTimeout(() => setStatus(''), 1200);
    });
  };

  // Re-calculate total on cartItems update
  useEffect(() => {
    const newTotal = cartItems.reduce(
      (sum, item) => sum + item.headset.Headset_price * item.quantity,
      0
    );
    setTotal(newTotal);
  }, [cartItems]);

  const handleOrder = () => {
    navigate('/order'); // Route to OrderForm, which will fetch cart
  };

  return (
    <Card className="shadow-lg border-0 mx-auto my-5" style={{ maxWidth: '800px' }}>
      <Card.Body>
        <Card.Title className="mb-4 text-center display-6">Your Shopping Cart</Card.Title>
        {status && <Alert variant="info">{status}</Alert>}
        {cartItems.length === 0 ? (
          <div className="text-center text-muted py-3">Your cart is empty.</div>
        ) : (
          <>
            <Table bordered hover responsive className="align-middle">
              <thead className="table-light">
                <tr>
                  <th>Image</th>
                  <th>Product</th>
                  <th>Price (₹)</th>
                  <th width="120">Qty</th>
                  <th width="80">Subtotal (₹)</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {cartItems.map(item => (
                  <tr key={item.id}>
                    <td>
                      <Link to={`/View_More/${item.headset.Headset_id}`} style={{ textDecoration: 'none' }}>
                        <Image
                          src={`http://localhost:8000/${item.headset.Headset_image}`}
                          alt={item.headset.Headset_name}
                          fluid rounded
                          style={{ maxWidth: '70px', maxHeight: '70px', background: "#eee", cursor: "pointer" }}
                        />
                      </Link>
                    </td>
                    <td>
                      <Link to={`/View_More/${item.headset.Headset_id}`} style={{ textDecoration: 'none', color: '#0d6efd', cursor: "pointer" }}>
                        <div className="fw-bold">{item.headset.Headset_name}</div>
                      </Link>
                    </td>
                    <td>
                      {item.headset.Headset_price}
                    </td>
                    <td>
                      <Form.Control
                        type="number"
                        min={1}
                        style={{ maxWidth: '75px' }}
                        value={item.quantity}
                        onChange={e => handleQuantityChange(item.id, parseInt(e.target.value))}
                      />
                    </td>
                    <td>
                      {item.headset.Headset_price * item.quantity}
                    </td>
                    <td>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => handleRemove(item.id)}
                      >
                        &times;
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
            <div className="d-flex justify-content-between align-items-center mt-3">
              <h4 className="mb-0">Total: <span className="text-success">₹{total}</span></h4>
              <Button variant="success" size="lg" onClick={handleOrder}>
                Proceed to Order
              </Button>
            </div>
          </>
        )}
      </Card.Body>
    </Card>
  );
}

export default Cart;
