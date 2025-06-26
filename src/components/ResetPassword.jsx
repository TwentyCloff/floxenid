import React, { useEffect, useState } from "react";
import {
  verifyPasswordResetCode,
  confirmPasswordReset,
} from "firebase/auth";
import { auth } from "../config/firebaseConfig";
import { useSearchParams, useNavigate } from "react-router-dom";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [oobCode, setOobCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const code = searchParams.get("oobCode");
    if (!code) {
      navigate("/", { replace: true });
      return;
    }

    setOobCode(code);
    verifyPasswordResetCode(auth, code)
      .then(() => setStatus("valid"))
      .catch(() => {
        setStatus("invalid");
        setMessage("Link reset password tidak valid atau sudah kadaluarsa.");
      });
  }, [searchParams, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword.length < 6) {
      setStatus("error");
      setMessage("Password minimal 6 karakter.");
      return;
    }

    try {
      await confirmPasswordReset(auth, oobCode, newPassword);
      setStatus("success");
      setMessage("Password berhasil direset. Silakan login kembali.");
    } catch (error) {
      setStatus("error");
      setMessage("Terjadi kesalahan saat mereset password.");
    }
  };

  return (
    <div style={{
      maxWidth: "400px",
      margin: "60px auto",
      padding: "20px",
      border: "1px solid #ccc",
      borderRadius: "8px",
      boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
    }}>
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Reset Password</h2>

      {status === "loading" && <p>Mengecek link reset...</p>}
      {status === "invalid" && <p style={{ color: "red", textAlign: "center" }}>{message}</p>}

      {status === "valid" && (
        <form onSubmit={handleSubmit}>
          <label>Password Baru:</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            placeholder="Masukkan password baru"
            style={{
              width: "100%",
              padding: "10px",
              margin: "10px 0",
              border: "1px solid #aaa",
              borderRadius: "4px"
            }}
          />
          <button type="submit" style={{
            width: "100%",
            padding: "12px",
            backgroundColor: "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer"
          }}>
            Reset Password
          </button>
        </form>
      )}

      {(status === "success" || status === "error") && (
        <p style={{
          color: status === "success" ? "green" : "red",
          marginTop: "15px",
          textAlign: "center"
        }}>
          {message}
        </p>
      )}
    </div>
  );
};

export default ResetPassword;
