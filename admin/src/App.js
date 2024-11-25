// src/App.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import AddProduct from './pages/AddProduct';
import AllProducts from './pages/AllProducts';
import Orders from './pages/Orders';
import { ToastContainer } from 'react-toastify';
import UpdateProduct from './pages/UpdateProduct';
import Login from './pages/Login';

function App() {
  return (
    <div className="App">
      <Routes>

        <Route path="/admin" element={<Dashboard />}>
          <Route path="add" element={<AddProduct />} />
          <Route path="update/:id" element={<UpdateProduct />} />
          <Route path="products" element={<AllProducts />} />
          <Route path="orders" element={<Orders />} />
        </Route>
        <Route path="/" element={<Login />} />
      </Routes>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      
      <ToastContainer />
    </div>
  );
}

export default App;
