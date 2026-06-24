import { useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import React, { useContext, useState } from "react";
import axios from "axios";
import { AppContext } from "../context/AppContextValue";
import { toast } from "react-toastify";

const ResetPassword = () => {
  axios.defaults.withCredentials = true;
  const navigate = useNavigate();
  const { backendUrl } = useContext(AppContext);

  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [isOtpSubmited, setIsOtpSubmited] = useState(false);





  const inputRefs = React.useRef([]);

  const handleInput = (e, index) => {
    if (e.target.value.length > 0 && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1].focus();
    }
  };
  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && e.target.value === "" && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    const paste = e.clipboardData.getData("text");
    const pasteArray = paste.split("");

    pasteArray.forEach((char, index) => {
      if (inputRefs.current[index]) {
        inputRefs.current[index].value = char;
      }
    });
  };

  const verifyOtpOnSubmit = (e) => {
    e.preventDefault();

    const otpArray = inputRefs.current.map((input) => input.value);
    const otpValue = otpArray.join("");

    if (otpValue.length !== 6) {
      toast.error("Please enter the 6 digit OTP");
      return;
    }

    setOtp(otpValue);
    setIsOtpSubmited(true);
  };

  const onSubmitEmail = async(e)=>{
    e.preventDefault();

    try {
      const { data } = await axios.post(
        backendUrl + '/api/auth/send-resetOtp-password',
        { email },
      );

      data.success ? toast.success(data.message) : toast.error(data.message);
      data.success && setIsEmailSent(true);
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  }

  const onSubmitNewPassword = async (e) => {
    e.preventDefault();

    try {
      const { data } = await axios.post(
        backendUrl + '/api/auth/verify-resetOtp',
        { email, otp, newPassword },
      );

      if (data.success) {
        toast.success(data.message);
        navigate("/login");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-6 sm:px-0 bg-linear-to-b from-blue-200 to-purple-400">
      <img
        onClick={() => navigate("/")}
        src={assets.logo}
        className="absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer"
        alt=""
      />

      {!isEmailSent && 
      <form onSubmit={onSubmitEmail} className="flex flex-col items-center justify-center bg-slate-900 p-10 rounded-xl shadow-sm w-full sm:w-96 text-indigo-300">
        <h2 className="text-3xl font-semibold text-white text-center mb-3">
          Resset Password
        </h2>
        <p className="text-sm mb-6">
          
            Enter your register email adress
        </p>
        <div className="flex items-center  bg-black text-white p-2 rounded-full gap-4 text-lg mb-4 w-70">
          <img className="px-2" src={assets.mail_icon} alt="" />
          <input
            onChange={(e) => setEmail(e.target.value)}
            className="outline-none bg-transparent"
            type="text"
            name="email"
            id=""
            value={email}
            placeholder="Email"
            required
          />
        </div>
        <button className="bg-blue-300 rounded-full p-3 w-40 text-black text-shadow-md font-semibold mb-3">
           Submit
          </button>
      </form>}


      {!isOtpSubmited && isEmailSent && <form
        onSubmit={verifyOtpOnSubmit}
        className="flex flex-col items-center justify-center bg-slate-900 p-8 rounded-lg w-96 text-sm"
      >
        <h1 className="text-3xl font-semibold text-white text-center mb-3">
          Resset Password OTP
        </h1>
        <p className="text-sm mb-6 text-white">
          Enter the 6 digit code sent to your email id
        </p>

        <div className="flex justify-between mb-8 gap-2" onPaste={handlePaste}>
          {Array(6)
            .fill(0)
            .map((_, index) => (
              <input
                type="text"
                maxLength="1"
                key={index}
                name=""
                id=""
                required
                className="w-12 h-12 bg-[#333A5C] text-white text-center text-xl rounded-md outline-none"
                ref={(e) => (inputRefs.current[index] = e)}
                onInput={(e) => handleInput(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
              />
            ))}
        </div>

        <button className="w-full py-2.5 bg-linear-to-r from-indigo-500 to-indigo-900 text-white rounded-full">
          Verify Email
        </button>
      </form>}


      {isOtpSubmited && isEmailSent && <form onSubmit={onSubmitNewPassword} className="flex flex-col items-center justify-center bg-slate-900 p-10 rounded-xl shadow-sm w-full sm:w-96 text-indigo-300">
        <h2 className="text-3xl font-semibold text-white text-center mb-3">
          New Password
        </h2>
        <p className="text-sm mb-6">
          
            Enter your new Password
        </p>
        <div className="flex items-center  bg-black text-white p-2 rounded-full gap-4 text-lg mb-4 w-70">
          <img className="px-2" src={assets.mail_icon} alt="" />
          <input
            onChange={(e) => setNewPassword(e.target.value)}
            className="outline-none bg-transparent"
            type="password"
            name="newPassword"
            id=""
            value={newPassword}
            placeholder="New Password"
            required
          />
        </div>
        <button className="bg-blue-300 rounded-full p-3 w-40 text-black text-shadow-md font-semibold mb-3">
           Submit
          </button>
      </form>}


    </div>
  );
};

export default ResetPassword;
