import React from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import "../App.css";
const Departments = () => {
  const departmentarray = [
    {
      name: "Pediatrics",
      imageUrl:
        "https://th.bing.com/th/id/OIP.do7dnHgk77T6mHkQHb0p1gHaGC?w=231&h=188&c=7&r=0&o=5&dpr=1.5&pid=1.7",
    },
    {
      name: "Orthopedics",
      imageUrl:
        "https://th.bing.com/th/id/OIP.MZ6TMW8wqUzW3_hVqUMTvAHaDt?w=305&h=175&c=7&r=0&o=5&pid=1.7",
    },
    {
      name: "Cardiology",
      imageUrl:
        "https://th.bing.com/th/id/OIP.ANz5opDPE4kZrAoJENrH7gHaFm?w=229&h=180&c=7&r=0&o=5&dpr=1.5&pid=1.7",
    },
    {
      name: "Neurology",
      imageUrl:
        "https://th.bing.com/th/id/OIP.Ouyp8GzI0T36Y2wMqBgh6wHaE8?w=251&h=180&c=7&r=0&o=5&pid=1.7",
    },
    {
      name: "Oncology",
      imageUrl:
        "https://th.bing.com/th/id/OIP.BvrcXwPOQeY65KUjTmEvKgHaE8?w=260&h=180&c=7&r=0&o=5&pid=1.7",
    },
    {
      name: "ENT",
      imageUrl:
        "https://www.bing.com/images/search?view=detailV2&ccid=8xryZPxy&id=DD4568F9BC53FEC9B9B733381CA685A46E2D6CDB&thid=OIP.8xryZPxyClwloFUXjBvHrwHaD8&mediaurl=https%3a%2f%2fthumbayhospital.com%2fajman%2fwp-content%2fuploads%2fsites%2f2%2f2017%2f05%2fent.jpg&exph=463&expw=870&q=ENT+hosspital&simid=608028634070271153&FORM=IRPRST&ck=246DBADF2D6B1DB12A2ED5A6F4F9B667&selectedIndex=6&itb=0",
    },
    {
      name: "Dermatology",
      imageUrl:
        "https://th.bing.com/th/id/OIP.sUNLXe4MNe5D66v8wBe7RwHaE8?w=246&h=180&c=7&r=0&o=5&pid=1.7",
    },
    {
      name: "Physical Therapy",
      imageUrl:
        "https://th.bing.com/th/id/OIP.u9TnIxyQkEP6qQXAJqh-FAHaFY?w=243&h=180&c=7&r=0&o=5&pid=1.7",
    },
    {
      name: "Gastroenterology",
      imageUrl:
        "https://th.bing.com/th/id/OIP.FGBUgCd0Hj_0zc1RjkkBnQHaEH?w=300&h=180&c=7&r=0&o=5&pid=1.7",
    },
    {
      name: "Endocrinology",
      imageUrl:
        "https://th.bing.com/th/id/OIP.ftCXlSz6SekWOzVJ2D8uKgHaD8?w=295&h=180&c=7&r=0&o=5&dpr=1.5&pid=1.7",
    },
    {
      name: "Pulmonology",
      imageUrl:
        "https://th.bing.com/th/id/OIP.IUe1YhZFxquHcxaXA6lyNQHaEK?w=312&h=180&c=7&r=0&o=5&pid=1.7",
    },
    {
      name: "Hematology",
      imageUrl:
        "https://th.bing.com/th?id=OIP.InSmXTlGsTmIbbSpHXN-WgHaHa&w=250&h=250&c=8&rs=1&qlt=90&o=6&dpr=1.5&pid=3.1&rm=2",
    },
  ];

  const responsive = {
    extraLarge: {
      // the naming can be any, depends on you.
      breakpoint: { max: 3000, min: 1324 },
      items: 5,
      slidesToSlide: 1,
    },
    large: {
      breakpoint: { max: 1324, min: 1005 },
      items: 3,
      slidesToSlide: 1,
    },
    medium: {
      breakpoint: { max: 1005, min: 700 },
      items: 2,
      slidesToSlide: 1,
    },
    small: {
      breakpoint: { max: 700, min: 0 },
      items: 1,
      slidesToSlide: 1,
    },
  };
  return (
    <>
      <div className="container departments">
        <h2>Departments</h2>
        <Carousel
          responsive={responsive}
          removeArrowOnDeviceType={["tablet", "mobile"]}
        >
          {departmentarray.map((depart, index) => {
            return (
              <div className="card" key={index}>
                <div className="depart-name">{depart.name}</div>
                <img src={depart.imageUrl} alt="" />
              </div>
            );
          })}
        </Carousel>
      </div>
    </>
  );
};

export default Departments;
