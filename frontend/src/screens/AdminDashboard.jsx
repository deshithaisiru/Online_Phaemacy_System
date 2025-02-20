import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import {
  MdOutlineAddBox,
  MdEdit,
  MdDelete,
  MdVisibility,
} from "react-icons/md";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showType, setShowType] = useState("table");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterBy, setFilterBy] = useState("name");
  const [filterTab, setFilterTab] = useState("all");
  const [bmiData, setBmiData] = useState([]);
  const [showChart, setShowChart] = useState(false);


  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    axios
      .get("/api/users/all")
      .then((response) => {
        setUsers(response.data);
        setFilteredUsers(response.data);
        calculateBMI(response.data); // Calculate BMI distribution
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
        setLoading(false);
      });
  }, []);

  const calculateBMI = (users) => {
    let underweight = 0;
    let normal = 0;
    let overweight = 0;
    let obesity = 0;

    users.forEach((user) => {
      const heightInMeters = user.height / 100;
      const bmi = user.weight / (heightInMeters * heightInMeters);

      if (bmi < 18.5) {
        underweight++;
      } else if (bmi >= 18.5 && bmi < 24.9) {
        normal++;
      } else if (bmi >= 25 && bmi < 29.9) {
        overweight++;
      } else {
        obesity++;
      }
    });

    setBmiData([
      { name: "Underweight", value: underweight },
      { name: "Normal", value: normal },
      { name: "Overweight", value: overweight },
      { name: "Obesity", value: obesity },
    ]);
  };

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    filterUsers(term, filterTab);
  };

  const handleUpdate = (userId) => {
    navigate(`/users/edit/${userId}`);
  };

  const handleDelete = (userId) => {
    console.log("Delete user with ID:", userId);
    navigate(`/users/delete/${userId}`);
  };

  const handleView = (userId) => {
    navigate(`/users/view/${userId}`);
  };

  const filterUsers = (term, tab) => {
    let filtered = users.filter((user) => {
      if (filterBy === "name") {
        return user.name.toLowerCase().includes(term);
      } else if (filterBy === "email") {
        return user.email.toLowerCase().includes(term);
      } else if (filterBy === "userType") {
        return user.userType.toLowerCase().includes(term);
      }
      return false;
    });

    if (tab === "members") {
      filtered = filtered.filter((user) => user.userType === "Member");
    } else if (tab === "trainers") {
      filtered = filtered.filter((user) => user.userType === "Trainer");
    } else if (tab === "admins") {
      filtered = filtered.filter((user) => user.isAdmin === true);
    }

    setFilteredUsers(filtered);
  };

  const handleFilterTabChange = (tab) => {
    setFilterTab(tab);
    filterUsers(searchTerm, tab);
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;

    // Add header
    doc.setFontSize(18);
    doc.setTextColor(40);
    doc.text("Aura Fitness", pageWidth / 2, 15, { align: "center" });
    
    doc.setFontSize(12);
    doc.text("Cilent's List", pageWidth / 2, 25, { align: "center" });

  
    const currentDate = new Date().toLocaleDateString();
    doc.setFontSize(10);
    doc.text(`Generated on: ${currentDate}`, 14, 35);

    // Table column definition
    const tableColumn = [
      "Name",
      "Email",
      "Address",
      "User Type",
      "Mobile",
      "BMI",
      "Is Admin",
    ];

    // Table rows data
    const tableRows = filteredUsers.map((user) => {
      const bmi =
        user.height && user.weight
          ? (user.weight / (user.height / 100) ** 2).toFixed(2)
          : "N/A";

      return [
        user.name,
        user.email,
        user.address,
        user.userType,
        user.mobile,
        bmi,
        user.isAdmin ? "Yes" : "No",
      ];
    });

    // Add table
    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 40,
      styles: { fontSize: 8 },
      columnStyles: { 0: { cellWidth: 30 }, 1: { cellWidth: 40 } },
      didDrawPage: (data) => {
        // Add footer on each page
        doc.setFontSize(8);
        doc.text(
          "Aura Fitness - Confidential",
          pageWidth / 2,
          pageHeight - 10,
          { align: "center" }
        );
        doc.text(
          `Page ${data.pageNumber} of ${doc.internal.getNumberOfPages()}`,
          pageWidth - 20,
          pageHeight - 10
        );
      },
    });

    doc.save("aura-fitness-user-list.pdf");
  };

  const UserTable = ({ users }) => (
    <table className="min-w-full bg-white/10 backdrop-blur-sm rounded-lg overflow-hidden">
      <thead className="bg-yellow-500/20">
        <tr>
          <th className="py-3 px-4 border-b border-yellow-500/30 text-yellow-100/80">Name</th>
          <th className="py-3 px-4 border-b border-yellow-500/30 text-yellow-100/80">Email</th>
          <th className="py-3 px-4 border-b border-yellow-500/30 text-yellow-100/80">User Type</th>
          <th className="py-3 px-4 border-b border-yellow-500/30 text-yellow-100/80">Mobile</th>
          <th className="py-3 px-4 border-b border-yellow-500/30 text-yellow-100/80">Address</th>
          <th className="py-3 px-4 border-b border-yellow-500/30 text-yellow-100/80">Is Admin</th>
          <th className="py-3 px-4 border-b border-yellow-500/30 text-yellow-100/80">Operations</th>
        </tr>
      </thead>
      <tbody>
        {users.map((user) => (
          <tr key={user._id} className="hover:bg-white/5 transition-all">
            <td className="py-3 px-4 border-b border-yellow-500/30 text-white">{user.name}</td>
            <td className="py-3 px-4 border-b border-yellow-500/30 text-white">{user.email}</td>
            <td className="py-3 px-4 border-b border-yellow-500/30 text-white">{user.userType}</td>
            <td className="py-3 px-4 border-b border-yellow-500/30 text-white">{user.mobile}</td>
            <td className="py-3 px-4 border-b border-yellow-500/30 text-white">{user.address}</td>
            <td className="py-3 px-4 border-b border-yellow-500/30 text-white">
              {user.isAdmin ? "Yes" : "No"}
            </td>
            <td className="py-3 px-4 border-b border-yellow-500/30 flex gap-4">
              <button
                onClick={() => handleView(user._id)}
                className="text-yellow-500 hover:text-yellow-400 transition-all"
              >
                <MdVisibility className="text-2xl" />
              </button>
              <button
                onClick={() => handleUpdate(user._id)}
                className="text-yellow-500 hover:text-yellow-400 transition-all"
              >
                <MdEdit className="text-2xl" />
              </button>
              <button
                onClick={() => handleDelete(user._id)}
                className="text-yellow-500 hover:text-yellow-400 transition-all"
              >
                <MdDelete className="text-2xl" />
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  const UserCard = ({ user }) => (
    <div className="bg-white/10 backdrop-blur-sm border border-yellow-500/30 rounded-lg p-6 mb-4 hover:bg-white/15 transition-all">
      <h3 className="text-xl font-semibold text-white mb-2">{user.name}</h3>
      <p className="text-yellow-100/80 mb-1">{user.email}</p>
      <p className="text-yellow-100/80 mb-1">Type: {user.userType}</p>
      <p className="text-yellow-100/80 mb-1">Mobile: {user.mobile}</p>
      <p className="text-yellow-100/80 mb-1">Address: {user.address}</p>
      <p className="text-yellow-100/80 mb-4">Admin: {user.isAdmin ? "Yes" : "No"}</p>
      <div className="flex gap-4 mt-4">
        <button
          onClick={() => handleView(user._id)}
          className="text-yellow-500 hover:text-yellow-400 transition-all"
        >
          <MdVisibility className="text-2xl" />
        </button>
        <button
          onClick={() => handleUpdate(user._id)}
          className="text-yellow-500 hover:text-yellow-400 transition-all"
        >
          <MdEdit className="text-2xl" />
        </button>
        <button
          onClick={() => handleDelete(user._id)}
          className="text-yellow-500 hover:text-yellow-400 transition-all"
        >
          <MdDelete className="text-2xl" />
        </button>
      </div>
    </div>
  );

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  return (
    <div 
      className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat py-12"
      style={{
        backgroundImage: "url('https://www.health.com/thmb/dqUTTgNgfLBbUnQGzKYo7KNQ7pU=/2119x0/filters:no_upscale():max_bytes(150000):strip_icc()/BuildMuscleLoseFat-98e3bb453daf4049aeb72b3841ca2d0a.jpg')",
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        backgroundBlend: 'overlay'
      }}
    >
      <div className="relative w-full max-w-6xl px-8 py-12 m-4 backdrop-blur-sm bg-black/40 rounded-2xl shadow-2xl border border-yellow-500/20">
        <h1 className="text-4xl font-bold text-center text-white mb-8">
          Aura Fitness Client's List
        </h1>

        <div className="flex justify-center items-center gap-x-4 mb-6">
          <button
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
              showType === "table"
                ? "bg-yellow-500 text-white"
                : "bg-white/10 text-yellow-100/80 hover:bg-yellow-500/10 border border-yellow-500/30"
            }`}
            onClick={() => setShowType("table")}
          >
            Table View
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
              showType === "card"
                ? "bg-yellow-500 text-white"
                : "bg-white/10 text-yellow-100/80 hover:bg-yellow-500/10 border border-yellow-500/30"
            }`}
            onClick={() => setShowType("card")}
          >
            Card View
          </button>
        </div>

        <div className="flex gap-4 mb-6 items-center">
          <select
            value={filterBy}
            onChange={(e) => setFilterBy(e.target.value)}
            className="px-4 py-3 bg-white/10 border border-yellow-500/30 rounded-lg text-white focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition-all"
          >
            <option value="name">Name</option>
            <option value="email">Email</option>
            <option value="userType">User Type</option>
          </select>
          <input
            type="text"
            placeholder={`Search users by ${filterBy}...`}
            value={searchTerm}
            onChange={handleSearch}
            className="w-full px-4 py-3 bg-white/10 border border-yellow-500/30 rounded-lg text-white placeholder-yellow-100/50 focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition-all"
          />
        </div>

        <div className="flex justify-between items-center mb-8">
          <Link to="/users/create">
            <MdOutlineAddBox className="text-yellow-500 text-3xl hover:text-yellow-400 transition-all" />
          </Link>
          <button
            onClick={downloadPDF}
            className="px-4 py-3 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg font-semibold transition-all hover:shadow-lg hover:shadow-yellow-500/30"
          >
            Download PDF
          </button>
        </div>

        <div className="flex justify-center mb-6">
          {["all", "members", "trainers", "admins"].map((tab) => (
            <button
              key={tab}
              className={`px-4 py-2 mx-1 text-sm font-medium rounded-lg transition-all ${
                filterTab === tab
                  ? "bg-yellow-500 text-white"
                  : "bg-white/10 text-yellow-100/80 hover:bg-yellow-500/10 border border-yellow-500/30"
              }`}
              onClick={() => handleFilterTabChange(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center items-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-yellow-500"></div>
          </div>
        ) : (
          <div className="rounded-lg overflow-hidden">
            {showType === "table" ? (
              <UserTable users={filteredUsers} />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
                {filteredUsers.map((user) => (
                  <UserCard key={user._id} user={user} />
                ))}
              </div>
            )}
          </div>
        )}
        
        <div>
          <button
            onClick={() => setShowChart(!showChart)}
            className="w-full px-4 py-3 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg font-semibold transition-all hover:shadow-lg hover:shadow-yellow-500/30 mt-7"
          >
            {showChart ? 'Hide BMI Distribution Chart' : 'Show BMI Distribution Chart'}
          </button>

          {showChart && (
            <>
              <h2 className="text-center text-white text-4xl font-bold mt-12 mb-6">
                BMI Distribution Chart
              </h2>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-yellow-500/30 ">
                <ResponsiveContainer width="100%" height={350}>
                  <PieChart>
                    <Pie
                      data={bmiData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={120}
                      innerRadius={60}
                      label
                    >
                      {bmiData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                          stroke="#fff"
                          strokeWidth={2}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "rgba(0, 0, 0, 0.8)",
                        borderRadius: "8px",
                        border: "1px solid rgba(245, 158, 11, 0.3)",
                        padding: "10px",
                        color: "#fff"
                      }}
                    />
                    <Legend
                      iconSize={10}
                      layout="horizontal"
                      verticalAlign="bottom"
                      align="center"
                      wrapperStyle={{ 
                        paddingTop: "20px",
                        color: "#fff"
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserList;