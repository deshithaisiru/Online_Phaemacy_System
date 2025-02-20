import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import jsPDF from "jspdf";
import "jspdf-autotable";

export default function ManageEmp() {
  const [info, setInfo] = useState([]);
  const [DId, setFormId] = useState("");
  const [filter, setFilter] = useState([]);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const fetchInfo = async () => {
      try {
        const res = await fetch(`/api/reco/pgetall`);
        const data = await res.json();
        if (res.ok) {
          setInfo(data.equipment);
          setFilter(data.equipment);
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    fetchInfo();
  }, []);

  const handleDeleteUser = async () => {
    try {
      const res = await fetch(`/api/reco/prodelete/${DId}`, { method: "DELETE" });
      if (res.ok) {
        setInfo((prev) => prev.filter((employee) => employee._id !== DId));
        alert("Deleted successfully");
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    if (query.trim() === "") {
      setFilter([...info]);
    } else {
      const filteredData = info.filter((employee) =>
        employee.packname && employee.packname.toLowerCase().includes(query.toLowerCase())
      );
      setFilter(filteredData);
    }
  }, [query, info]);

  const generatePDF = () => {
    const doc = new jsPDF();
    const tableColumn = ["Package Name", "Details", "Price", "Validity"];
    const tableRows = filter.map((item) => [
      item.packname,
      item.details,
      item.price,
      item.validity,
    ]);

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      styles: { fontSize: 10 },
      theme: "grid",
    });
    doc.save("promo_packages.pdf");
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section */}
      <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <img
          src="https://images.pexels.com/photos/1552242/pexels-photo-1552242.jpeg"
          alt="Banner"
          className="absolute inset-0 w-full h-full object-cover opacity-50 transform scale-105 hover:scale-100 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70"></div>
        
        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 py-12">
          <h1 className="text-6xl font-extrabold text-white mb-6 tracking-tight text-center">
            Welcome to <span className="text-yellow-500">Our Packages</span>
          </h1>
          <p className="text-2xl text-gray-200 mb-12 font-light text-center">
            Explore our premium fitness packages and start your journey
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-12">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search Package..."
              className="w-full px-6 py-4 bg-white/5 backdrop-blur-lg rounded-xl border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:border-yellow-500/50 transition duration-300"
            />
          </div>

          {/* Package Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filter.length > 0 ? (
              filter.map((employee) => (
                <div
                  key={employee._id}
                  className="group bg-white/5 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/10 hover:border-yellow-500/50 transform hover:scale-105 hover:bg-white/10 transition duration-500 ease-in-out overflow-hidden"
                >
                  <div className="relative h-48">
                    <img
                      src="https://images.pexels.com/photos/3289711/pexels-photo-3289711.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                      alt="Package"
                      className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                  </div>
                  
                  <div className="p-8">
                    <h3 className="text-3xl font-bold text-white mb-4">{employee.packname}</h3>
                    <p className="text-gray-300 mb-6 font-light">{employee.details}</p>
                    <div className="flex items-center justify-between">
                      <div className="bg-yellow-500 px-6 py-2 rounded-xl">
                        <span className="text-2xl font-bold text-black">Rs.{employee.price}</span>
                      </div>
                      <Link
                        to={`/join-now`}
                        state={{ promo: employee }}
                        className="bg-white/10 hover:bg-yellow-500 px-6 py-2 rounded-xl text-white hover:text-black transition duration-300"
                      >
                        Join Now
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center">
                <p className="text-2xl text-gray-400 font-light">No packages available</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}