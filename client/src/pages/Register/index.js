import React, { useEffect, useState } from "react";
import {  message } from "antd";
import { Link, useNavigate } from "react-router-dom";
import Divider from "../../components/Divider";
import { RegisterUser } from "../../api/users";
import { useDispatch } from "react-redux";
import {SetLoader} from "../../redux/loadersSlice"


const Register = () => { 

  const [user, setUser] = useState({
    name : "",
    email : "",
    password : ""
  })
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(SetLoader(true));
      const response = await RegisterUser(user);
      dispatch(SetLoader(false));
      if(response.success){
        message.success(response.message);
        navigate("/");
      } else{
        throw new Error(response.message);
      }
    } catch (error) {
      dispatch(SetLoader(false));
      message.error(error.message)
    }
  };

  const handleInput = (e) => {
    setUser({ ...user, [e.target.name] : e.target.value})
  }

  useEffect(()=>{
    if(localStorage.getItem("token")){
      navigate("/");
    }
  }, [])



  return (
    <div className="h-screen bg-primary flex justify-center items-center">
      <div className="bg-black p-5 rounded w-[450px]">
        <h1 className="text-primary text-2xl mb-5">
          FarmEasy - <span className="text-gray-400 text-2xl">REGISTER</span>
        </h1>
        <Divider />

        <form action="" onSubmit={handleSubmit} className="text-white">
          <div>
            <label htmlFor="name">UserName:</label>
            <input type="text" name="name" id="name" placeholder="UserName" value={user.name} onChange={handleInput} className="m-5" required/>
          </div>
          <div>
            <label htmlFor="email">Email:</label>
            <input type="text" name="email" id="email" placeholder="Email" value={user.email} onChange={handleInput} className="m-5"/>
          </div>
          <div>
            <label htmlFor="password">Password:</label>
            <input type="password" name="password" id="password" placeholder="Password" value={user.password} onChange={handleInput} className="m-5"/>
          </div>
          <button type="submit">Register</button>
        </form>
        <div className="mt-5 text-center">
          <span style={{ color: "white" }} className="text-gray-500">
            Already have an account ?{" "}
            <Link to="/login" className="text-primary">
              Login
            </Link>
          </span>
        </div>
      </div>
    </div>
  );
};

export default Register;
