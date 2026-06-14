import React from "react";
import { useSelector } from "react-redux";
import Hero from "./Hero";
import Biography from "./Biography";
import MessageForm from "./MessageForm";
import Departments from "./Departments";

const Home = () => {
  const user = useSelector((state) => state.auth.user);
  console.log(user);
  return (
    <>
      <Hero
        title={`Welcome to Dipanshu Medical Institute${
          user?.firstname ? `, ${user.firstname}` : ""
        } | Your Trusted Healthcare Provider`}
        imageUrl="https://th.bing.com/th/id/OIP.YdeYgj5nF35VuMit64pv-AAAAA?w=182&h=342&c=7&r=0&o=5&dpr=1.5&pid=1.7"
      />

      <Biography imageurl="https://th.bing.com/th/id/OIP.17Q8ZXS87lDJxaDTh9DQQQHaFN?w=268&h=188&c=7&r=0&o=5&dpr=1.5&pid=1.7" />
      <Departments />
      <MessageForm />
    </>
  );
};

export default Home;
