import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import NavBar from './components/navbar';
import Home from './components/home';
import ViewMore from './components/viewmore';
import Add from './components/Add';
import Update from './components/update';
import Login from './components/Login';
import Register from './components/Register';
import OrderForm from './components/OrderForm';
import Cart from './components/Cart';

// Admin only route protection wrapper
function AdminRoute({ children }) {
  const role = localStorage.getItem('role');
  if (role !== 'admin') {
    return <Navigate to="/login" />;
  }
  return children;
}

function App() {
  return (
    <>
      <NavBar />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/View_More/:id' element={<ViewMore />} />
        <Route path='/order' element={<OrderForm />} />
        
        {/* Admin only routes */}
        <Route path='/add' element={
          <AdminRoute>
            <Add />
          </AdminRoute>
        } />
        <Route path='/update/:id' element={
          <AdminRoute>
            <Update />
          </AdminRoute>
        } />

        {/* Public */}
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path="/cart" element={<Cart />} />
      </Routes>
    </>
  );
}

export default App;
