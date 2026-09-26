 
import React, { useState } from "react";
import { updatePasswordapi } from "./FranchiseData";

function UpdatePassword() {
  const userId = localStorage.getItem("UserId") || "";
  const username = localStorage.getItem("Username") || "";

  const [formData, setFormData] = useState({
    id: userId,
    username: username,
    password: "",
    confirmpassword: "",
  });

  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");
  };

 const handleSubmit = async (e) => {
  e.preventDefault();

  if (formData.password !== formData.confirmpassword) {
    setError("Password and Confirm Password do not match!");
    return;
  }

  const data = new FormData();

  data.append("id", userId);
  data.append("username", username);
  data.append("password", formData.password);
  data.append("confirmpassword", formData.confirmpassword);

  try {
    setLoading(true);

    const response = await updatePasswordapi(data);

    console.log("Password Updated Successfully", response);

    alert("Password Updated Successfully!");

    setFormData((prev) => ({
      ...prev,
      password: "",
      confirmpassword: "",
    }));

    setError("");

  } catch (error) {
    console.error("Update Password Error:", error);
    alert("Something went wrong!");
  } finally {
    setLoading(false);
  }
};
  const passwordMismatch =
    formData.password &&
    formData.confirmpassword &&
    formData.password !== formData.confirmpassword;

  const passwordMatch =
    formData.password &&
    formData.confirmpassword &&
    formData.password === formData.confirmpassword;

  return (
    <div className="container mt-4">

      <div className="card shadow-sm border-0">

        <div className="card-header bg-primary text-white">
          <h4 className="mb-0">Update Password</h4>
        </div>

        <div className="card-body">

          <form onSubmit={handleSubmit}>

            <div className="row">

              {/* ID */}

              <div className="col-md-6 mb-3">
                <label className="form-label">
                  ID
                </label>

                <input hidden
                  readOnly
                  type="text"
                  name="id"
                  className="form-control"
                  value={formData.id}
                />
              </div>

              {/* Username */}

              <div className="col-md-6 mb-3">
                <label className="form-label">
                  Username
                </label>

                <input
                  readOnly
                  type="text"
                  name="username"
                  className="form-control"
                  value={formData.username}
                />
              </div>

              {/* Password */}

              <div className="col-md-6 mb-3">
                <label className="form-label">
                  Password
                </label>

                <div className="input-group">

                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    className="form-control"
                    placeholder="Enter Password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />

                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() =>
                      setShowPassword(!showPassword)
                    }
                  >
                    <i
                      className={
                        showPassword
                          ? "bi bi-eye-slash"
                          : "bi bi-eye"
                      }
                    ></i>
                  </button>

                </div>
              </div>

              {/* Confirm Password */}

              <div className="col-md-6 mb-3">
                <label className="form-label">
                  Confirm Password
                </label>

                <div className="input-group">

                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmpassword"
                    className={`form-control ${
                      passwordMismatch
                        ? "is-invalid"
                        : passwordMatch
                        ? "is-valid"
                        : ""
                    }`}
                    placeholder="Confirm Password"
                    value={formData.confirmpassword}
                    onChange={handleChange}
                    required
                  />

                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() =>
                      setShowConfirmPassword(
                        !showConfirmPassword
                      )
                    }
                  >
                    <i
                      className={
                        showConfirmPassword
                          ? "bi bi-eye-slash"
                          : "bi bi-eye"
                      }
                    ></i>
                  </button>

                </div>

                {/* Password Match Message */}

                {passwordMismatch && (
                  <div className="text-danger mt-2">
                    <i className="bi bi-exclamation-circle me-1"></i>
                    Password and Confirm Password do not match!
                  </div>
                )}

                {passwordMatch && (
                  <div className="text-success mt-2">
                    <i className="bi bi-check-circle me-1"></i>
                    Password matched!
                  </div>
                )}

              </div>

            </div>

            {/* Error */}

            {error && (
              <div className="alert alert-danger">
                {error}
              </div>
            )}

            {/* Save Button */}

            <button
              type="submit"
              className="btn btn-primary"
              disabled={
                loading ||
                !formData.password ||
                !formData.confirmpassword ||
                formData.password !== formData.confirmpassword
              }
            >
              {loading ? "Updating..." : "Save Password"}
            </button>

          </form>

        </div>

      </div>

    </div>
  );
}

export default UpdatePassword;