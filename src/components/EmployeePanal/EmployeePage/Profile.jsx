 import React from "react";
import { useNavigate } from "react-router-dom";
import { FILE_URL } from "../../api";

const Profile = () => {
  const navigate = useNavigate();

  // ==============================
  // LOCAL STORAGE DATA
  // ==============================
  const name = localStorage.getItem("name") || "User";
  const username = localStorage.getItem("Username") || "N/A";
  const roleId = localStorage.getItem("RoleId") || "N/A";
  const userId = localStorage.getItem("UserId") || "N/A";

  // ==============================
  // USER DATA
  // ==============================
  let userData = {};

  try {
    const savedUserData = localStorage.getItem("userData");
    const savedUser = localStorage.getItem("user");

    if (savedUserData) {
      userData = JSON.parse(savedUserData);
    } else if (savedUser) {
      userData = JSON.parse(savedUser);
    }
  } catch (error) {
    console.log("User data parse error:", error);
    userData = {};
  }

  // ==============================
  // ROLE
  // ==============================
  const getRoleName = (roleId) => {
    switch (String(roleId)) {
      case "5":
        return "Administrator";

      case "6":
        return "Frenchise";

      case "33":
        return "Employee";

      default:
        return "User";
    }
  };

  const roleName = getRoleName(roleId);

  // ==============================
  // FILE URL
  // ==============================
  const getDocumentUrl = (file) => {
    if (!file) return "";

    if (typeof file !== "string") return "";

    if (
      file.startsWith("http://") ||
      file.startsWith("https://") ||
      file.startsWith("blob:")
    ) {
      return file;
    }

    return `${FILE_URL}${file.startsWith("/") ? "" : "/"}${file}`;
  };

  // ==============================
  // GET FILE FROM MULTIPLE POSSIBLE NAMES
  // ==============================
  const getFile = (...fields) => {
    for (const field of fields) {
      if (userData?.[field]) {
        return userData[field];
      }
    }

    return "";
  };

  // ==============================
  // DOCUMENTS
  // ==============================
  const documents = [
    {
      title: "Photo",
      file: getFile(
        "studentPhoto",
        "studentPhotoImage",
        "passportPhoto",
        "photo",
        "profilePhoto",
        "studentImage"
      ),
    },

    {
      title: "Signature",
      file: getFile(
        "signature",
        "signatureImage",
        "authorizedSignature",
        "studentSignature",
        "sign"
      ),
    },

    {
      title: "Aadhaar Front",
      file: getFile(
        "aadhaarFront",
        "aadhaarCardFront",
        "aadhaarCardimage",
        "aadhaarCardImage",
        "aadharFront",
        "aadharCardFront"
      ),
    },

    {
      title: "Aadhaar Back",
      file: getFile(
        "aadhaarBack",
        "aadhaarCardBack",
        "aadhaarCardBackImage",
        "aadharBack",
        "aadharCardBack"
      ),
    },
  ];

  // ==============================
  // LOGOUT
  // ==============================
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("name");
    localStorage.removeItem("RoleId");
    localStorage.removeItem("UserId");
    localStorage.removeItem("Username");
    localStorage.removeItem("user");
    localStorage.removeItem("userData");

    sessionStorage.clear();

    navigate("/");
  };

  return (
    <>
      <style>{`

        /* =====================================
           MAIN PAGE
        ===================================== */

        .profile-page {
          min-height: 100vh;
          background: #f5f7fb;
          padding: 30px;
        }

        .profile-wrapper {
          max-width: 1250px;
          margin: auto;
        }


        /* =====================================
           TOP HEADER
        ===================================== */

        .profile-topbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 25px;
        }

        .profile-title h2 {
          margin: 0;
          color: #202124;
          font-size: 27px;
          font-weight: 800;
        }

        .profile-title p {
          margin: 5px 0 0;
          color: #777;
          font-size: 14px;
        }

        .logout-btn {
          border: 1px solid #ff6600;
          background: #fff;
          color: #ff6600;
          padding: 10px 18px;
          border-radius: 10px;
          font-size: 14px;
          font-weight: 600;
          transition: .2s ease;
        }

        .logout-btn:hover {
          background: #ff6600;
          color: #fff;
        }


        /* =====================================
           PROFILE HERO
        ===================================== */

        .profile-hero {
          position: relative;
          overflow: hidden;
          background: linear-gradient(
            135deg,
            #ff6600,
            #ff8533
          );
          border-radius: 22px;
          padding: 30px;
          color: #fff;
          margin-bottom: 25px;
          box-shadow:
            0 12px 30px rgba(255,102,0,.18);
        }

        .profile-hero::before {
          content: "";
          position: absolute;
          width: 280px;
          height: 280px;
          border-radius: 50%;
          border: 45px solid rgba(255,255,255,.08);
          right: -90px;
          top: -110px;
        }

        .profile-hero::after {
          content: "";
          position: absolute;
          width: 170px;
          height: 170px;
          border-radius: 50%;
          background: rgba(255,255,255,.06);
          right: 160px;
          bottom: -100px;
        }

        .hero-content {
          position: relative;
          z-index: 2;
          display: flex;
          align-items: center;
          gap: 22px;
        }

        .profile-avatar {
          width: 90px;
          height: 90px;
          min-width: 90px;
          border-radius: 50%;
          background: #fff;
          color: #ff6600;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 35px;
          font-weight: 800;
          box-shadow: 0 8px 20px rgba(0,0,0,.15);
        }

        .hero-info h1 {
          margin: 0;
          font-size: 28px;
          font-weight: 800;
        }

        .hero-info p {
          margin: 5px 0 12px;
          opacity: .9;
          font-size: 14px;
        }

        .role-badge {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 6px 12px;
          border-radius: 20px;
          background: rgba(255,255,255,.18);
          border: 1px solid rgba(255,255,255,.25);
          font-size: 13px;
          font-weight: 600;
        }

        .active-badge {
          margin-left: 8px;
          padding: 6px 12px;
          background: #fff;
          color: #188038;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 700;
        }


        /* =====================================
           COMMON SECTION CARD
        ===================================== */

        .section-card {
          background: #fff;
          border-radius: 18px;
          border: 1px solid #eee;
          padding: 24px;
          margin-bottom: 22px;
          box-shadow: 0 5px 20px rgba(0,0,0,.04);
        }

        .section-heading {
          display: flex;
          align-items: center;
          gap: 11px;
          margin-bottom: 22px;
        }

        .section-icon {
          width: 40px;
          height: 40px;
          min-width: 40px;
          border-radius: 11px;
          background: #fff1e8;
          color: #ff6600;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 19px;
        }

        .section-heading h4 {
          margin: 0;
          font-size: 18px;
          font-weight: 750;
          color: #222;
        }

        .section-heading span {
          display: block;
          color: #888;
          font-size: 12px;
          margin-top: 2px;
        }


        /* =====================================
           ACCOUNT INFORMATION
        ===================================== */

        .info-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 15px;
        }

        .info-box {
          border: 1px solid #eee;
          border-radius: 13px;
          padding: 16px;
          background: #fcfcfc;
        }

        .info-label {
          font-size: 12px;
          color: #888;
          margin-bottom: 6px;
        }

        .info-value {
          font-size: 15px;
          font-weight: 650;
          color: #272727;
          word-break: break-word;
        }

        .info-value i {
          color: #ff6600;
          margin-right: 7px;
        }


        /* =====================================
           ACCOUNT STATUS
        ===================================== */

        .status-box {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 18px;
          border: 1px solid #e9e9e9;
          border-radius: 14px;
          background: #fafafa;
        }

        .status-left {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .status-icon {
          width: 45px;
          height: 45px;
          min-width: 45px;
          border-radius: 50%;
          background: #eaf8ef;
          color: #1a9b4b;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 21px;
        }

        .status-left h5 {
          margin: 0;
          font-weight: 700;
        }

        .status-left p {
          margin: 3px 0 0;
          font-size: 12px;
          color: #888;
        }

        .status-active {
          color: #198754;
          background: #eaf8ef;
          padding: 7px 13px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 700;
        }


        /* =====================================
           DOCUMENTS
        ===================================== */

        .documents-section {
          padding-bottom: 25px;
        }

        .documents-preview-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 24px;
        }

        .document-preview-card {
          border: 1px solid #dfe3e8;
          border-radius: 9px;
          background: #fff;
          padding: 0 0 16px;
          overflow: hidden;
          transition: all .2s ease;
        }

        .document-preview-card:hover {
          border-color: #ff6600;
          box-shadow: 0 7px 20px rgba(0,0,0,.08);
          transform: translateY(-2px);
        }

        .document-preview-title {
          text-align: center;
          font-size: 16px;
          font-weight: 500;
          color: #252525;
          padding: 17px 8px 15px;
        }

        .document-image-box {
          width: 100%;
          height: 180px;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          background: #fff;
        }

        .document-image-box img {
          max-width: 90%;
          max-height: 100%;
          width: auto;
          height: auto;
          object-fit: contain;
          display: block;
        }

        .no-document {
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          color: #aaa;
          gap: 8px;
        }

        .no-document i {
          font-size: 35px;
        }

        .no-document span {
          font-size: 12px;
        }


        /* =====================================
           DOCUMENT IMAGE HOVER
        ===================================== */

        .document-image-box img {
          transition: transform .25s ease;
        }

        .document-preview-card:hover
        .document-image-box img {
          transform: scale(1.03);
        }


        /* =====================================
           FOOTER
        ===================================== */

        .profile-footer {
          text-align: center;
          padding: 5px 0 15px;
          color: #999;
          font-size: 12px;
        }


        /* =====================================
           TABLET
        ===================================== */

        @media (max-width: 1000px) {

          .documents-preview-grid {
            grid-template-columns: repeat(2, 1fr);
          }

        }


        /* =====================================
           MOBILE
        ===================================== */

        @media (max-width: 650px) {

          .profile-page {
            padding: 15px;
          }

          .profile-topbar {
            align-items: flex-start;
            gap: 15px;
          }

          .profile-title h2 {
            font-size: 22px;
          }

          .logout-btn {
            padding: 8px 12px;
          }

          .profile-hero {
            padding: 22px;
          }

          .hero-content {
            align-items: flex-start;
          }

          .profile-avatar {
            width: 70px;
            height: 70px;
            min-width: 70px;
            font-size: 27px;
          }

          .hero-info h1 {
            font-size: 22px;
          }

          .active-badge {
            display: inline-block;
            margin-left: 0;
            margin-top: 7px;
          }

          .info-grid {
            grid-template-columns: 1fr;
          }

          .documents-preview-grid {
            grid-template-columns: 1fr;
          }

          .document-image-box {
            height: 220px;
          }

          .status-box {
            align-items: flex-start;
            gap: 12px;
            flex-direction: column;
          }

        }

      `}</style>


      <div className="profile-page">

        <div className="profile-wrapper">


          {/* =====================================
              TOP HEADER
          ===================================== */}

          <div className="profile-topbar">

            <div className="profile-title">

              <h2>
                My Profile
              </h2>

              <p>
                Manage your account information and documents
              </p>

            </div>


            <button
              className="logout-btn"
              onClick={logout}
            >

              <i className="bi bi-box-arrow-right me-2"></i>

              Logout

            </button>

          </div>



          {/* =====================================
              PROFILE HERO
          ===================================== */}

          <div className="profile-hero">

            <div className="hero-content">

              <div className="profile-avatar">

                {name.charAt(0).toUpperCase()}

              </div>


              <div className="hero-info">

                <h1>
                  {name}
                </h1>

                <p>
                  <i className="bi bi-person-circle me-1"></i>

                  {username}
                </p>


                <span className="role-badge">

                  <i className="bi bi-shield-check"></i>

                  {roleName}

                </span>


                <span className="active-badge">

                  <i className="bi bi-check-circle-fill me-1"></i>

                  Active

                </span>

              </div>

            </div>

          </div>



          {/* =====================================
              ACCOUNT INFORMATION
          ===================================== */}

          <div className="section-card">

            <div className="section-heading">

              <div className="section-icon">

                <i className="bi bi-person-vcard"></i>

              </div>


              <div>

                <h4>
                  Account Information
                </h4>

                <span>
                  Your registered account details
                </span>

              </div>

            </div>



            <div className="info-grid">


              <div className="info-box">

                <div className="info-label">
                  Full Name
                </div>

                <div className="info-value">

                  <i className="bi bi-person"></i>

                  {name}

                </div>

              </div>



              <div className="info-box">

                <div className="info-label">
                  Username
                </div>

                <div className="info-value">

                  <i className="bi bi-at"></i>

                  {username}

                </div>

              </div>



              <div className="info-box">

                <div className="info-label">
                  User ID
                </div>

                <div className="info-value">

                  <i className="bi bi-fingerprint"></i>

                  {userId}

                </div>

              </div>



              <div className="info-box">

                <div className="info-label">
                  Role
                </div>

                <div className="info-value">

                  <i className="bi bi-shield"></i>

                  {roleName}

                </div>

              </div>


            </div>

          </div>



          {/* =====================================
              ACCOUNT STATUS
          ===================================== */}

          <div className="section-card">

            <div className="section-heading">

              <div className="section-icon">

                <i className="bi bi-activity"></i>

              </div>


              <div>

                <h4>
                  Account Status
                </h4>

                <span>
                  Current account security status
                </span>

              </div>

            </div>



            <div className="status-box">

              <div className="status-left">

                <div className="status-icon">

                  <i className="bi bi-check-lg"></i>

                </div>


                <div>

                  <h5>
                    Account Active
                  </h5>

                  <p>
                    Your account is currently active and available.
                  </p>

                </div>

              </div>


              <div className="status-active">

                ACTIVE

              </div>

            </div>

          </div>



          {/* =====================================
              ACCOUNT ACTION
          ===================================== */}

          <div className="section-card">

            <div className="section-heading">

              <div className="section-icon">

                <i className="bi bi-gear"></i>

              </div>


              <div>

                <h4>
                  Account Actions
                </h4>

                <span>
                  Manage your account session
                </span>

              </div>

            </div>


            <button
              className="logout-btn"
              onClick={logout}
            >

              <i className="bi bi-box-arrow-right me-2"></i>

              Sign Out From Account

            </button>

          </div>



          {/* =====================================
              DOCUMENTS - LAST
          ===================================== */}

          <div className="section-card documents-section">


            <div className="section-heading">

              <div className="section-icon">

                <i className="bi bi-file-earmark-image"></i>

              </div>


              <div>

                <h4>
                  Documents
                </h4>

                <span>
                  Your submitted documents
                </span>

              </div>

            </div>



            <div className="documents-preview-grid">


              {documents.map((doc, index) => (

                <div
                  className="document-preview-card"
                  key={index}
                >


                  {/* DOCUMENT TITLE */}

                  <div className="document-preview-title">

                    {doc.title}

                  </div>



                  {/* DOCUMENT IMAGE */}

                  <div className="document-image-box">

                    {doc.file ? (

                      <img
                        src={getDocumentUrl(doc.file)}
                        alt={doc.title}
                      />

                    ) : (

                      <div className="no-document">

                        <i className="bi bi-image"></i>

                        <span>
                          Document Not Available
                        </span>

                      </div>

                    )}

                  </div>


                </div>

              ))}


            </div>

          </div>



          {/* =====================================
              FOOTER
          ===================================== */}

          <div className="profile-footer">

            © {new Date().getFullYear()} SBSHE · All Rights Reserved

          </div>


        </div>

      </div>

    </>
  );
};

export default Profile;