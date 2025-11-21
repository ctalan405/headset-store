import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card, Table, Button, Form, Alert, Spinner } from 'react-bootstrap';
import axios from 'axios';

const OrderForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const headsetId = location.state?.headsetId || null;
  const [items, setItems] = useState([]);
  const [totalAmount, setTotalAmount] = useState('0.00');
  const [status, setStatus] = useState({ success: false, error: '' });
  const [loading, setLoading] = useState(true);

  // Calculate order total
  const calculateTotal = (data) => {
    const total = data.reduce(
      (sum, item) => sum + (parseFloat(item.price || 0) * parseInt(item.quantity || 0)),
      0
    );
    setTotalAmount(total.toLocaleString('en-IN'));
  };

  // Fetch items on mount, depending on use case
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (headsetId) {
      // BUY NOW: fetch one headset
      axios.get(`http://localhost:8000/get-headset/${headsetId}/`)
        .then(res => {
          setItems([{
            headset: res.data.Headset_id,
            label: res.data.Headset_name,
            price: res.data.Headset_price,
            quantity: 1
          }]);
          calculateTotal([{
            headset: res.data.Headset_id,
            price: res.data.Headset_price,
            quantity: 1
          }]);
          setLoading(false);
        })
        .catch(() => {
          setStatus({ success: false, error: 'Product not found' });
          setLoading(false);
        });
    } else {
      // FROM CART: fetch all cart items
      axios.get('http://localhost:8000/cart/', {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => {
          const cartItems = res.data.cart.map(item => ({
            headset: item.headset.Headset_id,
            label: item.headset.Headset_name,
            price: item.headset.Headset_price,
            quantity: item.quantity
          }));
          setItems(cartItems);
          calculateTotal(cartItems);
          setLoading(false);
        })
        .catch(() => {
          setStatus({ success: false, error: 'Could not fetch cart items' });
          setLoading(false);
        });
    }
    // eslint-disable-next-line
  }, [headsetId]);

  // Handle quantity change (cart mode)
  const handleQuantityChange = (idx, value) => {
    const updated = items.map((item, i) =>
      i === idx ? { ...item, quantity: value } : item
    );
    setItems(updated);
    calculateTotal(updated);
  };

  // Remove cart item (cart mode)
  const removeItem = (idx) => {
    const updated = items.filter((_, i) => i !== idx);
    setItems(updated);
    calculateTotal(updated);
  };

  // Submit order
  const submitOrder = async () => {
    if (!items.length) {
      setStatus({ success: false, error: 'No items to order.' });
      return;
    }
    const token = localStorage.getItem('access_token');
    const orderData = {
      total_amount: totalAmount.replace(/,/g, ''),
      items: items.map(item => ({
        headset: item.headset,
        quantity: parseInt(item.quantity),
        price: item.price
      }))
    };
    try {
      await axios.post('http://localhost:8000/create-order/', orderData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStatus({ success: true, error: '' });
      setItems([]);
      setTotalAmount('0.00');
      setTimeout(() => {
        navigate('/'); // Or order success page
      }, 1500);
    } catch (error) {
      setStatus({ success: false, error: error.response?.data?.message || "Order failed" });
    }
  };

  if (loading) {
    return <div className="text-center py-5"><Spinner animation="border" /> Loading...</div>;
  }

  return (
    <Card className="shadow-lg border-0 mx-auto my-5" style={{ maxWidth: '700px' }}>
      <Card.Body>
        <Card.Title className="mb-4 text-center display-6">
          {headsetId ? 'Buy Now' : 'Cart Order'}
        </Card.Title>
        {status.success && <Alert variant="success">Order placed successfully!</Alert>}
        {status.error && <Alert variant="danger">{status.error}</Alert>}

        <Table bordered hover className="mb-4 align-middle">
          <thead>
            <tr>
              <th>Product</th>
              <th width="100">Qty</th>
              <th width="110">Price (₹)</th>
              {headsetId ? null : <th width="50"></th>}
            </tr>
          </thead>
          <tbody>
            {items.length === 0 && (
              <tr>
                <td colSpan={headsetId ? 3 : 4} className="text-center text-muted">
                  No items to order.
                </td>
              </tr>
            )}
            {items.map((item, idx) => (
              <tr key={idx}>
                <td>{item.label}</td>
                <td>
                  {headsetId ? (
                    <span>{item.quantity}</span>
                  ) : (
                    <Form.Control
                      type="number" min={1}
                      value={item.quantity}
                      onChange={e => handleQuantityChange(idx, e.target.value)}
                      style={{ maxWidth: 80 }}
                    />
                  )}
                </td>
                <td>
                  {item.price}
                </td>
                {headsetId ? null : (
                  <td>
                    <Button variant="outline-danger" size="sm"
                      onClick={() => removeItem(idx)}
                    >&times;</Button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </Table>

        <div className="d-flex justify-content-between align-items-center mb-3">
          {!headsetId && (
            <span className="text-muted">You can edit quantity or remove items before ordering</span>
          )}
          <span className="fs-5"><strong>Total:</strong> ₹{totalAmount}</span>
        </div>
        <Button variant="success" className="w-100" size="lg" onClick={submitOrder}
          disabled={!items.length}
        >
          Place Order
        </Button>
      </Card.Body>
    </Card>
  );
};

export default OrderForm;
