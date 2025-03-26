import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function PharmacistDashboard() {
  const [orders, setOrders] = useState([]);
  const [medications, setMedications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    // Fetch orders and medications for the pharmacist dashboard
    axios.get('/api/orders/pharmacist')
      .then((response) => setOrders(response.data))
      .catch((error) => console.error('Error fetching orders:', error));

    axios.get('/api/medications')
      .then((response) => setMedications(response.data))
      .catch((error) => console.error('Error fetching medications:', error))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat py-12"
      style={{
        backgroundImage: "url('https://www.example.com/pharmacy-dashboard-image.jpg')",
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        backgroundBlend: 'overlay',
      }}
    >
      <div className="relative w-full max-w-6xl px-8 py-12 m-4 backdrop-blur-sm bg-black/40 rounded-2xl shadow-2xl border border-yellow-500/20">
        <h1 className="text-4xl font-bold text-center text-white mb-8">
          Pharmacist Dashboard - MediCart
        </h1>

        {loading ? (
          <div className="text-center text-white">Loading...</div>
        ) : (
          <div>
            {/* Orders Section */}
            <div className="mb-6">
              <h2 className="text-3xl text-white">Customer Orders</h2>
              <table className="min-w-full bg-white/10 backdrop-blur-sm rounded-lg overflow-hidden">
                <thead className="bg-yellow-500/20">
                  <tr>
                    <th className="py-3 px-4 border-b border-yellow-500/30 text-yellow-100/80">Order ID</th>
                    <th className="py-3 px-4 border-b border-yellow-500/30 text-yellow-100/80">Customer</th>
                    <th className="py-3 px-4 border-b border-yellow-500/30 text-yellow-100/80">Medication</th>
                    <th className="py-3 px-4 border-b border-yellow-500/30 text-yellow-100/80">Status</th>
                    <th className="py-3 px-4 border-b border-yellow-500/30 text-yellow-100/80">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order._id} className="hover:bg-white/5 transition-all">
                      <td className="py-3 px-4 border-b border-yellow-500/30 text-white">{order._id}</td>
                      <td className="py-3 px-4 border-b border-yellow-500/30 text-white">{order.customer.name}</td>
                      <td className="py-3 px-4 border-b border-yellow-500/30 text-white">{order.medication.name}</td>
                      <td className="py-3 px-4 border-b border-yellow-500/30 text-white">{order.status}</td>
                      <td className="py-3 px-4 border-b border-yellow-500/30 flex gap-4">
                        <Link to={`/orders/${order._id}`} className="text-yellow-500 hover:text-yellow-400">
                          View
                        </Link>
                        <Link to={`/orders/fulfill/${order._id}`} className="text-yellow-500 hover:text-yellow-400">
                          Fulfill
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Medications Section */}
            <div className="mb-6">
              <h2 className="text-3xl text-white">Medications Inventory</h2>
              <table className="min-w-full bg-white/10 backdrop-blur-sm rounded-lg overflow-hidden">
                <thead className="bg-yellow-500/20">
                  <tr>
                    <th className="py-3 px-4 border-b border-yellow-500/30 text-yellow-100/80">Medication Name</th>
                    <th className="py-3 px-4 border-b border-yellow-500/30 text-yellow-100/80">Stock</th>
                    <th className="py-3 px-4 border-b border-yellow-500/30 text-yellow-100/80">Price</th>
                    <th className="py-3 px-4 border-b border-yellow-500/30 text-yellow-100/80">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {medications.map((medication) => (
                    <tr key={medication._id} className="hover:bg-white/5 transition-all">
                      <td className="py-3 px-4 border-b border-yellow-500/30 text-white">{medication.name}</td>
                      <td className="py-3 px-4 border-b border-yellow-500/30 text-white">{medication.stock}</td>
                      <td className="py-3 px-4 border-b border-yellow-500/30 text-white">${medication.price}</td>
                      <td className="py-3 px-4 border-b border-yellow-500/30 flex gap-4">
                        <Link to={`/medications/edit/${medication._id}`} className="text-yellow-500 hover:text-yellow-400">
                          Edit
                        </Link>
                        <Link to={`/medications/delete/${medication._id}`} className="text-red-500 hover:text-red-400">
                          Delete
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default PharmacistDashboard;

