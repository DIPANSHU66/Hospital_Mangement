import React, { useState, useRef, useEffect } from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import axios from "axios";

const Departments = () => {
  const [selectedDept, setSelectedDept] = useState(null);
  const [info, setInfo] = useState("");
  const [loading, setLoading] = useState(false);
  const infoRef = useRef(null);

  const departmentarray = [
    { name: "Pediatrics", imageUrl: "https://th.bing.com/th/id/OIP.do7dnHgk77T6mHkQHb0p1gHaGC?w=231&h=188" },
    { name: "Orthopedics", imageUrl: "https://th.bing.com/th/id/OIP.MZ6TMW8wqUzW3_hVqUMTvAHaDt?w=305&h=175" },
    { name: "Cardiology", imageUrl: "https://th.bing.com/th/id/OIP.ANz5opDPE4kZrAoJENrH7gHaFm?w=229&h=180" },
    { name: "Neurology", imageUrl: "https://th.bing.com/th/id/OIP.Ouyp8GzI0T36Y2wMqBgh6wHaE8?w=251&h=180" },
    { name: "Oncology", imageUrl: "https://th.bing.com/th/id/OIP.BvrcXwPOQeY65KUjTmEvKgHaE8?w=260&h=180" },
    { name: "ENT", imageUrl: "https://thumbayhospital.com/ajman/wp-content/uploads/sites/2/2017/05/ent.jpg" },
    { name: "Dermatology", imageUrl: "https://th.bing.com/th/id/OIP.sUNLXe4MNe5D66v8wBe7RwHaE8?w=246&h=180" },
    { name: "Physical Therapy", imageUrl: "https://th.bing.com/th/id/OIP.u9TnIxyQkEP6qQXAJqh-FAHaFY?w=243&h=180" },
    { name: "Gastroenterology", imageUrl: "https://th.bing.com/th/id/OIP.FGBUgCd0Hj_0zc1RjkkBnQHaEH?w=300&h=180" },
    { name: "Endocrinology", imageUrl: "https://th.bing.com/th/id/OIP.ftCXlSz6SekWOzVJ2D8uKgHaD8?w=295&h=180" },
    { name: "Pulmonology", imageUrl: "https://th.bing.com/th/id/OIP.IUe1YhZFxquHcxaXA6lyNQHaEK?w=312&h=180" },
    { name: "Hematology", imageUrl: "https://th.bing.com/th?id=OIP.InSmXTlGsTmIbbSpHXN-WgHaHa&w=250&h=250" },
  ];

  const responsive = {
    extraLarge: { breakpoint: { max: 3000, min: 1324 }, items: 5 },
    large: { breakpoint: { max: 1324, min: 1005 }, items: 3 },
    medium: { breakpoint: { max: 1005, min: 700 }, items: 2 },
    small: { breakpoint: { max: 700, min: 0 }, items: 1 },
  };

  const fetchDepartmentInfo = async (name) => {
    setSelectedDept(name);
    setInfo("");
    setLoading(true);
    try {
      const res = await axios.get(
        `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(name)}`
      );
      setInfo(res.data.extract || "No summary found.");
    } catch (err) {
      setInfo("Error fetching information.");
    } finally {
      setLoading(false);
    }
  };

 
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (infoRef.current && !infoRef.current.contains(event.target)) {
        setSelectedDept(null);
        setInfo("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <section className="w-full py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-center text-indigo-600 mb-8">
          Our Departments
        </h2>
        <Carousel
          responsive={responsive}
          removeArrowOnDeviceType={["tablet", "mobile"]}
          infinite
          autoPlay
          autoPlaySpeed={2500}
        >
          {departmentarray.map((depart, index) => (
            <div
              key={index}
              onClick={(e) => {
                e.stopPropagation(); // Prevent event bubbling
                fetchDepartmentInfo(depart.name);
              }}
              className="cursor-pointer mx-2 bg-white border border-gray-200 rounded-xl shadow hover:shadow-md transition duration-300 overflow-hidden"
            >
              <img
                src={depart.imageUrl}
                alt={depart.name}
                className="w-full h-44 object-cover"
              />
              <div className="text-center py-3 px-2">
                <h3 className="text-lg font-semibold text-gray-800">
                  {depart.name}
                </h3>
              </div>
            </div>
          ))}
        </Carousel>

        {selectedDept && (
          <div
            ref={infoRef}
            className="mt-10 bg-white border rounded-lg shadow p-6 w-full"
          >
            <h3 className="text-2xl font-bold text-indigo-700 mb-2">
              {selectedDept}
            </h3>
            {loading ? (
              <p className="text-gray-500">Loading info...</p>
            ) : (
              <p className="text-gray-700 w-full">{info}</p>
            )}
            <a
              href={`https://www.google.com/search?q=${encodeURIComponent(selectedDept)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-4 bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition"
            >
              Search on Google
            </a>
          </div>
        )}
      </div>
    </section>
  );
};

export default Departments;
