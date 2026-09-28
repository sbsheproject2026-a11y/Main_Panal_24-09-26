 
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { createlogin } from "../AllServicesFiles/LoginService";


const Login = () => {
  const navigate = useNavigate();

  const [loginType, setLoginType] = useState("admission");

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loginOptions = {
    admission: {
      buttonName: "Admission Consultant Login",
      heading: "Admission Consultant Login to your account",
      icon: "👨‍💼",
    },
    student: {
      buttonName: "Student Login",
      heading: "Student Login to your account",
      icon: "🎓",
    },
    studyCenter: {
      buttonName: "Study Center Login",
      heading: "Study Center Login to your account",
      icon: "🏫",
    },
  };

  const currentLogin = loginOptions[loginType];

  const changeLoginType = (type) => {
    setLoginType(type);
    setError("");
    setSuccess("");
    setErrors({});
    setFormData({
      email: "",
      password: "",
    });
    setShowPassword(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }

    if (error) {
      setError("");
    }

    if (success) {
      setSuccess("");
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = "Username is required";
    }

    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (loading) {
      return;
    }

    setError("");
    setSuccess("");

    if (!validateForm()) {
      return;
    }

    const cleanEmail = String(
      formData?.email || ""
    ).trim();

    const cleanPassword = String(
      formData?.password || ""
    );

    if (!cleanEmail || !cleanPassword) {
      setError("Username and Password are required.");
      return;
    }

    if (cleanEmail.length > 150) {
      setError("Invalid Username or Password.");
      return;
    }

    if (cleanPassword.length > 200) {
      setError("Invalid Username or Password.");
      return;
    }

    try {
      setLoading(true);

      const loginData = {
        email: cleanEmail,
        password: cleanPassword,
      };

      const result = await createlogin(loginData);

      console.log("LOGIN RESULT:", result);

      if (!result?.success) {
        setError("Invalid Username or Password.");
        return;
      }

      const token =
        typeof result?.token === "string"
          ? result.token.trim()
          : "";

      if (!token) {
        setError("Invalid Username or Password.");
        return;
      }

      let user;

      try {
        user = jwtDecode(token);

        if (!user || typeof user !== "object") {
          throw new Error("Invalid token payload");
        }
      } catch (decodeError) {
        console.error("JWT Decode Error:", decodeError);
        setError("Invalid Username or Password.");
        return;
      }

      if (user?.exp) {
        const currentTime = Math.floor(Date.now() / 1000);

        if (Number(user.exp) <= currentTime) {
          setError(
            "Login session has expired. Please login again."
          );
          return;
        }
      }

      const roleId =
        user?.RoleId ??
        user?.roleId ??
        user?.role_id ??
        user?.RoleID ??
        user?.role ??
        user?.Role ??
        user?.[
          "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
        ];

      const userId =
        user?.UserId ??
        user?.userId ??
        user?.user_id ??
        user?.UserID ??
        user?.Id ??
        user?.id ??
        user?.[
          "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
        ];

      const loggedUsername =
        user?.Email ??
        user?.email ??
        user?.Username ??
        user?.username ??
        user?.UserName ??
        user?.userName ??
        user?.[
          "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"
        ];

      const name =
        user?.Name ??
        user?.name ??
        user?.FullName ??
        user?.fullName ??
        "";

      const currentRoleId = String(roleId ?? "").trim();

      const currentUserId = String(userId ?? "").trim();

      const currentUsername = String(
        loggedUsername || cleanEmail
      ).trim();

      const currentName = String(
        name || currentUsername
      ).trim();

      if (
        !currentRoleId ||
        !currentUserId ||
        !currentUsername
      ) {
        console.error(
          "MISSING LOGIN INFORMATION:",
          {
            roleId: currentRoleId,
            userId: currentUserId,
            username: currentUsername,
          }
        );

        setError(
          "Invalid user information received from server."
        );

        return;
      }

      const allowedRoles = ["5", "6", "7", "90"];

      if (!allowedRoles.includes(currentRoleId)) {
        console.error(
          "UNAUTHORIZED ROLE:",
          currentRoleId
        );

        localStorage.removeItem("token");
        localStorage.removeItem("Token");
        localStorage.removeItem("name");
        localStorage.removeItem("RoleId");
        localStorage.removeItem("UserId");
        localStorage.removeItem("Username");
        localStorage.removeItem("LoginType");
        localStorage.removeItem("LoginTypeName");
        localStorage.removeItem("lastActivity");

        setError(
          "You are not authorized to access this application."
        );

        return;
      }

      localStorage.setItem("token", token);
      localStorage.setItem("Token", token);
      localStorage.setItem("name", currentName);
      localStorage.setItem("RoleId", currentRoleId);
      localStorage.setItem("UserId", currentUserId);
      localStorage.setItem("Username", currentUsername);
      localStorage.setItem("LoginType", loginType);
      localStorage.setItem(
        "LoginTypeName",
        currentLogin.buttonName
      );
      localStorage.setItem(
        "lastActivity",
        String(Date.now())
      );

      setFormData({
        email: "",
        password: "",
      });

      setErrors({});
      setShowPassword(false);

      setTimeout(() => {
        if (currentRoleId === "5") {
          navigate("/dashboard", {
            replace: true,
          });
          return;
        }

        if (
          currentRoleId === "6" ||
          currentRoleId === "90"
        ) {
          navigate("/employee-dashboard", {
            replace: true,
          });
          return;
        }

        if (currentRoleId === "7") {
          navigate("/student-dashboard", {
            replace: true,
          });
          return;
        }

        localStorage.removeItem("token");
        localStorage.removeItem("Token");
        localStorage.removeItem("name");
        localStorage.removeItem("RoleId");
        localStorage.removeItem("UserId");
        localStorage.removeItem("Username");
        localStorage.removeItem("LoginType");
        localStorage.removeItem("LoginTypeName");
        localStorage.removeItem("lastActivity");

        setSuccess("");

        setError(
          "You are not authorized to access this application."
        );
      }, 700);
    } catch (error) {
      console.error("LOGIN ERROR:", error);

      let message =
        "Invalid Username or Password.";

      if (error?.response?.status === 401) {
        message =
          "Invalid Username or Password.";
      } else if (error?.response?.status === 403) {
        message =
          "You are not authorized to login.";
      } else if (error?.response?.status === 429) {
        message =
          "Too many login attempts. Please try again later.";
      } else if (error?.response?.data) {
        const responseData =
          error.response.data;

        if (typeof responseData === "string") {
          message =
            "Unable to login. Please check your credentials.";
        } else {
          message =
            responseData?.message ||
            responseData?.Message ||
            "Unable to login. Please try again.";
        }
      }

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const ApplyButtons = ({ mobile = false }) => {
    return (
      <div
        className={
          mobile
            ? "apply-links mobile-apply-links"
            : "apply-links desktop-apply-links"
        }
      >
        <button
          type="button"
          className="apply-card"
          onClick={() =>
            navigate("/acc-apply")
          }
        >
          <div className="apply-card-icon acc-icon">
            👨‍💼
          </div>

          <div className="apply-card-content">
            <strong>
              Admission Consultant Registration
            </strong>

            <span>
              Admission Consultant
            </span>
          </div>

          <div className="apply-arrow">
            →
          </div>
        </button>

        <button
          type="button"
          className="apply-card"
          onClick={() =>
            navigate("/student-apply")
          }
        >
          <div className="apply-card-icon student-icon">
            🎓
          </div>

          <div className="apply-card-content">
            <strong>
              Student Registration
            </strong>

            <span>
              New Student Registration
            </span>
          </div>

          <div className="apply-arrow">
            →
          </div>
        </button>

        <button
          type="button"
          className="apply-card"
          onClick={() =>
            navigate("/study-centre-apply")
          }
        >
          <div className="apply-card-icon center-icon">
            🏫
          </div>

          <div className="apply-card-content">
            <strong>
              Study Center Registration
            </strong>

            <span>
              Open Study Centre
            </span>
          </div>

          <div className="apply-arrow">
            →
          </div>
        </button>
      </div>
    );
  };

  return (
    <>
      <div className="sbshe-login-page">
        <div className="sbshe-topbar">
          <div className="top-contact">
            <span>
              ✉
              <span>
                contacr@shaheedbhagatsinghhealthandedu@gmail.com
              </span>
            </span>

            <span>
              ☎
              <span>
                +91 7082013211
           <br/>
                +91 7082013215
              </span>
            </span>

            <span>
              ☎
              <span>
                +91 7082013213
              </span>
            </span>
          </div>

          <div className="top-buttons">
            <button
              type="button"
              onClick={() =>
                navigate("/acc-apply")
              }
            >
              Admission Consultant Registration
            </button>

            <button
              type="button"
              onClick={() =>
                navigate("/student-apply")
              }
            >
              Student Registration
            </button>

            <button
              type="button"
              onClick={() =>
                navigate("/study-centre-apply")
              }
            >
              Study Center Registration
            </button>
          </div>
        </div>

        <div className="login-main">
          <div className="login-card">
            <div className="login-left">
              <div className="left-decoration-one"></div>
              <div className="left-decoration-two"></div>

              <div className="logo-box">
                <img
                  src="/assets/img/websheddlogo.png"
                  alt="Shaheed Bhagat Singh Health and Education"
                  className="sbshe-logo"
                />
              </div>

              <br />

              <div className="brand-content">
                <h2>
                  Shaheed Bhagat Singh <br />
                  Health & Education
                </h2>

                <div className="orange-line"></div>

                <p className="tagline">
                  Education
                  <span>•</span>
                  Skill Development
                  <span>•</span>
                  Healthcare Awareness
                </p>

                <p className="description">
                  Empowering students and professionals
                  through quality education, skill
                  development and healthcare awareness.
                </p>
              </div>

              <div className="desktop-apply-area">
                <div className="apply-section-heading">
                  <span></span>

                  <div>
                    <strong>
                      Quick Applications
                    </strong>

                    <small>
                      Choose an application to continue
                    </small>
                  </div>

                  <span></span>
                </div>

                <ApplyButtons />
              </div>

              <div className="left-bottom">
                <span className="bottom-line"></span>

                <span>
                  Knowledge
                  <b>•</b>
                  Service
                  <b>•</b>
                  Social Responsibility
                </span>

                <span className="bottom-line"></span>
              </div>
            </div>

            <div className="login-right">
              <div className="login-type-buttons">
                <button
                  type="button"
                  className={
                    loginType === "admission"
                      ? "type-button active"
                      : "type-button"
                  }
                  onClick={() =>
                    changeLoginType("admission")
                  }
                >
                  <span className="type-icon">
                    👨‍💼
                  </span>

                  <span>
                    Admission Consultant
                    <small>
                      Login
                    </small>
                  </span>
                </button>

                <button
                  type="button"
                  className={
                    loginType === "student"
                      ? "type-button active"
                      : "type-button"
                  }
                  onClick={() =>
                    changeLoginType("student")
                  }
                >
                  <span className="type-icon">
                    🎓
                  </span>

                  <span>
                    Student
                    <small>
                      Login
                    </small>
                  </span>
                </button>

                <button
                  type="button"
                  className={
                    loginType === "studyCenter"
                      ? "type-button active"
                      : "type-button"
                  }
                  onClick={() =>
                    changeLoginType("studyCenter")
                  }
                >
                  <span className="type-icon">
                    🏫
                  </span>

                  <span>
                    Study Center
                    <small>
                      Login
                    </small>
                  </span>
                </button>
              </div>

              <div className="login-title">
                <div className="title-icon">
                  {currentLogin.icon}
                </div>

                <div>
                  <h2>
                    {currentLogin.heading}
                  </h2>

                  <p>
                    Please enter your login
                    credentials to continue
                  </p>
                </div>
              </div>

              {error && (
                <div className="alert error-alert">
                  <span>⚠</span>

                  <span>
                    {error}
                  </span>
                </div>
              )}

              {success && (
                <div className="alert success-alert">
                  <span>✓</span>

                  <span>
                    {success}
                  </span>
                </div>
              )}

              <form
                onSubmit={handleLogin}
                className="login-form"
              >
                <div className="form-group">
                  <label>
                    Username
                  </label>

                  <div className="input-box">
                    <span>
                      👤
                    </span>

                    <input
                      type="text"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter your username"
                      autoComplete="username"
                      disabled={loading}
                    />
                  </div>

                  {errors.email && (
                    <div
                      style={{
                        color: "#c62828",
                        fontSize: "10px",
                        marginTop: "5px",
                      }}
                    >
                      {errors.email}
                    </div>
                  )}
                </div>

                <div className="form-group">
                  <label>
                    Password
                  </label>

                  <div className="input-box">
                    <span>
                      🔒
                    </span>

                    <input
                      type={
                        showPassword
                          ? "text"
                          : "password"
                      }
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Enter your password"
                      autoComplete="current-password"
                      disabled={loading}
                    />

                    <button
                      type="button"
                      className="show-password"
                      onClick={() =>
                        setShowPassword(
                          (prev) => !prev
                        )
                      }
                      disabled={loading}
                    >
                      {showPassword
                        ? "🙈"
                        : "👁"}
                    </button>
                  </div>

                  {errors.password && (
                    <div
                      style={{
                        color: "#c62828",
                        fontSize: "10px",
                        marginTop: "5px",
                      }}
                    >
                      {errors.password}
                    </div>
                  )}
                </div>

                <div className="form-options">
                  <label className="remember">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => {
                        const checked =
                          e.target.checked;

                        setRememberMe(checked);

                        if (!checked) {
                          localStorage.removeItem(
                            "RememberUsername"
                          );

                          localStorage.removeItem(
                            "RememberPassword"
                          );
                        }
                      }}
                      disabled={loading}
                    />

                    <span>
                      Remember me
                    </span>
                  </label>

                  <button
                    hidden
                    type="button"
                    className="forgot"
                    onClick={() =>
                      navigate(
                        "/forgot-password"
                      )
                    }
                    disabled={loading}
                  >
                    Forgot Password?
                  </button>
                </div>

                <button
                  type="submit"
                  className="login-button"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner"></span>
                      Signing in...
                    </>
                  ) : (
                    <>
                      Login
                      <span>
                        →
                      </span>
                    </>
                  )}
                </button>
              </form>

              <ApplyButtons mobile />

              <div className="login-footer">
                <span>
                  © {new Date().getFullYear()} Shaheed
                  Bhagat Singh Health & Education
                </span>

                <span>
                  Secure Login Portal
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        * {
          box-sizing: border-box;
        }

        html,
        body,
        #root {
          margin: 0;
          padding: 0;
          min-height: 100%;
        }

        body {
          font-family:
            Arial,
            Helvetica,
            sans-serif;
        }

        button,
        input {
          font-family: inherit;
        }

        .sbshe-login-page {
          min-height: 100vh;

          background:
            radial-gradient(
              circle at top left,
              rgba(255,102,0,0.07),
              transparent 32%
            ),
            radial-gradient(
              circle at bottom right,
              rgba(7,86,127,0.06),
              transparent 32%
            ),
            #f4f7fa;
        }

        .sbshe-topbar {
          min-height: 55px;
          background: #07567f;
          color: white;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 8px 35px;
          gap: 20px;
        }

        .top-contact {
          display: flex;
          align-items: center;
          gap: 25px;
          flex-wrap: wrap;
          font-size: 12px;
        }

        .top-contact > span {
          display: flex;
          align-items: center;
          gap: 7px;
        }

        .top-contact > span span {
          color: #eeeeee;
        }

        .top-buttons {
          display: flex;
          gap: 8px;
        }

        .top-buttons button {
          border: 1px solid rgba(255,255,255,0.35);
        background: linear-gradient(135deg, #07567f, #ff6600);
          color: #fff;
          padding: 8px 14px;
          border-radius: 7px;
          cursor: pointer;
          font-size: 11px;
          transition: 0.2s;
        }

        .top-buttons button:hover {
          background: #fff;
          color: #07567f;
        }

        .login-main {
          min-height: calc(100vh - 55px);
          padding: 30px 20px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .login-card {
          width: 100%;
          max-width: 1180px;
          min-height: 550px;
          background: #fff;
          border-radius: 22px;
          overflow: hidden;
          display: grid;
          grid-template-columns: 50% 50%;
          box-shadow: 0 25px 70px rgba(0,0,0,0.12);
        }

        .login-left {
          background:
            linear-gradient(
              145deg,
              #ffffff 0%,
              #f9fbfd 60%,
              #f3f8fb 100%
            );

          padding: 38px 40px 24px;

          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;

          position: relative;
          overflow: hidden;
        }

        .login-left::before {
          content: "";
          position: absolute;
          width: 400px;
          height: 400px;
          border-radius: 50%;
          border: 1px solid rgba(255,102,0,0.12);
          top: -245px;
          right: -210px;
        }

        .login-left::after {
          content: "";
          position: absolute;
          width: 330px;
          height: 330px;
          border-radius: 50%;

          background:
            radial-gradient(
              circle,
              rgba(7,86,127,0.055),
              transparent 70%
            );

          bottom: -200px;
          left: -160px;
        }

        .left-decoration-one {
          position: absolute;
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #ff6600;
          top: 32px;
          left: 35px;
          opacity: 0.6;
        }

        .left-decoration-two {
          position: absolute;
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: #07567f;
          top: 49px;
          left: 50px;
          opacity: 0.25;
        }

        .logo-box {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 15px;
          position: relative;
          z-index: 5;
        }

        .sbshe-logo {
          width: 450px;
          max-width: 100%;
          max-height: 135px;
          object-fit: contain;
          display: block;
        }

        .brand-content {
          position: relative;
          z-index: 5;
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .brand-content h2 {
          margin: 0;
          color: #07567f;
          font-size: 25px;
          line-height: 1.25;
          font-weight: 800;
          max-width: 430px;
        }

        .orange-line {
          width: 70px;
          height: 4px;
          border-radius: 20px;
          background: #ff6600;
          margin: 15px 0 12px;
        }

        .tagline {
          margin: 0;
          color: #07567f;
          font-size: 11px;
          font-weight: 700;
        }

        .tagline span {
          color: #ff6600;
          margin: 0 5px;
        }

        .description {
          max-width: 400px;
          margin: 10px 0 0;
          color: #6e7d84;
          font-size: 11px;
          line-height: 1.55;
        }

        .desktop-apply-area {
          width: 100%;
          max-width: 450px;
          margin-top: 48px;
          position: relative;
          z-index: 10;
        }

        .apply-section-heading {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          margin-bottom: 14px;
        }

        .apply-section-heading > span {
          height: 1px;
          flex: 1;
          background:
            linear-gradient(
              to right,
              transparent,
              #d9e2e7
            );
        }

        .apply-section-heading > span:last-child {
          background:
            linear-gradient(
              to left,
              transparent,
              #d9e2e7
            );
        }

        .apply-section-heading div {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2px;
          white-space: nowrap;
        }

        .apply-section-heading strong {
          color: #07567f;
          font-size: 12px;
          font-weight: 800;
        }

        .apply-section-heading small {
          color: #98a3a8;
          font-size: 8px;
        }

        .apply-links {
          width: 100%;
        }

        .desktop-apply-links {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 9px;
        }

        .apply-card {
          position: relative;
          min-height: 82px;
          border: 1px solid #e5eaed;
          background: rgba(255,255,255,0.95);
          border-radius: 12px;
          padding: 12px 9px;
          display: flex;
          align-items: center;
          gap: 8px;
          text-align: left;
          cursor: pointer;
          transition:
            transform 0.2s ease,
            box-shadow 0.2s ease,
            border-color 0.2s ease;
          overflow: hidden;
        }

        .apply-card::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 3px;
          background:
            linear-gradient(
              90deg,
              #07567f,
              #ff6600
            );
          opacity: 0;
          transition: 0.2s;
        }

        .apply-card:hover {
          transform: translateY(-3px);
          border-color: rgba(255,102,0,0.4);
          box-shadow:
            0 12px 25px
            rgba(7,86,127,0.10);
        }

        .apply-card:hover::before {
          opacity: 1;
        }

        .apply-card-icon {
          width: 40px;
          height: 40px;
          min-width: 40px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 19px;
        }

        .acc-icon {
          background:
            linear-gradient(
              135deg,
              #fff1e8,
              #ffe3d1
            );
        }

        .student-icon {
          background:
            linear-gradient(
              135deg,
              #eef6ff,
              #dceeff
            );
        }

        .center-icon {
          background:
            linear-gradient(
              135deg,
              #f2f8f0,
              #e1f1dc
            );
        }

        .apply-card-content {
          flex: 1;
          min-width: 0;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .apply-card-content strong {
          color: #26343b;
          font-size: 10px;
          font-weight: 800;
          line-height: 1.2;
        }

        .apply-card-content span {
          color: #8a969c;
          font-size: 7px;
          line-height: 1.3;
        }

        .apply-arrow {
          width: 22px;
          height: 22px;
          min-width: 22px;
          border-radius: 50%;
          background: #f3f7f9;
          color: #07567f;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 11px;
          transition: 0.2s;
        }

        .apply-card:hover .apply-arrow {
          background: #ff6600;
          color: #fff;
          transform: translateX(2px);
        }

        .left-bottom {
          width: 100%;
          margin-top: auto;
          padding-top: 18px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          color: #7d8b91;
          font-size: 8px;
          position: relative;
          z-index: 5;
        }

        .left-bottom b {
          color: #ff6600;
          margin: 0 5px;
        }

        .bottom-line {
          width: 28px;
          height: 1px;
          background: rgba(7,86,127,0.18);
        }

        .login-right {
          padding: 30px 40px 23px;
          display: flex;
          flex-direction: column;
          min-width: 0;
        }

        .login-type-buttons {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 9px;
          margin-bottom: 23px;
        }

        .type-button {
          min-height: 76px;
          border: 1px solid #e5e5e5;
          background: #fafafa;
          color: #555;
          border-radius: 11px;
          padding: 8px 6px;
          cursor: pointer;
          font-size: 10px;
          font-weight: 700;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          gap: 5px;
          transition: 0.2s;
        }

        .type-button:hover {
          border-color: #ff6600;
          color: #07567f;
        }

        .type-button.active {
          background: #fff5ee;
          color: #07567f;
          border: 1.5px solid #ff6600;
          box-shadow:
            0 5px 18px
            rgba(255,102,0,0.12);
        }

        .type-icon {
          font-size: 21px;
        }

        .type-button > span:last-child {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .type-button small {
          font-size: 8px;
          font-weight: 500;
          color: #888;
        }

        .login-title {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 21px;
        }

        .title-icon {
          width: 47px;
          height: 47px;
          min-width: 47px;
          border-radius: 11px;
          background: #fff1e8;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 22px;
        }

        .login-title h2 {
          margin: 0;
          color: #222;
          font-size: 21px;
          line-height: 1.25;
          font-weight: 800;
        }

        .login-title p {
          margin: 4px 0 0;
          color: #888;
          font-size: 11px;
        }

        .alert {
          display: flex;
          align-items: center;
          gap: 9px;
          padding: 10px 12px;
          border-radius: 8px;
          margin-bottom: 15px;
          font-size: 12px;
        }

        .error-alert {
          background: #fff1f1;
          border: 1px solid #ffd0d0;
          color: #c62828;
        }

        .success-alert {
          background: #effaf1;
          border: 1px solid #c9ebcf;
          color: #218838;
        }

        .login-form {
          width: 100%;
        }

        .form-group {
          margin-bottom: 16px;
        }

        .form-group label {
          display: block;
          color: #333;
          font-size: 12px;
          font-weight: 700;
          margin-bottom: 7px;
        }

        .input-box {
          height: 46px;
          width: 100%;
          display: flex;
          align-items: center;
          border: 1px solid #ddd;
          border-radius: 9px;
          background: #fff;
          overflow: hidden;
          transition: 0.2s;
        }

        .input-box:focus-within {
          border-color: #ff6600;
          box-shadow:
            0 0 0 3px
            rgba(255,102,0,0.08);
        }

        .input-box > span {
          width: 43px;
          min-width: 43px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 16px;
        }

        .input-box input {
          height: 100%;
          flex: 1;
          min-width: 0;
          border: none;
          outline: none;
          font-size: 13px;
          color: #333;
          padding: 0 8px 0 0;
          background: transparent;
        }

        .input-box input::placeholder {
          color: #aaa;
        }

        .show-password {
          width: 43px;
          min-width: 43px;
          height: 100%;
          border: none;
          background: transparent;
          cursor: pointer;
          font-size: 15px;
        }

        .show-password:disabled {
          cursor: not-allowed;
          opacity: 0.6;
        }

        .form-options {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          margin: 2px 0 17px;
        }

        .remember {
          display: flex;
          align-items: center;
          gap: 7px;
          color: #666;
          font-size: 11px;
          cursor: pointer;
        }

        .remember input {
          accent-color: #ff6600;
          width: 14px;
          height: 14px;
        }

        .forgot {
          border: none;
          background: transparent;
          color: #07567f;
          font-size: 11px;
          font-weight: 700;
          cursor: pointer;
        }

        .forgot:hover {
          text-decoration: underline;
        }

        .login-button {
          width: 100%;
          height: 48px;
          border: none;
          border-radius: 9px;

          background:
            linear-gradient(
              135deg,
              #07567f,
              #ff6600
            );

          color: white;
          font-size: 13px;
          font-weight: 800;
          cursor: pointer;

          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;

          box-shadow:
            0 8px 20px
            rgba(255,102,0,0.22);

          transition: 0.2s;
        }

        .login-button:hover:not(:disabled) {
          transform: translateY(-1px);

          box-shadow:
            0 10px 25px
            rgba(255,102,0,0.30);
        }

        .login-button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .spinner {
          width: 16px;
          height: 16px;

          border:
            2px solid
            rgba(255,255,255,0.4);

          border-top-color: white;
          border-radius: 50%;

          animation:
            spin 0.7s linear infinite;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        .mobile-apply-links {
          display: none;
        }

        .login-footer {
          margin-top: auto;
          padding-top: 14px;
          border-top: 1px solid #eee;

          display: flex;
          align-items: center;
          justify-content: space-between;

          gap: 10px;
          color: #999;
          font-size: 9px;
        }

        @media (max-width: 1100px) {
          .login-left {
            padding: 32px 25px 22px;
          }

          .login-right {
            padding: 28px 28px 22px;
          }

          .sbshe-logo {
            width: 320px;
          }

          .brand-content h2 {
            font-size: 22px;
          }

          .desktop-apply-area {
            margin-top: 40px;
          }

          .apply-card {
            min-height: 76px;
            padding: 9px 7px;
          }

          .apply-card-icon {
            width: 34px;
            height: 34px;
            min-width: 34px;
            font-size: 16px;
          }

          .apply-card-content strong {
            font-size: 8px;
          }

          .apply-card-content span {
            font-size: 6px;
          }
        }

        @media (max-width: 850px) {
          .sbshe-topbar {
            padding: 9px 18px;
          }

          .top-contact {
            gap: 10px 15px;
            font-size: 10px;
          }

          .top-buttons button {
            padding: 7px 10px;
            font-size: 10px;
          }

          .login-main {
            padding: 20px 12px;
          }

          .login-card {
            min-height: 600px;
          }

          .login-left {
            padding: 28px 16px 20px;
          }

          .login-right {
            padding: 23px 17px 19px;
          }

          .sbshe-logo {
            width: 250px;
          }

          .brand-content h2 {
            font-size: 18px;
          }

          .tagline {
            font-size: 8px;
          }

          .description {
            font-size: 8px;
          }

          .desktop-apply-area {
            margin-top: 35px;
          }

          .apply-section-heading strong {
            font-size: 10px;
          }

          .apply-section-heading small {
            font-size: 7px;
          }

          .desktop-apply-links {
            gap: 5px;
          }

          .apply-card {
            min-height: 68px;
            border-radius: 9px;
          }

          .apply-card-icon {
            width: 30px;
            height: 30px;
            min-width: 30px;
            font-size: 14px;
          }

          .apply-card-content strong {
            font-size: 7px;
          }

          .apply-card-content span {
            font-size: 5.5px;
          }

          .apply-arrow {
            width: 18px;
            height: 18px;
            min-width: 18px;
            font-size: 9px;
          }

          .login-title h2 {
            font-size: 15px;
          }

          .login-title p {
            font-size: 9px;
          }

          .input-box {
            height: 42px;
          }

          .input-box input {
            font-size: 11px;
          }

          .login-button {
            height: 43px;
            font-size: 11px;
          }
        }

        @media (max-width: 650px) {
          .sbshe-topbar {
            display: none !important;
          }

          .login-main {
            min-height: 100vh;
            padding: 0;
            display: block;
          }

          .login-card {
            width: 100%;
            max-width: 560px;
            margin: 0 auto;
            grid-template-columns: 1fr;
            min-height: 100vh;
            border-radius: 0;
            box-shadow: none;
          }

          .login-left {
            height: 125px;
            min-height: 125px;
            padding: 15px 10px;
            justify-content: center;
            border-bottom: 1px solid #eee;
          }

          .logo-box {
            margin: 0;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .sbshe-logo {
            width: 200px;
            max-height: 95px;
          }

          .brand-content,
          .desktop-apply-area,
          .left-bottom,
          .left-decoration-one,
          .left-decoration-two {
            display: none !important;
          }

          .login-right {
            width: 100%;
            padding: 18px 13px 16px;
          }

          .login-type-buttons {
            grid-template-columns: 1fr;
            gap: 6px;
            margin-bottom: 17px;
          }

          .type-button {
            width: 100%;
            min-height: 49px;
            flex-direction: row;
            justify-content: flex-start;
            text-align: left;
            padding: 7px 11px;
            font-size: 10px;
            gap: 8px;
          }

          .type-icon {
            width: 28px;
            min-width: 28px;
            font-size: 18px;
            text-align: center;
          }

          .login-title {
            align-items: flex-start;
            gap: 8px;
            margin-bottom: 16px;
          }

          .title-icon {
            width: 38px;
            height: 38px;
            min-width: 38px;
            font-size: 17px;
            border-radius: 8px;
          }

          .login-title h2 {
            font-size: 16px;
            line-height: 1.3;
          }

          .login-title p {
            font-size: 9px;
            margin-top: 3px;
          }

          .alert {
            font-size: 10px;
            padding: 8px 9px;
            margin-bottom: 12px;
          }

          .form-group {
            margin-bottom: 13px;
          }

          .form-group label {
            font-size: 10px;
            margin-bottom: 5px;
          }

          .input-box {
            height: 44px;
            border-radius: 8px;
          }

          .input-box > span {
            width: 38px;
            min-width: 38px;
            font-size: 14px;
          }

          .input-box input {
            font-size: 11px;
          }

          .show-password {
            width: 38px;
            min-width: 38px;
          }

          .form-options {
            flex-wrap: wrap;
            gap: 7px;
            margin: 2px 0 14px;
          }

          .remember,
          .forgot {
            font-size: 9px;
          }

          .login-button {
            height: 44px;
            font-size: 11px;
          }

          .mobile-apply-links {
            display: flex;
            flex-direction: column;
            width: 100%;
            gap: 7px;
            margin-top: 15px;
          }

          .mobile-apply-links .apply-card {
            width: 100%;
            min-height: 51px;
            padding: 7px 10px;
            border-radius: 9px;
            background: #fafbfc;
          }

          .mobile-apply-links .apply-card-icon {
            width: 34px;
            height: 34px;
            min-width: 34px;
            font-size: 16px;
          }

          .mobile-apply-links .apply-card-content {
            gap: 3px;
          }

          .mobile-apply-links .apply-card-content strong {
            font-size: 9px;
          }

          .mobile-apply-links .apply-card-content span {
            font-size: 7px;
          }

          .mobile-apply-links .apply-arrow {
            width: 23px;
            height: 23px;
            min-width: 23px;
            font-size: 11px;
          }

          .login-footer {
            flex-direction: column;
            justify-content: center;
            text-align: center;
            gap: 4px;
            margin-top: 15px;
            padding-top: 11px;
            font-size: 7px;
          }
        }

        @media (max-width: 420px) {
          .login-left {
            height: 112px;
            min-height: 112px;
          }

          .sbshe-logo {
            width: 350px;
            max-height: 85px;
          }

          .login-right {
            padding: 15px 10px 14px;
          }

          .login-title h2 {
            font-size: 14px;
          }

          .login-title p {
            font-size: 8px;
          }

          .mobile-apply-links {
            gap: 6px;
            margin-top: 12px;
          }

          .mobile-apply-links .apply-card {
            min-height: 68px;
          }

          .mobile-apply-links .apply-card-icon {
            width: 31px;
            height: 31px;
            min-width: 31px;
          }

          .mobile-apply-links .apply-card-content strong {
            font-size: 8px;
          }

          .mobile-apply-links .apply-card-content span {
            font-size: 6.5px;
          }
        }

        @media (max-width: 360px) {
          .login-left {
            height: 100px;
            min-height: 100px;
          }

          .sbshe-logo {
            width: 165px;
            max-height: 78px;
          }

          .login-right {
            padding: 13px 8px 12px;
          }

          .type-button {
            min-height: 45px;
            font-size: 9px;
          }

          .login-title h2 {
            font-size: 13px;
          }

          .input-box {
            height: 41px;
          }

          .login-button {
            height: 41px;
          }

          .mobile-apply-links .apply-card {
            min-height: 45px;
          }

          .mobile-apply-links .apply-card-content strong {
            font-size: 7.5px;
          }

          .mobile-apply-links .apply-card-content span {
            font-size: 6px;
          }
        }
      `}</style>
    </>
  );
};

export default Login;
 