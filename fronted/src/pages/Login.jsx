import { useContext, useState } from "react";
import { assets } from "../assets/assets";
import {useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContextValue";
import { toast } from "react-toastify";
import axios from "axios";

const Login = () => {
  const navigate = useNavigate();

  const { backendUrl, setIsLoggedIn, getUserData } = useContext(AppContext);

  const [state, setState] = useState("Sign Up");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const OnSubmitHandler = async (e) => {
    e.preventDefault();

    try {
      if (state === "Sign Up") {
        const { data } = await axios.post(backendUrl + "/api/auth/register", {
          name,
          email,
          password,
        }, {
          withCredentials: true,
        });

        if (data.success) {
          setIsLoggedIn(true);
          await getUserData(); 
          navigate("/");
        } else {
          toast.error(data.message);
        }
      } else {
        const { data } = await axios.post(backendUrl + "/api/auth/login", {
          email,
          password,
        }, {
          withCredentials: true,
        });

        if (data.success) {
          setIsLoggedIn(true);
          await getUserData();
          navigate("/");
        } else {
          toast.error(data.message);
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6 sm:px-0 bg-linear-to-b from-blue-200 to-purple-400">
      <img
        onClick={() => navigate("/")}
        src={assets.logo}
        className="absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer"
        alt=""
      />

      <div className="flex flex-col items-center justify-center bg-slate-900 p-10 rounded-xl shadow-sm w-full sm:w-96 text-indigo-300">
        <h2 className="text-3xl font-semibold text-white text-center mb-3">
          {state === "Sign Up" ? "Create account" : "Login"}
        </h2>
        <p className="text-sm mb-6">
          {state === "Sign Up"
            ? "Create your account"
            : "Login to your Account"}
        </p>

        <form onSubmit={OnSubmitHandler}>
          {state === "Sign Up" && (
            <div className="flex items-center  bg-black text-white p-2 rounded-full gap-4 text-lg mb-4 w-70">
              <img className="px-1" src={assets.person_icon} alt="" />
              <input
                onChange={(e) => setName(e.target.value)}
                className="outline-none bg-transparent"
                type="text"
                name="full name"
                id=""
                value={name}
                placeholder="Full Name"
                required
              />
            </div>
          )}

          <div className="flex items-center  bg-black text-white p-2 rounded-full gap-4 text-lg mb-4">
            <img className="px-1" src={assets.mail_icon} alt="" />
            <input
              onChange={(e) => setEmail(e.target.value)}
              className="outline-none bg-transparent "
              type="email"
              name="email"
              id=""
              value={email}
              placeholder="Email Id"
              required
            />
          </div>

          <div className="flex items-center  bg-black text-white p-2 rounded-full gap-4 text-lg mb-4">
            <img className="px-1" src={assets.lock_icon} alt="" />
            <input
              onChange={(e) => setPassword(e.target.value)}
              className="outline-none bg-transparent"
              type="password"
              name="password"
              id=""
              value={password}
              placeholder="Password"
              required
            />
          </div>
          <p
            onClick={() => navigate("/reset-password")}
            className="mb-4 text-indigo-300 cursor-pointer text-sm"
          >
            Forgot Password?
          </p>
          <button className="bg-blue-300 rounded-full p-3 w-40 text-black text-shadow-md font-semibold mb-3">
            {state}
          </button>
        </form>

        {state === "Sign Up" ? (
          <p className="text-gray-400 mt-4 text-sm text-center">
            already have an account?{" "}
            <span
              onClick={() => setState("Login")}
              className="text-blue-400 cursor-pointer underline"
            >
              Login here
            </span>
          </p>
        ) : (
          <p className="text-gray-400 mt-4 text-sm text-center">
            Don't have an account?{" "}
            <span
              onClick={() => setState("Sign Up")}
              className="text-blue-400 cursor-pointer underline"
            >
              Sign Up
            </span>
          </p>
        )}
      </div>
    </div>
  );
};

export default Login;
