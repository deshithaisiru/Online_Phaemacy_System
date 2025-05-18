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
import { NotificationProvider } from './components/CustomNotification';
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

//Inventory Management
import Store from "./screens/Inventory/main.jsx";
import Cart from "./screens/Inventory/Cart.jsx";
import Inventory from "./screens/Inventory/StoreM.jsx";
import AddInventory from "./screens/Inventory/Addnewproduct.jsx";
import UpdateItem from "./screens/Inventory/update.jsx";
import Details from "./screens/Inventory/details.jsx";

// Employee Screens
import EmployeeList from './screens/Employee/EmployeeList';
import AddEmployee from './screens/Employee/AddEmployee';
import EditEmployee from './screens/Employee/EditEmployee';
import EmployeeDetails from './screens/Employee/EmployeeDetails';

// Employee Admin Dashboard Screens
import EmpAdminDashboard from './screens/Dashboard/AdminDashboard';

// Layout Components
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';

// Attendance Screens
import AttendanceList from './screens/Attendance/AttendanceList';
import MarkAttendance from './screens/Attendance/MarkAttendance';

// Payroll Screens
import PayrollList from './screens/Payroll/PayrollList';
import ProcessPayroll from './screens/Payroll/ProcessPayroll';
import PayrollReport from './screens/Payroll/PayrollReport';

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
        <Route path="/admin/inventory" element={<Inventory />} />
        <Route path="/admin/prescriptions" element={<div>Prescription Management</div>} />
        <Route path="/admin/orders" element={<div>Order Management</div>} />
        <Route path="/admin/suppliers" element={<div>Supplier Management</div>} />
        <Route path="/admin/payments" element={<div>Payment History</div>} />
        <Route path="/admin/reports" element={<div>Reports & Analytics</div>} />
        <Route path="/admin/support" element={<div>Support Tickets</div>} />

        {/* Inventory Management Routes */}
        <Route path="/products" element={<Store />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/details/:itemId" element={<Details />} />
        <Route path="/add-inventory" element={<AddInventory />} />
        <Route path="/update/:Id" element={<UpdateItem />} />
      </Route>


      {/* Employee Routes */}
          {/* Admin Dashboard Route */}
          <Route
            path="/admin/employees"
            element={
              <div className="flex h-screen bg-gray-100">
                <Sidebar />
                <div className="flex-1 flex flex-col overflow-hidden">
                  <EmpAdminDashboard />
                </div>
              </div>
            }
          />
          <Route
            path="/employees"
            element={
              <div className="flex h-screen bg-gray-100">
                <Sidebar />
                <div className="flex-1 flex flex-col overflow-hidden">
                  <EmployeeList />
                </div>
              </div>
            }
          />
          <Route
            path="/employees/add"
            element={
              <div className="flex h-screen bg-gray-100">
                <Sidebar />
                <div className="flex-1 flex flex-col overflow-hidden">
                  <AddEmployee />
                </div>
              </div>
            }
          />
          <Route
            path="/employees/edit/:id"
            element={
              <div className="flex h-screen bg-gray-100">
                <Sidebar />
                <div className="flex-1 flex flex-col overflow-hidden">
                  <EditEmployee />
                </div>
              </div>
            }
          />
          <Route
            path="/employees/:id"
            element={
              <div className="flex h-screen bg-gray-100">
                <Sidebar />
                <div className="flex-1 flex flex-col overflow-hidden">
                  <EmployeeDetails />
                </div>
              </div>
            }
          />
          
          {/* Attendance Routes */}
          <Route
            path="/attendance"
            element={
              <div className="flex h-screen bg-gray-100">
                <Sidebar />
                <div className="flex-1 flex flex-col overflow-hidden">
                  <AttendanceList />
                </div>
              </div>
            }
          />
          <Route
            path="/attendance/mark"
            element={
              <div className="flex h-screen bg-gray-100">
                <Sidebar />
                <div className="flex-1 flex flex-col overflow-hidden">
                  <MarkAttendance />
                </div>
              </div>
            }
          />
          
          {/* Payroll Routes */}
          <Route
            path="/payroll"
            element={
              <div className="flex h-screen bg-gray-100">
                <Sidebar />
                <div className="flex-1 flex flex-col overflow-hidden">
                  <PayrollList />
                </div>
              </div>
            }
          />
          <Route
            path="/payroll/process"
            element={
              <div className="flex h-screen bg-gray-100">
                <Sidebar />
                <div className="flex-1 flex flex-col overflow-hidden">
                  <ProcessPayroll />
                </div>
              </div>
            }
          />
          <Route
            path="/payroll/report"
            element={
              <div className="flex h-screen bg-gray-100">
                <Sidebar />
                <div className="flex-1 flex flex-col overflow-hidden">
                  <PayrollReport />
                </div>
              </div>
            }
          />
        





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
      <NotificationProvider>
        <RouterProvider router={router} />
      </NotificationProvider>
    </React.StrictMode>
  </Provider>
);
