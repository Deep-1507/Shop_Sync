import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import axios from 'axios';
import { useSnackbar } from 'notistack';
import { useNavigate } from "react-router-dom";
import { CustomButton } from "../components/CustomButton";
import { Inputbox } from "../components/Inputbox";
import './AuthContainer.css';


const AuthContainer = () => {
  const [firstName, setFirstname] = useState("");
  const [lastName, setLastname] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const handleSignup = async () => {
    try {
      const response = await axios.post(
        "http://localhost:3000/api/v1/user/signup",
        {
          username,
          firstName,
          lastName,
          password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      enqueueSnackbar("Signup successful", { variant: "success" });
      setTimeout(() => {
        navigate("/dashboard");
      }, 1000);
    } catch (err) {
      setError("Failed to sign up.");
    }
  };

  const handleSignin = async () => {
    try {
      const response = await axios.post(
        "http://localhost:3000/api/v1/user/signin",
        {
          username,
          password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      enqueueSnackbar("Signin successful", { variant: "success" });
      setTimeout(() => {
        navigate("/dashboard");
      }, 1000);
    } catch (err) {
      setError("Failed to sign in.");
    }
  };

  function SwitchContent(){
    const content = document.getElementById('content');
    const registerBtn =  document.getElementById('register');
    const loginBtn =  document.getElementById('login');

    registerBtn.addEventListener('click', () =>{
      content.classList.add("active")
    });
    loginBtn.addEventListener('click', () =>{
      content.classList.remove("active")
    });
  }

  return (
    <div className='flex items-center justify-center h-screen bg-walmartBlue bg-opacity-15'>
    <div className="content justify-content-center shadow-lg flex body" id='content'>
        {/* Sign Up Form */}
        <div className="m-5 w-1/2 ">
        <form className=" ">
          <div className=" ">
          <div className="flex items-center justify-center text-black text-4xl font-bold mb-10">
          ShopSync.
        </div>
            <h2 className=" text-xl font-semibold text-center">Create Account</h2>
          </div>
        
            {error && <div className="error-message">{error}</div>}
            <Inputbox
              label={"Username"}
              placeholder={"name@gmail.com"}
              onChange={(e) => setUsername(e.target.value)}
            />
            <div className="w-full flex justify-between items-center space-x-8">
              <Inputbox
                label={"First Name"}
                placeholder={"First name"}
                onChange={(e) => setFirstname(e.target.value)}
              />
              <Inputbox
                label={"Last Name"}
                placeholder={"Last name"}
                onChange={(e) => setLastname(e.target.value)}
              />
            </div>
            <Inputbox
              label={"Password"}
              placeholder={"Password"}
              onChange={(e) => setPassword(e.target.value)}
            />
            <CustomButton label={"Create Account"} onClick={handleSignup} />
          </form>
        </div>

        {/* Sign In Form */}
        <div className=" m-5 w-1/2">
        <form className=" ">
          <div className=" ">
          <div className="flex items-center justify-center text-black text-4xl font-bold mb-10">
          ShopSync.
        </div>
            <h2 className=" text-xl font-semibold text-center">Sign in</h2>
           
          </div>
        
            {error && <div className="error-message">{error}</div>}
            <Inputbox
              label={"Username"}
              placeholder={"name@gmail.com"}
              onChange={(e) => setUsername(e.target.value)}
            />
            <Inputbox
              label={"Password"}
              placeholder={"Password"}
              onChange={(e) => setPassword(e.target.value)}
            />

            <CustomButton label={"Login"} onClick={handleSignin} />
          </form>
        </div>


<div className='switch-content'>
  <div class="shape-overlay"></div>
  <div className='switch'>
    <div className='switch-panel switch-left'>
      <h1 className='flex justify-center text-2xl font-bold'>Hello, Again!</h1>
      <p className='flex justify-center m-3'>Enter your details and start your journey with us.</p>
      <button className='btn text-white w-50 fs-6 border-white border-2' id='login' onClick={SwitchContent}>Login</button>
    </div>

    <div className='switch-panel switch-right'>
      <h1 className='flex justify-center text-2xl font-bold'>Welcome!</h1>
      <p className='flex justify-center m-3'>To keep connected with us, please login with your personal info.</p>
      <button className='btn border-white text-white w-50 fs-6' id='register' onClick={SwitchContent}>Register</button>
    </div>
  </div>
</div>


    </div>
    </div>
  );
};

export default AuthContainer;
