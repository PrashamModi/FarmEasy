import React, { useEffect, useState } from "react";
import { message } from "antd";
import { Link, useNavigate } from "react-router-dom";
import Divider from "../../components/Divider";
import { LoginUser } from "../../api/users";
import { useDispatch } from "react-redux";
import { SetLoader } from "../../redux/loadersSlice";
import "./login.css"

const Login = () => {
  const [user, setUser] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(SetLoader(true));
      const response = await LoginUser(user);
      dispatch(SetLoader(false));
      if (response.success) {
        message.success(response.message);
        localStorage.setItem("token", response.data);
        window.location.href = "/";
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      dispatch(SetLoader(false));
      message.error(error.message);
    }
  };

  const handleInput = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate("/");
    }
  });

  return (
    <div className="h-screen bg-primary flex justify-center items-center">
      <div className="bg-black p-5 rounded w-[450px] wrapper">
        <h1 className="text-primary text-2xl mb-5">
          FarmEasy - <span className="text-gray-400 text-2xl">LOGIN</span>
        </h1>
        <Divider />

        <form action="" onSubmit={handleSubmit} className="text-white">
          <div>
            <label htmlFor="email">Email:</label>
            <input
              type="text"
              name="email"
              id="email"
              placeholder="Email"
              value={user.email}
              onChange={handleInput}
              className="m-5"
            />
          </div>
          <div>
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              name="password"
              id="password"
              placeholder="Password"
              value={user.password}
              onChange={handleInput}
              className="m-5"
            />
          </div>
          <button type="submit">Login</button>
        </form>
        <div className="mt-5 text-center">
          <span style={{ color: "white" }} className="text-gray-500">
            Don't have an account ?{" "}
            <Link to="/register" className="text-primary">
              Register
            </Link>
          </span>
        </div>
      </div>
    </div>
  );
};

export default Login;
