import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import axios from "axios";
import { Icon } from "@iconify/react";
import { CustomButton } from "../components/CustomButton";
import { Inputbox } from "../components/Inputbox";
import "./AuthContainer.css";

const StoreAuth = () => {
  const [isSignup, setIsSignup] = useState(true);
  const [firstName, setFirstname] = useState("");
  const [lastName, setLastname] = useState("");
  const [username, setUsername] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [country, setCountry] = useState("");
  const [locationCoord, setLocationCoord] = useState("");
  const [uid, setUid] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  // Function to get user's location
  const getLocation = async () => {
    if (!navigator.geolocation) {
      enqueueSnackbar("Geolocation is not supported by your browser.", { variant: "error" });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );
          const data = await response.json();
          console.log(data)
          setLocationCoord(data);
        } catch (error) {
          enqueueSnackbar("Failed to fetch location details.", { variant: "error" });
        }
      },
      (error) => {
        enqueueSnackbar("Location access denied. Please enter manually.", { variant: "warning" });
      }
    );
  };

  const handleSignup = async () => {
    try {
      const response = await axios.post(
        "http://localhost:3000/api/v1/stores/signup",
        { username, firstName, lastName, password, city, state, country,locationCoord },
        { headers: { "Content-Type": "application/json" } }
      );

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      enqueueSnackbar("Signup successful", { variant: "success" });
      setTimeout(() => navigate("/store-dashboard"), 1000);
    } catch (err) {
      setError("Failed to sign up.");
    }
  };

  const handleSignin = async () => {
    try {
      const response = await axios.post("http://localhost:3000/api/v1/stores/signin", { uid, username, password });

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      enqueueSnackbar("Signin successful", { variant: "success" });
      setTimeout(() => navigate("/store-dashboard"), 1000);
    } catch (err) {
      setError("Failed to sign in.");
    }
  };

  useEffect(() => {
    getLocation(); // Fetch location when component mounts
  }, []);

  function SwitchContent() {
    const content = document.getElementById("content");
    const registerBtn = document.getElementById("register");
    const loginBtn = document.getElementById("login");

    registerBtn.addEventListener("click", () => content.classList.add("active"));
    loginBtn.addEventListener("click", () => content.classList.remove("active"));
  }

  return (
    <div className="flex items-center justify-center h-screen bg-walmartBlue bg-opacity-15">
      <div className="content justify-content-center shadow-lg flex body" id="content">
        {/* Sign Up Form */}
        <div className="m-5 w-1/2">
          <form>
            <div className="text-center">
              <Icon icon="tabler:brand-walmart" width="70" color="#FFC120" />
              <h2 className="text-xl font-semibold">Create a Store</h2>
            </div>

            {error && <div className="error-message">{error}</div>}

            <Inputbox label={"Email"} placeholder={"name@gmail.com"} onChange={(e) => setUsername(e.target.value)} />
            
            {/* Location Input + Button */}
            <div className="flex items-center space-x-2">
              <Inputbox label={"City"} placeholder={"Enter City"} value={location} onChange={(e) => setCity(e.target.value)} />
              <Inputbox label={"State"} placeholder={"Enter State"} value={location} onChange={(e) => setState(e.target.value)} />
            </div>
            <div className="w-full flex items-center">
              <Inputbox label={"Country"} placeholder={"Enter Country"} value={location} onChange={(e) => setCountry(e.target.value)} />
            </div>

            <div className="w-full flex justify-between items-center space-x-8">
              <Inputbox label={"First Name"} placeholder={"First name"} onChange={(e) => setFirstname(e.target.value)} />
              <Inputbox label={"Last Name"} placeholder={"Last name"} onChange={(e) => setLastname(e.target.value)} />
            </div>

            <Inputbox label={"Password"} placeholder={"Password"} onChange={(e) => setPassword(e.target.value)} />

            <CustomButton label={"Create Account"} onClick={handleSignup} />
          </form>
        </div>

        {/* Sign In Form */}
        <div className="m-5 w-1/2">
          <form>
            <div className="text-center">
              <Icon icon="tabler:brand-walmart" width="70" color="#FFC120" />
              <h2 className="text-xl font-semibold">Store Sign in</h2>
            </div>

            {error && <div className="error-message">{error}</div>}

            <Inputbox label={"UID"} placeholder={"Enter your Unique ID"} onChange={(e) => setUid(e.target.value)} />
            <Inputbox label={"Username"} placeholder={"name@gmail.com"} onChange={(e) => setUsername(e.target.value)} />
            <Inputbox label={"Password"} placeholder={"123456"} onChange={(e) => setPassword(e.target.value)} />

            <CustomButton label={"Login"} onClick={handleSignin} />
          </form>
        </div>

        {/* Switch Content */}
        <div className="switch-content">
          <div className="shape-overlay"></div>
          <div className="switch">
            <div className="switch-panel switch-left">
              <h1 className="flex justify-center text-2xl font-bold">Hello, Again!</h1>
              <p className="flex justify-center m-3">Enter your details and start your journey with us.</p>
              <button className="btn text-white border-white border-2" id="login" onClick={SwitchContent}>
                Login
              </button>
            </div>

            <div className="switch-panel switch-right">
              <h1 className="flex justify-center text-2xl font-bold">Welcome!</h1>
              <p className="flex justify-center m-3">To keep connected, please login with your personal info.</p>
              <button className="btn border-white text-white" id="register" onClick={SwitchContent}>
                Register
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoreAuth;