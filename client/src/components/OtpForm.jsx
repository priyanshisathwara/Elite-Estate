import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import styles from "./OTP.module.css"; 


const OtpFrom = () => {
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [timer, setTimer] = useState(60);
  const [isResendDisabled, setIsResendDisabled] = useState(true);
  const { email } = useParams();

  const navigate = useNavigate();

  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else {
      setIsResendDisabled(false);
    }

    return () => clearInterval(interval);
  }, [timer]);

  const handleChange = (index, value) => {
    if (isNaN(value)) return; // Allow only numbers

    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1); // Only last digit
    setOtp(newOtp);

    if (index < 3 && value) {
      document.getElementById(`otp-${index + 1}`).focus();
    }
  };

  const handleVerify = () => {
    const enteredOTP = otp.join("");
    if (enteredOTP.length < 4) {
      toast.error("Please enter 4 digit")
      return;
    }

    axios.post('http://localhost:8000/api/auth/verify-otp', { enteredOTP, email })
      .then((res => {
        console.log("respaonse :", res.data)
        if (res?.data?.error) {
          toast.error(res?.data?.error);
        }
        if (res?.data?.message) {
          toast.success(res?.data?.message);
          setTimeout(() => navigate("/reset-password-form"), 1000);
        }
      }))
      .catch((error) => {
        toast.error("Verification failed. Please try again.");
      });

  };

  const handleResendOTP = () => {
    setOtp(["", "", "", ""]);
    setTimer(60);
    setIsResendDisabled(true);

    axios
      .post("http://localhost:8000/api/auth/resend-otp", { email })
      .then((res) => {
        if (res?.data?.error) {
          toast.error(res?.data?.error);
        } else {
          toast.success(res?.data?.message || "New OTP sent successfully.");
        }
      })
      .catch((error) => {
        toast.error("Failed to resend OTP. Please try again.");
        setIsResendDisabled(false);
      });
  };

  return (
    <div className={styles.otpContainer}>
    <div className={styles.otpCard}>
        <h3 className={styles.otpTitle}>Enter OTP</h3>

        <div className={styles.otpInputContainer}>
            {otp.map((digit, index) => (
                <input
                    key={index}
                    id={`otp-${index}`}
                    type="text"
                    value={digit}
                    onChange={(e) => handleChange(index, e.target.value)}
                    maxLength={1}
                    className={styles.otpBox}
                />
            ))}
        </div>

        <button onClick={handleVerify} className={styles.otpBtn}>Verify OTP</button>

        <p className={styles.otpTimer}>
            {timer > 0
                ? `Resend OTP in 00:${timer < 10 ? `0${timer}` : timer}`
                : "Time out!"}
        </p>

        <button
            onClick={handleResendOTP}
            className={styles.otpResendBtn}
            disabled={isResendDisabled}
        >
            Resend OTP
        </button>
        <ToastContainer /> 
    </div>
</div>
  );
};

export default OtpFrom;
