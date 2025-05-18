import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetAllUsersQuery, useDeleteUserByIdMutation } from '../../slices/usersApiSlice';
import { FaSpinner } from 'react-icons/fa';
import { toast } from 'react-toastify';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const CustomerManagement = () => {
  const navigate = useNavigate();
  const { data: users, isLoading, error, refetch } = useGetAllUsersQuery();
  const [deleteUser] = useDeleteUserByIdMutation();

  const handleEdit = (userId) => {
    navigate(`/admin/customers/edit/${userId}`);
  };

  const handleDelete = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await deleteUser(userId).unwrap();
        toast.success('User deleted successfully');
        refetch();
      } catch (err) {
        toast.error(err?.data?.message || 'Failed to delete user');
      }
    }
  };

  const handleAddNew = () => {
    navigate('/admin/customers/add');
  };

  const generatePDF = () => {
    try {
      // Create new PDF document
      const doc = new jsPDF();
      
      // Add title
      doc.setFontSize(18);
      doc.text('Customer List Report', 14, 20);
      doc.setFontSize(11);
      doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);

      // Prepare the data for the table
      const tableData = users?.map(user => [
        user.name,
        user.email,
        user.mobile,
        user.isAdmin ? 'Admin' : 'Customer'
      ]) || [];

      // Define the table columns
      const tableColumns = [
        'Name',
        'Email',
        'Phone',
        'Status'
      ];

      // Add the table to the PDF
      autoTable(doc, {
        head: [tableColumns],
        body: tableData,
        startY: 40,
        theme: 'grid',
        styles: {
          fontSize: 10,
          cellPadding: 3,
          overflow: 'linebreak',
        },
        headStyles: {
          fillColor: [41, 98, 255],
          textColor: [255, 255, 255],
          fontStyle: 'bold',
        },
      });

      // Save the PDF
      doc.save('customer-list.pdf');
      toast.success('PDF generated successfully!');
    } catch (error) {
      console.error('PDF generation error:', error);
      toast.error('Failed to generate PDF');
    }
  };

  return (
    <div className="min-h-screen p-8 bg-gray-100">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Customer Management</h1>
        
        {/* Customer List Section */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Customer List</h2>
            <div className="flex gap-4">
              <button 
                onClick={generatePDF}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
              >
                Generate PDF
              </button>
              <button 
                onClick={handleAddNew}
                className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 transition-colors"
              >
                Add New Customer
              </button>
            </div>
          </div>
          
          {/* Placeholder for customer table */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {isLoading ? (
                  <tr>
                    <td colSpan="5" className="text-center py-4">
                      <FaSpinner className="animate-spin inline-block mr-2" />
                      Loading users...
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan="5" className="text-center py-4 text-red-500">
                      Error: {error?.data?.message || 'Failed to load users'}
                    </td>
                  </tr>
                ) : users?.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center py-4">
                      No users found
                    </td>
                  </tr>
                ) : (
                  users?.map((user) => (
                    <tr key={user._id}>
                      <td className="px-6 py-4 whitespace-nowrap">{user.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{user.mobile || 'N/A'}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.isAdmin ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'}`}>
                          {user.isAdmin ? 'Admin' : 'Customer'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button 
                          onClick={() => handleEdit(user._id)} 
                          className="text-indigo-600 hover:text-indigo-900 mr-3 transition-colors"
                        >
                          Edit
                        </button>
                        <button 
                          onClick={() => handleDelete(user._id)}
                          className="text-red-600 hover:text-red-900 transition-colors"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerManagement;
