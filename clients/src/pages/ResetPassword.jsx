import React, { useContext, useState } from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

const ResetPassword = () => {

  const { backendUrl }  = useContext(AppContext)
  axios.defaults.withCredentials = true


  const navigate = useNavigate();
  const inputRefs = React.useRef([]);

  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isEmailSent, setIsEmailSent] = useState("");
  const [otp, setOtp] = useState(0);
  const [isOtpSubmitted, setIsOtpSubmitted] = useState(false);

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

    pasteArray.forEach((val, index) => {
      if (inputRefs.current[index]) {
        inputRefs.current[index].value = val;
      }
    });
  };


  const onSubmitEmail = async (e) =>{
    e.preventDefault();

    try {
      const { data } = await axios.post(backendUrl + '/api/auth/send-reset-otp', {email})
      data.success ? toast.success(data.success) : toast.error(data.message)
      data.success && setIsEmailSent(true)
    } catch (error) {
      toast.error(error.message)
    }
  } 


  // submission of otp
  const onSubmitOTP = async (e) => {
    e.preventDefault();
    const otpArray = inputRefs.current.map(e => e.value)
    setOtp(otpArray.join(""))
    setIsOtpSubmitted(true);
  }



  const onSubmitNewPassword = async (e) => {
    e.preventDefault();

    try {
      const { data } = await axios.post(backendUrl + '/api/auth/reset-password', {email, newPassword, otp})

      if (data.success) {
        toast.success(data.message);
        navigate("/login");
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-200 to-purple-400">
      <img
        onClick={() => navigate("/")}
        className="absolute top-5 left-20 sm:left-20 sm:w-32 cursor-pointer"
        src={assets.logo}
        alt=""
      />

      {!isEmailSent &&

<form onClick={onSubmitEmail} className="bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm">
        <h2 className="text-white text-2xl font-semibold text-center mb-4">
          Reset Password
        </h2>
        <p className="text-center mb-6 text-indigo-300">
          Enter your email address and we'll send you a link to reset your
          password.
        </p>
        <div className="flex items-center bg-[#333A5C] text-white text-xl rounded-full outline-none px-5 py-2.5">
          <img src={assets.mail_icon} alt="" className="w-5 h-5 mr-4" />
          <input
            type="email"
            placeholder="Email id"
            className="bg-transparent outline-none text-white"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <button className="w-full py-2.5 bg-gradient-to-r from-indigo-500 to-indigo-900 text-white rounded-full mt-3">
          Submit
        </button>
      </form>
      }

      

      {/* otp input form */}

      {
        !isOtpSubmitted  && isEmailSent && 

 <form onSubmit={onSubmitOTP} className="bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm">
        <h1 className="text-white text-2xl font-semibold text-center mb-4">
          Reset Password OTP
        </h1>
        <p className="text-center mb-6 text-indigo-300">
          Enter the 6-digit code sent to your email id.
        </p>

        <div className="flex justify-between mb-8" onPaste={handlePaste}>
          {Array(6)
            .fill(0)
            .map((_, index) => (
              <input
                type="text"
                maxLength="1"
                key={index}
                required
                className="w-12 h-12 bg-[#333A5C] text-white text-center text-xl rounded-md focus:border-indigo-400 outline-none"
                ref={(e) => (inputRefs.current[index] = e)}
                onInput={(e) => handleInput(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
              />
            ))}
        </div>
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-indigo-500 to-indigo-900 text-white py-3 rounded-md transition-all"
        >
          Submit
        </button>
      </form>

      }

     

      {/* Enter new password */}

      {
        isOtpSubmitted && isEmailSent &&

 <form onSubmit={onSubmitNewPassword} className="bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm">
        <h2 className="text-white text-2xl font-semibold text-center mb-4">
          New Password
        </h2>
        <p className="text-center mb-6 text-indigo-300">
          Enter the new password below.
        </p>
        <div className="flex items-center bg-[#333A5C] text-white text-xl rounded-full outline-none px-5 py-2.5">
          <img src={assets.lock_icon} alt="" className="w-5 h-5 mr-4" />
          <input
            type="password"
            placeholder="**********"
            className="bg-transparent outline-none text-white"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </div>

        <button className="w-full py-2.5 bg-gradient-to-r from-indigo-500 to-indigo-900 text-white rounded-full mt-3">
          Submit
        </button>
      </form>
      }

      
    </div>
  );
};

export default ResetPassword;
