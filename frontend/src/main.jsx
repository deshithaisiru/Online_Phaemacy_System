import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import "./index.css"; // Ensure Tailwind CSS is imported here
import store from "./store";
import { Provider } from "react-redux";
import HomeScreen from "./screens/HomeScreen";
import LoginScreen from "./screens/LoginScreen.jsx";
import RegisterScreen from "./screens/RegisterScreen.jsx";
import ProfileScreen from "./screens/ProfileScreen.jsx";
import PrivateRoute from "./components/PrivateRoute.jsx";
import AdminDashboard from "./screens/AdminDashboard.jsx";
import EditUser from "./screens/Auth User/EditUser.jsx";
import DeleteUser from "./screens/Auth User/DeleteUser.jsx";
import CreateUser from "./screens/Auth User/CreateUser.jsx";
import ShowUser from "./screens/Auth User/ShowUser.jsx";
import ForgotPasswordScreen from "./screens/ForgotPasswordScreen.jsx";
import ResetPasswordScreen from "./screens/ResetPasswordScreen";
import CustomerDashboard from "./screens/CustomerDashboard.jsx";
import CustomerManagement from "./screens/admin/CustomerManagement.jsx";
import EditCustomer from "./screens/admin/EditCustomer.jsx";
import AddCustomer from "./screens/admin/AddCustomer.jsx";
import NotFound from "./components/NotFound";

// Create the router with routes
const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route index element={<HomeScreen />} />
      <Route path="/login" element={<LoginScreen />} />
      <Route path="/forgot-password" element={<ForgotPasswordScreen />} />
      <Route path="/reset-password/:token" element={<ResetPasswordScreen />} />
      <Route path="/register" element={<RegisterScreen />} />
      <Route path="/users/edit/:id" element={<EditUser />} />
      <Route path="/users/delete/:id" element={<DeleteUser />} />
      <Route path="/users/view/:id" element={<ShowUser />} />
      <Route path="/users/create" element={<CreateUser />} />
      <Route element={<PrivateRoute />}>
        <Route path="/profile" element={<ProfileScreen />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/customer-dashboard" element={<CustomerDashboard />} />
        
        {/* Admin Routes */}
        <Route path="/admin/customers" element={<CustomerManagement />} />
        <Route path="/admin/customers/edit/:id" element={<EditCustomer />} />
        <Route path="/admin/customers/add" element={<AddCustomer />} />
        <Route path="/admin/inventory" element={<div>Inventory Management</div>} />
        <Route path="/admin/prescriptions" element={<div>Prescription Management</div>} />
        <Route path="/admin/orders" element={<div>Order Management</div>} />
        <Route path="/admin/suppliers" element={<div>Supplier Management</div>} />
        <Route path="/admin/payments" element={<div>Payment History</div>} />
        <Route path="/admin/reports" element={<div>Reports & Analytics</div>} />
        <Route path="/admin/support" element={<div>Support Tickets</div>} />
      </Route>
      {/* Wildcard route to handle undefined routes */}
      <Route path="*" element={<NotFound />} />
    </Route>
  )
);

console.log("Starting to render application...");


// Render the app with Redux provider and RouterProvider
ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>
  </Provider>
);
