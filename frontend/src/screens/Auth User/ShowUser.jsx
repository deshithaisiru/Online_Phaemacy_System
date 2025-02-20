import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button } from '../../components/button';
import { jsPDF } from "jspdf";
import "jspdf-autotable";

const ShowUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState({
    name: '',
    email: '',
    userType: '',
    mobile: '',
    height: 0,
    weight: 0,
    birthday: '',
    address: '',
    isAdmin: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    axios.get(`/api/users/specific/${id}`)
      .then(response => {
        setUser(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching user:', error);
        setError('Failed to fetch user data');
        setLoading(false);
      });
  }, [id]);

  const calculateBMI = (weight, height) => {
    const heightInMeters = height / 100;
    const bmi = weight / (heightInMeters * heightInMeters);
    return bmi.toFixed(2);
  };

  const getBMICategory = (bmi) => {
    if (bmi < 18.5) return "Underweight";
    if (bmi < 25) return "Normal weight";
    if (bmi < 30) return "Overweight";
    return "Obese";
  };

  const calculateAge = (birthday) => {
    const birthDate = new Date(birthday);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const userBMI = calculateBMI(user.weight, user.height);
  const bmiCategory = getBMICategory(userBMI);
  const age = calculateAge(user.birthday);

  const downloadPDF = () => {
    const doc = new jsPDF();
    
    // Get current date and time
    const generatedDate = new Date().toLocaleString();
    
    // Add enhanced header
    doc.setFillColor(204, 204, 0); // Darker yellow color
    doc.rect(0, 0, 210, 20, "F"); // Slightly larger header
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.text("AuraFitness", 105, 15, null, null, "center");
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(12);
    doc.text("Your Health, Our Priority", 105, 26, null, null, "center"); // Sub-header
  
    // Add title for the document
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(22);
    doc.text(`Client Details - ${user.name}`, 105, 50, null, null, "center");
  
    // Add generated date
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Generated on: ${generatedDate}`, 20, 40);
  
    // Line separator below title
    doc.setDrawColor(52, 152, 219);
    doc.line(20, 55, 190, 55);
  
    // Table data
    const tableColumn = [
      { content: "Field", styles: { fillColor: [204, 204, 0], textColor: [0, 0, 0] } }, // Yellow color for field column
      { content: "Value", styles: { fillColor: [240, 240, 240], textColor: [0, 0, 0] } }
    ];
  
    const tableRows = [
      ["Name", user.name],
      ["Email", user.email],
      ["User Type", user.userType],
      ["Mobile", user.mobile],
      ["Address", user.address],
      ["Height", `${user.height} cm`],
      ["Weight", `${user.weight} kg`],
      ["BMI", `${userBMI} (${bmiCategory})`],
      ["Birthday", user.birthday],
      ["Age", `${age} years`],
      ["Is Admin", user.isAdmin ? "Yes" : "No"],
    ];
  
    doc.autoTable({
      startY: 60,
      head: [tableColumn.map(col => col.content)], // Column names
      body: tableRows,
      headStyles: { fillColor: [204, 204, 0], textColor: [0, 0, 0] }, // Darker yellow for the field column
      alternateRowStyles: { fillColor: [255, 255, 204] }, // Lighter yellow for alternate rows
      margin: { top: 60, bottom: 40 },
      columnStyles: {
        1: { fillColor: [255, 255, 255] } // Values column with white
      }
    });
  
    // Add enhanced footer
    const pageCount = doc.internal.getNumberOfPages();
    doc.setFontSize(10);
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setTextColor(150);
  
      // Page number
      doc.text(
        `Page ${i} of ${pageCount}`,
        105,
        doc.internal.pageSize.height - 15,
        null,
        null,
        "center"
      );
  
      // Footer tagline
      doc.setFontSize(12);
      doc.text(
        "AuraFitness - Achieve Your Best Self!",
        105,
        doc.internal.pageSize.height - 10,
        null,
        null,
        "center"
      );
    }
  
    // Save the PDF
    doc.save(`${user.name}_details.pdf`);
  };
  

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-yellow-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat py-28"
      style={{
        backgroundImage: "url('https://www.health.com/thmb/dqUTTgNgfLBbUnQGzKYo7KNQ7pU=/2119x0/filters:no_upscale():max_bytes(150000):strip_icc()/BuildMuscleLoseFat-98e3bb453daf4049aeb72b3841ca2d0a.jpg')",
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        backgroundBlend: 'overlay'
      }}
    >
      <div className="relative w-full max-w-4xl px-8 py-12 m-4 backdrop-blur-sm bg-black/40 rounded-2xl shadow-2xl border border-yellow-500/20">
        <div className="absolute -top-14 left-1/2 transform -translate-x-1/2">
          <div className="w-28 h-28 bg-yellow-500 rounded-full flex items-center justify-center shadow-lg">
            <span className="text-4xl">👤</span>
          </div>
        </div>

        <h4 className="text-4xl font-bold text-center text-white mt-10 mb-2">
          User Details
        </h4>
        
        <p className="text-lg font-normal text-center text-yellow-100/80 mb-8">
          View user information in the Gym Management System
        </p>

        {error && (
          <div className="bg-red-500/20 border border-red-500/30 text-red-100 px-4 py-3 rounded-lg mb-6">
            <strong className="font-bold">Error: </strong>
            <span>{error}</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {[
            { label: "Name", value: user.name },
            { label: "Email", value: user.email },
            { label: "User Type", value: user.userType },
            { label: "Mobile Number", value: user.mobile },
            { label: "Address", value: user.address },
            { label: "Height", value: `${user.height} cm` },
            { label: "Weight", value: `${user.weight} kg` },
            { label: "BMI", value: `${userBMI} (${bmiCategory})` },
            { label: "Birthday", value: user.birthday },
            { label: "Age", value: `${age} years` },
            { label: "Admin Status", value: user.isAdmin ? "Yes" : "No" }
          ].map((item, index) => (
            <div key={index} className="space-y-1">
              <label className="text-yellow-100/80 text-sm">{item.label}</label>
              <div className="w-full px-4 py-3 bg-white/10 border border-yellow-500/30 rounded-lg text-white">
                {item.value}
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => navigate('/admin-dashboard')}
            className="w-full px-4 py-3 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg font-semibold transition-all hover:shadow-lg hover:shadow-yellow-500/30"
          >
            Back to Dashboard
          </button>
          <button
            onClick={downloadPDF}
            className="w-full px-4 py-3 bg-transparent border border-yellow-500/30 hover:bg-yellow-500/10 text-yellow-100/80 rounded-lg font-semibold transition-all"
          >
            Download PDF
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShowUser;