import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useNotification } from '../../components/CustomNotification';
import { FaArrowLeft, FaFilePdf, FaSearch } from 'react-icons/fa';
import { jsPDF } from 'jspdf';

const PayrollReport = () => {
  const navigate = useNavigate();
  const { notifySuccess, notifyError, notifyInfo } = useNotification();
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [payPeriods, setPayPeriods] = useState([]);
  const [selectedPeriod, setSelectedPeriod] = useState('');
  const [report, setReport] = useState(null);
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    const fetchPayPeriods = async () => {
      try {
        setLoading(true);
        const res = await axios.get('http://localhost:5001/api/payroll');
        
        // Extract unique pay periods
        const periods = [...new Set(res.data.map(record => record.payPeriod))];
        periods.sort().reverse(); // Sort in descending order (newest first)
        
        setPayPeriods(periods);
        if (periods.length > 0) {
          setSelectedPeriod(periods[0]); // Select the most recent period by default
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching pay periods:', error);
        notifyError('Failed to fetch pay periods');
        setLoading(false);
      }
    };

    // Fetch employees data
    const fetchEmployees = async () => {
      try {
        setLoading(true);
        const res = await axios.get('http://localhost:5001/api/employees');
        setEmployees(res.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching employees:', error);
        notifyError('Failed to fetch employees');
        setLoading(false);
      }
    };

    fetchPayPeriods();
    fetchEmployees(); // Fetch employees when component mounts
  }, []);

  const generateReport = async () => {
    if (!selectedPeriod) {
      notifyError('Please select a pay period');
      return;
    }

    try {
      setGenerating(true);
      
      // Check if employees data is available
      if (employees.length === 0) {
        // Try to fetch employees again if not available
        try {
          const employeesRes = await axios.get('http://localhost:5001/api/employees');
          setEmployees(employeesRes.data);
        } catch (error) {
          console.error('Error fetching employees:', error);
          notifyError('Failed to fetch employees data');
          setGenerating(false);
          return;
        }
      }
      
      const res = await axios.get(`http://localhost:5001/api/payroll/report/${selectedPeriod}`);
      
      // Enrich the report data with employee information if needed
      if (res.data && res.data.records) {
        // Map employee IDs to ensure we have employee names and roles
        const enrichedRecords = res.data.records.map(record => {
          // If the record already has employeeName and role, use those
          if (record.employeeName && record.role) {
            return record;
          }
          
          // Otherwise, find the employee in our employees array
          const employee = employees.find(emp => emp._id === record.employeeId || emp.employeeId === record.employeeId);
          
          return {
            ...record,
            employeeName: employee ? `${employee.firstName} ${employee.lastName}` : 'Unknown Employee',
            role: employee ? employee.role || employee.position || 'N/A' : 'N/A'
          };
        });
        
        setReport({
          ...res.data,
          records: enrichedRecords,
          employeeCount: enrichedRecords.length
        });
      } else {
        setReport(res.data);
      }
      
      setGenerating(false);
    } catch (error) {
      console.error('Error generating report:', error);
      notifyError('Failed to generate report');
      setGenerating(false);
    }
  };

  const downloadPDF = () => {
    if (!report) return;

    try {
      // Initialize jsPDF in landscape mode
      const doc = new jsPDF({ orientation: 'landscape' });
      // Add title and metadata at the top of the PDF
      doc.setFontSize(18);
      doc.text('Payroll Report', 14, 22);
      doc.setFontSize(12);
      doc.text(`Pay Period: ${selectedPeriod}`, 14, 30);
      doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 36);
      doc.text(`Total Employees: ${report.employeeCount}`, 14, 42);
      
      // Set up table headers for landscape
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.text('Emp ID', 14, 55);
      doc.text('Name', 34, 55);
      doc.text('Role', 74, 55);
      doc.text('Basic', 104, 55);
      doc.text('Bonus', 134, 55);
      doc.text('EPF', 164, 55);
      doc.text('ETF', 194, 55);
      doc.text('Net Salary', 224, 55);
      
      // Draw header line
      doc.setLineWidth(0.1);
      doc.line(14, 57, 270, 57);
      
      // Add employee data
      doc.setFont('helvetica', 'normal');
      let y = 63;
      
      report.records.forEach((record, index) => {
        if (index % 2 === 0) {
          doc.setFillColor(245, 245, 245);
          doc.rect(14, y - 4, 220, 6, 'F');
        }
        const bonus = record.bonus || 0;
        const netSalary = record.basicSalary - record.epfDeduction + bonus;
        doc.text(record.employeeId.toString(), 14, y);
        doc.text(record.employeeName, 34, y);
        doc.text(record.role, 74, y);
        doc.text('Rs ' + record.basicSalary.toFixed(2), 104, y);
        doc.text('Rs ' + bonus.toFixed(2), 134, y);
        doc.text('Rs ' + record.epfDeduction.toFixed(2), 164, y);
        doc.text('Rs ' + record.etfDeduction.toFixed(2), 194, y);
        doc.text('Rs ' + netSalary.toFixed(2), 224, y);
        y += 8;
        if (y > 190) {
          doc.addPage();
          y = 20;
          doc.setFont('helvetica', 'bold');
          doc.text('Emp ID', 14, y);
          doc.text('Name', 34, y);
          doc.text('Role', 74, y);
          doc.text('Basic', 104, y);
          doc.text('Bonus', 134, y);
          doc.text('EPF', 164, y);
          doc.text('ETF', 194, y);
          doc.text('Net Salary', 224, y);
          doc.line(14, y + 2, 270, y + 2);
          doc.setFont('helvetica', 'normal');
          y += 8;
        }
      });
      // Add totals row
      doc.setFillColor(220, 220, 220);
      doc.rect(14, y - 4, 220, 6, 'F');
      doc.setFont('helvetica', 'bold');
      doc.text('Total', 14, y);
      doc.text('Rs ' + report.totals.totalBasicSalary.toFixed(2), 104, y);
      doc.text('Rs ' + report.totals.totalBonus.toFixed(2), 134, y);
      doc.text('Rs ' + report.totals.totalEpfDeduction.toFixed(2), 164, y);
      doc.text('Rs ' + report.totals.totalEtfDeduction.toFixed(2), 194, y);
      doc.text('Rs ' + (report.totals.totalBasicSalary - report.totals.totalEpfDeduction + report.totals.totalBonus).toFixed(2), 224, y);
      
      // Add footer
      const pageCount = doc.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.text(
          `Page ${i} of ${pageCount} - Pharmacy POS Employee Management System`,
          doc.internal.pageSize.width / 2,
          doc.internal.pageSize.height - 10,
          { align: 'center' }
        );
      }
      
      // Save the PDF
      doc.save(`Payroll_Report_${selectedPeriod}.pdf`);
      
      notifySuccess('PDF report downloaded successfully');
    } catch (error) {
      console.error('Error generating PDF:', error);
      notifyError('Failed to generate PDF report');
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto mt-16">
      <div className="flex items-center mb-6">
        <button
          onClick={() => navigate('/payroll')}
          className="mr-4 text-gray-600 hover:text-gray-900"
        >
          <FaArrowLeft />
        </button>
        <h1 className="text-3xl font-bold text-gray-800">Payroll Summary Report</h1>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select Pay Period
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400" />
              </div>
              <select
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-primary-500"
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                disabled={loading || payPeriods.length === 0}
              >
                {payPeriods.length === 0 ? (
                  <option value="">No pay periods available</option>
                ) : (
                  payPeriods.map((period) => (
                    <option key={period} value={period}>
                      {period}
                    </option>
                  ))
                )}
              </select>
            </div>
          </div>
          <div className="flex items-end">
            <button
              onClick={generateReport}
              className="w-full px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 flex items-center justify-center"
              disabled={loading || generating || !selectedPeriod}
            >
              {generating ? 'Generating...' : 'Generate Report'}
            </button>
          </div>
        </div>
      </div>

      {report && (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold text-gray-800">
                  Payroll Summary for {selectedPeriod}
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Generated on: {new Date(report.generatedAt).toLocaleDateString()} | 
                  Total Employees: {report.employeeCount}
                </p>
              </div>
              <button
                onClick={downloadPDF}
                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                <FaFilePdf className="mr-2" /> Download PDF
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Employee ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Employee Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Basic Salary
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Bonus
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    EPF
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ETF
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Net Salary
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {report.records.map((record) => (
                  <tr key={record.employeeId}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {record.employeeId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {record.employeeName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {record.role}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      Rs{record.basicSalary.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      Rs{record.bonus ? record.bonus.toFixed(2) : '0.00'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      Rs{record.epfDeduction.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      Rs{record.etfDeduction.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      Rs{(record.basicSalary - record.epfDeduction + (record.bonus || 0)).toFixed(2)}
                    </td>
                  </tr>
                ))}
                {/* Totals row */}
                <tr className="bg-gray-50 font-bold">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900" colSpan={3}>
                    Total
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    Rs{report.totals.totalBasicSalary.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    Rs{report.totals.totalBonus.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    Rs{report.totals.totalEpfDeduction.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    Rs{report.totals.totalEtfDeduction.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    Rs{(report.totals.totalBasicSalary - report.totals.totalEpfDeduction + report.totals.totalBonus).toFixed(2)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default PayrollReport;
