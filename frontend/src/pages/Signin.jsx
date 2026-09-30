import { CustomButton } from "../components/CustomButton";
import { Inputbox } from "../components/Inputbox";
import axios from "axios";
import { Icon } from "@iconify/react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useSnackbar } from "notistack";
import "./Signin.css"; // Ensure you import the CSS file

export const Signin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const handleSignin = async () => {
    try {
      const response = await axios.post(
        "http://localhost:3000/api/v1/user/signin",
        {
          username,
          password,
        }
      );

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      enqueueSnackbar("Signin successful", { variant: "success" });

      setTimeout(() => {
        navigate("/dashboard");
      }, 1000);
    } catch (err) {
      setError(
        "Failed to sign in. Please check your credentials and try again."
      );
    }
  };

  return (
    <div className=" signin-container w-full h-full flex flex-col items-center overflow-auto ">
   
       <div className="logo p-5 w-full flex justify-center">
            <Icon icon="tabler:brand-walmart" width="70" color="#FFC120" />
            </div>
      <div className=" ">
        {/* <img src=" " alt=" " srcset="" /> */}
      </div>

      <div className=" h-full px-24 pt-18 items-center w-2/5">
        <div className="text-xl font-semibold text-center">
        <h1>Welcome Back!</h1>
        </div>
        
        {error && <div className="text-red-500 text-center">{error}</div>}
        <Inputbox
          label={"Username"}
          placeholder={"name@gmail.com"}
          onChange={(e) => setUsername(e.target.value)}
        />
        <Inputbox
          label={"Password"}
          placeholder={"123456"}
          onChange={(e) => setPassword(e.target.value)}
        />

<div className="pt-8">
          <CustomButton label={"Login to your Account"} onClick={handleSignin} />
          <button
            type="button"
            className="w-full h-10 flex justify-center text-black bg-gray-100 border-2 border-black hover:border-4 hover:border-customGreen focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2"
            onClick={() => navigate("/signup")}
          >
            Create an Account
          </button>
        </div>
      </div>
     
<div className="background-svg absolute bottom-0 left-0 w-full h-1/2 overflow-hidden">
        <svg viewBox="0 0 1440 320" fill="#FFC120">
          <path
            d="M0,160L480,80L960,0L1440,160L1440,320L960,240L480,320L0,240Z"
            transform="rotate(180 720 160) translate(0, -160)"
          />
        </svg>
      </div>

      
    </div>
  );
};

