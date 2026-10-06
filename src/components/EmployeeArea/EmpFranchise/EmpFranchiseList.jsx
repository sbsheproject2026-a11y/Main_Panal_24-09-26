 import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getEmpFrenchises } from "../../AllServicesFiles/FrenchiseService";

function EmpFranchiseList() {
    const [data, setData] = useState([]);
    const [search, setSearch] = useState("");
    const [pageNo, setPageNo] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalRecords, setTotalRecords] = useState(0);
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState({});
    const [copiedField, setCopiedField] = useState("");

    // ✅ Modal ke liye
    const [showActionModal, setShowActionModal] = useState(false);
    const [selectedFranchise, setSelectedFranchise] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        loadFranchises();
        // eslint-disable-next-line
    }, [pageNo, pageSize, search]);

    const loadFranchises = async () => {
        try {
            setLoading(true);

            const result = await getEmpFrenchises(pageNo, pageSize, search);
            const apiData = result?.data;

            let list = [];
            let total = 0;

            if (Array.isArray(apiData)) {
                list = apiData;
                total = apiData.length;
            } else if (apiData && Array.isArray(apiData.data)) {
                list = apiData.data;
                total = apiData.totalRecords ?? apiData.data.length;
            } else if (apiData && Array.isArray(apiData.items)) {
                list = apiData.items;
                total = apiData.totalRecords ?? apiData.items.length;
            } else if (apiData && Array.isArray(apiData.result)) {
                list = apiData.result;
                total = apiData.totalRecords ?? apiData.result.length;
            }

            setData(list);
            setTotalRecords(total);
        } catch (err) {
            console.log("FRANCHISE LIST ERROR:", err);
            setData([]);
            setTotalRecords(0);
        } finally {
            setLoading(false);
        }
    };

    const totalPages = Math.max(1, Math.ceil(totalRecords / pageSize));

    const startRecord =
        totalRecords === 0 ? 0 : (pageNo - 1) * pageSize + 1;

    const endRecord = Math.min(pageNo * pageSize, totalRecords);

    const handleSearch = (e) => {
        setSearch(e.target.value);
        setPageNo(1);
    };

    const clearSearch = () => {
        setSearch("");
        setPageNo(1);
    };

    const handlePageSize = (e) => {
        setPageSize(Number(e.target.value));
        setPageNo(1);
    };

    const togglePassword = (id) => {
        setShowPassword((prev) => ({ ...prev, [id]: !prev[id] }));
    };

    const copyToClipboard = async (text, field, id) => {
        if (!text) return;
        try {
            await navigator.clipboard.writeText(text);
            setCopiedField(`${field}-${id}`);
            setTimeout(() => setCopiedField(""), 1200);
        } catch (e) {
            console.log("Copy failed", e);
        }
    };

    // =========================================================
    // ✅ OPEN / CLOSE ACTION MODAL
    // =========================================================
    const openActionModal = (franchise) => {
        setSelectedFranchise(franchise);
        setShowActionModal(true);
    };

    const closeActionModal = () => {
        setShowActionModal(false);
        setSelectedFranchise(null);
    };

    // =========================================================
    // ✅ ACTION HANDLERS
    // =========================================================
    const goTo = (path, withState = true) => {
        if (!selectedFranchise) return;
        if (withState) {
            navigate(path, {
                state: { referenceId: selectedFranchise.id },
            });
        } else {
            navigate(path);
        }
        closeActionModal();
    };

    // FRANCHISE
    const handleIdCard = () =>
        goTo(`/franchise-id-card/${selectedFranchise?.id}`, false);

    const handleAuthorityLetter = () =>
        goTo(`/authority-letterPrint/${selectedFranchise?.id}`, false);

    // ✅ ADDRESS PRINT
    const handleAddressPrint = () => {
        if (!selectedFranchise) return;

        navigate("/address-print", {
            state: {
                printData: {
                    name: selectedFranchise.name || "",
                    fatherName: selectedFranchise.fatherName || "",
                    mobileNo: selectedFranchise.mobileNo || "",
                    address: selectedFranchise.address || "",
                    cityName: selectedFranchise.cityName || "",
                    districtName: selectedFranchise.districtName || "",
                    stateName: selectedFranchise.stateName || "",
                    pincode: selectedFranchise.pincode || "",
                },
            },
        });

        closeActionModal();
    };

    // STUDENT
    const handleStudentAdd = () => goTo("/student-create");
    const handleStudentList = () => goTo("/student-list");
    const handleStudentSendToConfirm = () => goTo("/student-to-confirm");

    // WALLET
    const handleWallet = () => goTo("/wallet-recharge");
    const handleWalletList = () => goTo("/wallet-history");

    return (
        <>
            {/* PAGE HEADER */}
            <div className="page-header mb-4">
                <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
                    <div>
                        <h2 className="page-title mb-1">
                            <i className="bi bi-people-fill text-primary me-2"></i>
                            Franchise Detail
                        </h2>
                        <p className="page-subtitle mb-0">
                            Manage and view all franchise records
                        </p>
                    </div>
                </div>

                <nav className="mt-3">
                    <ol className="breadcrumb mb-0">
                        <li className="breadcrumb-item">
                            <a href="/employee-dashboard" className="text-decoration-none">
                                <i className="bi bi-house-door me-1"></i>
                                Dashboard
                            </a>
                        </li>
                        <li className="breadcrumb-item active">Franchise Detail</li>
                    </ol>
                </nav>
            </div>

            {/* MAIN SECTION */}
            <section className="section">
                <div className="card consultant-card border-0">

                    <div className="card-header consultant-header">
                        <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
                            <div>
                                <h5 className="consultant-title mb-1">
                                    <i className="bi bi-list-ul text-primary me-2"></i>
                                    Franchise List
                                </h5>
                                <span className="total-text">
                                    Total <strong>{totalRecords}</strong> franchise
                                    {totalRecords !== 1 ? "s" : ""}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* TOOLBAR */}
                    <div className="table-toolbar">
                        <div className="search-wrapper">
                            <div className="search-box">
                                <i className="bi bi-search search-icon"></i>
                                <input
                                    type="text"
                                    className="form-control search-input"
                                    placeholder="Search code, name..."
                                    value={search}
                                    onChange={handleSearch}
                                />
                                {search && (
                                    <button
                                        type="button"
                                        className="clear-search"
                                        onClick={clearSearch}
                                        title="Clear Search"
                                    >
                                        <i className="bi bi-x-circle-fill"></i>
                                    </button>
                                )}
                            </div>
                        </div>

                        <div className="page-size-wrapper">
                            <span className="page-size-label">Show</span>
                            <select
                                className="form-select page-size-select"
                                value={pageSize}
                                onChange={handlePageSize}
                            >
                                <option value="10">10</option>
                                <option value="25">25</option>
                                <option value="50">50</option>
                                <option value="100">100</option>
                            </select>
                            <span className="page-size-label">entries</span>
                        </div>
                    </div>

                    {/* TABLE */}
                    <div className="card-body p-0">
                        <div className="table-responsive">
                            <table className="table consultant-table mb-0">
                                <thead>
                                    <tr>
                                        <th className="serial-column">#</th>
                                        <th>Action</th>
                                        <th>Code</th>
                                        <th>Franchise</th>
                                        <th>Contact Person</th>
                                        <th>Mobile No</th>
                                        <th>Location</th>
                                        <th>Login Details</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {loading ? (
                                        <tr>
                                            <td colSpan="8" className="loading-cell">
                                                <div className="spinner-border text-primary"></div>
                                                <div className="loading-text">
                                                    Loading franchises...
                                                </div>
                                            </td>
                                        </tr>
                                    ) : data.length === 0 ? (
                                        <tr>
                                            <td colSpan="8" className="empty-cell">
                                                <div className="empty-icon">
                                                    <i className="bi bi-inbox"></i>
                                                </div>
                                                <h5 className="empty-title">
                                                    No Franchises Found
                                                </h5>
                                                <p className="empty-text">
                                                    No records match your search.
                                                </p>
                                                {search && (
                                                    <button
                                                        type="button"
                                                        className="btn btn-outline-primary btn-sm mt-2"
                                                        onClick={clearSearch}
                                                    >
                                                        <i className="bi bi-x-circle me-1"></i>
                                                        Clear Search
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ) : (
                                        data.map((item, index) => {
                                            const id = item.id ?? index;
                                            const pwVisible = showPassword[id];

                                            return (
                                                <tr key={id}>
                                                    <td>
                                                        <span className="serial-number">
                                                            {(pageNo - 1) * pageSize + index + 1}
                                                        </span>
                                                    </td>

                                                    <td>
                                                        <button
                                                            type="button"
                                                            className="action-main-btn"
                                                            onClick={() => openActionModal(item)}
                                                        >
                                                            <i className="bi bi-grid-3x3-gap-fill"></i>
                                                            <span>Actions</span>
                                                        </button>
                                                    </td>

                                                    <td>
                                                        <span className="code-badge">
                                                            {item.code || "-"}
                                                        </span>
                                                    </td>

                                                    <td>
                                                        <div className="consultant-info">
                                                            <div>
                                                                <div className="consultant-name">
                                                                    {item.name || "-"}
                                                                </div>
                                                                <div className="consultant-role">
                                                                    Franchise
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </td>

                                                    <td>
                                                        <div className="contact-person">
                                                            {item.fatherName || "-"}
                                                        </div>
                                                    </td>

                                                    <td>
                                                        <div className="mobile-info">
                                                            <div className="mobile-icon">
                                                                <i className="bi bi-telephone-fill"></i>
                                                            </div>
                                                            <span>{item.mobileNo || "-"}</span>

                                                            {item.mobileNo && (
                                                                <button
                                                                    type="button"
                                                                    className="copy-btn"
                                                                    onClick={() =>
                                                                        copyToClipboard(
                                                                            item.mobileNo,
                                                                            "mobile",
                                                                            id
                                                                        )
                                                                    }
                                                                    title="Copy Mobile"
                                                                >
                                                                    <i
                                                                        className={`bi ${copiedField === `mobile-${id}`
                                                                                ? "bi-check2 text-success"
                                                                                : "bi-clipboard text-primary"
                                                                            }`}
                                                                    ></i>
                                                                </button>
                                                            )}
                                                        </div>
                                                    </td>

                                                    <td>
                                                        <div className="location-info">
                                                            <div className="location-icon">
                                                                <i className="bi bi-geo-alt-fill"></i>
                                                            </div>
                                                            <div>
                                                                <div className="city-name">
                                                                    {item.cityName || "-"}
                                                                </div>
                                                                <div className="location-sub">
                                                                    {item.districtName || ""}
                                                                    {item.districtName && item.stateName
                                                                        ? ", "
                                                                        : ""}
                                                                    {item.stateName || ""}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </td>

                                                    <td>
                                                        <div className="login-details">
                                                            <div className="login-item">
                                                                <div className="login-label">
                                                                    <i className="bi bi-person-circle"></i>
                                                                    Username
                                                                </div>
                                                                <div className="login-value">
                                                                    {item.userName || "-"}
                                                                </div>
                                                            </div>

                                                            <div className="login-item">
                                                                <div className="login-label password-label">
                                                                    <i className="bi bi-key-fill"></i>
                                                                    Password
                                                                </div>
                                                                <div className="login-value password-value">
                                                                    {pwVisible ? (
                                                                        <>
                                                                            {item.password || "-"}
                                                                            <button
                                                                                type="button"
                                                                                className="btn btn-sm p-0 ms-2 border-0"
                                                                                onClick={() => togglePassword(id)}
                                                                                title="Hide"
                                                                            >
                                                                                <i className="bi bi-eye-slash text-muted"></i>
                                                                            </button>
                                                                        </>
                                                                    ) : (
                                                                        <>
                                                                            ••••••
                                                                            <button
                                                                                type="button"
                                                                                className="btn btn-sm p-0 ms-2 border-0"
                                                                                onClick={() => togglePassword(id)}
                                                                                title="Show"
                                                                            >
                                                                                <i className="bi bi-eye text-muted"></i>
                                                                            </button>
                                                                        </>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* PAGINATION */}
                    <div className="table-footer">
                        <div className="record-info">
                            Showing <strong>{startRecord}</strong> to{" "}
                            <strong>{endRecord}</strong> of{" "}
                            <strong>{totalRecords}</strong> records
                        </div>

                        <div className="bottom-pagination">
                            <button
                                type="button"
                                className="pagination-btn"
                                disabled={pageNo <= 1 || loading}
                                onClick={() => setPageNo((prev) => prev - 1)}
                            >
                                <i className="bi bi-chevron-left"></i>
                                <span>Previous</span>
                            </button>

                            <div className="page-numbers">
                                {Array.from(
                                    {
                                        length: Math.min(6, totalPages - pageNo + 1),
                                    },
                                    (_, index) => pageNo + index
                                ).map((page) => (
                                    <button
                                        key={page}
                                        type="button"
                                        className={`page-number-btn ${pageNo === page ? "active" : ""
                                            }`}
                                        disabled={loading}
                                        onClick={() => setPageNo(page)}
                                    >
                                        {page}
                                    </button>
                                ))}
                            </div>

                            <span className="page-of">of {totalPages || 1}</span>

                            <button
                                type="button"
                                className="pagination-btn"
                                disabled={
                                    pageNo >= totalPages || totalPages === 0 || loading
                                }
                                onClick={() => setPageNo((prev) => prev + 1)}
                            >
                                <span>Next</span>
                                <i className="bi bi-chevron-right"></i>
                            </button>
                        </div>
                    </div>

                </div>
            </section>

            {/* ACTION MODAL */}
            {showActionModal && selectedFranchise && (
                <div className="custom-modal-overlay" onClick={closeActionModal}>
                    <div
                        className="action-modal"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* HEADER */}
                        <div className="action-modal-header">
                            <div className="action-modal-avatar">
                                <i className="bi bi-shop-window"></i>
                            </div>
                            <div className="action-modal-title">
                                <h5>{selectedFranchise.name || "Franchise"}</h5>
                                <small>
                                    Code: <b>{selectedFranchise.code || "N/A"}</b>
                                </small>
                            </div>
                            <button
                                type="button"
                                className="action-modal-close"
                                onClick={closeActionModal}
                            >
                                <i className="bi bi-x-lg"></i>
                            </button>
                        </div>

                        {/* BODY */}
                        <div className="action-modal-body">

                            {/* ==================== FRANCHISE ==================== */}
                            <div className="action-group-title">
                                <i className="bi bi-shop"></i>
                                Franchise
                            </div>

                            <button
                                type="button"
                                className="action-item id-card-item"
                                onClick={handleIdCard}
                            >
                                <div className="action-item-icon">
                                    <i className="bi bi-person-vcard"></i>
                                </div>
                                <div className="action-item-content">
                                    <strong>ID Card</strong>
                                    <small>View & print</small>
                                </div>
                            </button>

                            <button
                                type="button"
                                className="action-item authority-item"
                                onClick={handleAuthorityLetter}
                            >
                                <div className="action-item-icon">
                                    <i className="bi bi-file-earmark-text"></i>
                                </div>
                                <div className="action-item-content">
                                    <strong>Authority Letter</strong>
                                    <small>View & print</small>
                                </div>
                            </button>

                            {/* ✅ NEW: Address Print */}
                            <button
                                type="button"
                                className="action-item address-item"
                                onClick={handleAddressPrint}
                            >
                                <div className="action-item-icon">
                                    <i className="bi bi-printer-fill"></i>
                                </div>
                                <div className="action-item-content">
                                    <strong>Address Print</strong>
                                    <small>Print address label</small>
                                </div>
                            </button>

                            {/* ==================== STUDENT ==================== */}
                            <div className="action-group-title">
                                <i className="bi bi-people"></i>
                                Student
                            </div>

                            <button
                                type="button"
                                className="action-item student-item"
                                onClick={handleStudentAdd}
                            >
                                <div className="action-item-icon">
                                    <i className="bi bi-person-plus-fill"></i>
                                </div>
                                <div className="action-item-content">
                                    <strong>Student Add</strong>
                                    <small>New student entry</small>
                                </div>
                            </button>

                            <button
                                type="button"
                                className="action-item student-item"
                                onClick={handleStudentList}
                            >
                                <div className="action-item-icon">
                                    <i className="bi bi-list-ul"></i>
                                </div>
                                <div className="action-item-content">
                                    <strong>Student List</strong>
                                    <small>View all students</small>
                                </div>
                            </button>

                            <button
                                type="button"
                                className="action-item student-item"
                                onClick={handleStudentSendToConfirm}
                            >
                                <div className="action-item-icon">
                                    <i className="bi bi-send-check-fill"></i>
                                </div>
                                <div className="action-item-content">
                                    <strong>Send to Confirm</strong>
                                    <small>Send for confirmation</small>
                                </div>
                            </button>

                            {/* ==================== WALLET ==================== */}
                            <div className="action-group-title">
                                <i className="bi bi-wallet2"></i>
                                Wallet
                            </div>

                            <button
                                type="button"
                                className="action-item wallet-item"
                                onClick={handleWallet}
                            >
                                <div className="action-item-icon">
                                    <i className="bi bi-cash-coin"></i>
                                </div>
                                <div className="action-item-content">
                                    <strong>Recharge</strong>
                                    <small>Add money to wallet</small>
                                </div>
                            </button>

                            <button
                                type="button"
                                className="action-item wallet-item"
                                onClick={handleWalletList}
                            >
                                <div className="action-item-icon">
                                    <i className="bi bi-clock-history"></i>
                                </div>
                                <div className="action-item-content">
                                    <strong>Wallet History</strong>
                                    <small>All transactions</small>
                                </div>
                            </button>

                        </div>

                        {/* FOOTER */}
                        <div className="action-modal-footer">
                            <button
                                type="button"
                                className="btn btn-light w-100"
                                onClick={closeActionModal}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* STYLES */}
            <style>{`
/* PAGE HEADER */
.page-header { padding: 5px 2px; }
.page-title {
  font-size: 25px;
  font-weight: 700;
  color: #1e293b;
  letter-spacing: -0.4px;
}
.page-title i { font-size: 23px; }
.page-subtitle { color: #64748b; font-size: 14px; }

/* CARD */
.section {
  display: block !important;
  width: 100% !important;
  max-width: 100% !important;
  min-width: 0 !important;
  overflow-x: hidden !important;
}
.consultant-card {
  width: 100% !important;
  max-width: 100% !important;
  min-width: 0 !important;
  border: 1px solid #e8edf3 !important;
  border-radius: 16px !important;
  background: #ffffff;
  overflow: hidden !important;
  position: relative;
  box-shadow: 0 4px 18px rgba(15, 23, 42, 0.055);
}
.consultant-header {
  background: #ffffff;
  padding: 20px 24px;
  border-bottom: 1px solid #edf0f4;
}
.consultant-title {
  font-size: 18px;
  font-weight: 700;
  color: #1e293b;
}
.consultant-title i { font-size: 17px; }
.total-text { color: #94a3b8; font-size: 13px; }
.total-text strong { color: #334155; font-weight: 700; }

/* TOOLBAR */
.table-toolbar {
  width: 100% !important;
  max-width: 100% !important;
  min-width: 0 !important;
  box-sizing: border-box;
  padding: 17px 24px;
  background: #ffffff;
  border-bottom: 1px solid #edf0f4;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  overflow: hidden !important;
}
.search-wrapper { width: 320px; max-width: 100%; }
.search-box { position: relative; width: 100%; }
.search-input {
  height: 40px;
  padding-left: 40px;
  padding-right: 40px;
  border: 1px solid #e2e8f0;
  border-radius: 9px;
  background: #f8fafc;
  color: #334155;
  font-size: 13px;
  box-shadow: none !important;
  transition: all .2s ease;
}
.search-input::placeholder { color: #94a3b8; }
.search-input:focus {
  border-color: #93c5fd;
  background: #ffffff;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.08) !important;
}
.search-icon {
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  color: #94a3b8;
  font-size: 14px;
  z-index: 2;
}
.clear-search {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  width: 25px;
  height: 25px;
  border: 0;
  background: transparent;
  color: #94a3b8;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all .2s ease;
}
.clear-search:hover { color: #dc3545; }

.page-size-wrapper {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #64748b;
  font-size: 13px;
  white-space: nowrap;
}
.page-size-label { color: #64748b; font-size: 13px; }
.page-size-select {
  width: 75px;
  height: 38px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  color: #334155;
  background-color: #ffffff;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  box-shadow: none !important;
}
.page-size-select:focus {
  border-color: #93c5fd;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, .08) !important;
}

/* TABLE */
.consultant-card > .card-body {
  display: block !important;
  width: 100% !important;
  max-width: 100% !important;
  min-width: 0 !important;
  padding: 0 !important;
  overflow: hidden !important;
}
.consultant-card > .card-body > .table-responsive {
  display: block !important;
  width: 0 !important;
  min-width: 100% !important;
  max-width: 100% !important;
  box-sizing: border-box !important;
  overflow-x: auto !important;
  overflow-y: hidden !important;
  position: relative !important;
  -webkit-overflow-scrolling: touch;
  scrollbar-gutter: stable;
}
.consultant-card > .card-body > .table-responsive > .consultant-table {
  display: table !important;
  width: auto !important;
  min-width: 100% !important;
  max-width: none !important;
  margin: 0 !important;
  table-layout: auto !important;
  border-collapse: separate;
  border-spacing: 0;
}
.consultant-table thead th {
  background: #f8fafc;
  color: #64748b;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: .55px;
  padding: 14px;
  border-bottom: 1px solid #e2e8f0;
  white-space: nowrap;
  vertical-align: middle;
}
.consultant-table tbody td {
  padding: 15px 14px;
  border-bottom: 1px solid #f1f5f9;
  color: #334155;
  font-size: 13px;
  vertical-align: middle;
  background: #ffffff;
  white-space: nowrap;
}
.consultant-table tbody tr { transition: background-color .18s ease; }
.consultant-table tbody tr:hover td { background: #f8fbff; }
.consultant-table tbody tr:last-child td { border-bottom: 0; }

.serial-column { padding-left: 24px !important; }
.serial-number {
  width: 30px;
  height: 30px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: #f1f5f9;
  color: #64748b;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 600;
}
.code-badge {
  display: inline-flex;
  align-items: center;
  background: #eff6ff;
  color: #2563eb;
  border: 1px solid #dbeafe;
  padding: 6px 10px;
  border-radius: 7px;
  font-size: 12px;
  font-weight: 700;
  white-space: nowrap;
}
.consultant-info { display: flex; align-items: center; }
.consultant-name {
  color: #1e293b;
  font-weight: 700;
  font-size: 14px;
  white-space: nowrap;
}
.consultant-role { color: #94a3b8; font-size: 11px; margin-top: 2px; }
.contact-person { font-weight: 500; color: #475569; white-space: nowrap; }
.mobile-info {
  display: flex;
  align-items: center;
  gap: 8px;
  white-space: nowrap;
}
.mobile-icon {
  width: 30px;
  height: 30px;
  min-width: 30px;
  border-radius: 8px;
  background: #eff6ff;
  color: #2563eb;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
}
.copy-btn {
  border: 0;
  background: transparent;
  padding: 2px 4px;
  cursor: pointer;
  font-size: 13px;
}
.location-info { display: flex; align-items: flex-start; }
.location-icon {
  width: 30px;
  height: 30px;
  min-width: 30px;
  border-radius: 8px;
  background: #fff1f2;
  color: #ef4444;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 9px;
  font-size: 12px;
}
.city-name {
  color: #334155;
  font-weight: 600;
  font-size: 13px;
  white-space: nowrap;
}
.location-sub {
  color: #94a3b8;
  font-size: 11px;
  margin-top: 2px;
  white-space: nowrap;
}
.login-details { min-width: 175px; }
.login-item { display: flex; flex-direction: column; gap: 3px; }
.login-item + .login-item { margin-top: 9px; }
.login-label {
  display: flex;
  align-items: center;
  color: #94a3b8;
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: .4px;
}
.login-label i { color: #2563eb; margin-right: 6px; font-size: 11px; }
.password-label i { color: #f59e0b; }
.login-value {
  padding-left: 17px;
  color: #334155;
  font-size: 13px;
  font-weight: 600;
  word-break: break-word;
}
.password-value {
  color: #dc3545;
  font-family: monospace;
  font-weight: 700;
  letter-spacing: .3px;
}

/* ACTION MAIN BUTTON */
.action-main-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  height: 36px;
  padding: 0 16px;
  border: 1px solid #dbeafe;
  background: #eff6ff;
  color: #2563eb;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
  transition: all .2s ease;
  white-space: nowrap;
}
.action-main-btn i { font-size: 14px; }
.action-main-btn:hover {
  background: #2563eb;
  border-color: #2563eb;
  color: #ffffff;
  transform: translateY(-2px);
  box-shadow: 0 4px 10px rgba(37,99,235,.25);
}

/* MODAL */
.custom-modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, .55);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 20px;
  animation: fadeIn .2s ease;
}
.action-modal {
  width: 100%;
  max-width: 580px;
  background: #ffffff;
  border-radius: 18px;
  overflow: hidden;
  box-shadow: 0 25px 70px rgba(0,0,0,.25);
  animation: modalSlide .25s ease;
}
.action-modal-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 20px;
  background: linear-gradient(135deg, #eff6ff, #dbeafe);
  border-bottom: 1px solid #e2e8f0;
  position: relative;
}
.action-modal-avatar {
  width: 48px;
  height: 48px;
  min-width: 48px;
  border-radius: 12px;
  background: #2563eb;
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
}
.action-modal-title h5 {
  margin: 0;
  font-size: 16px;
  font-weight: 700;
  color: #1e293b;
  line-height: 1.3;
}
.action-modal-title small { color: #64748b; font-size: 12px; }
.action-modal-close {
  position: absolute;
  top: 12px;
  right: 12px;
  width: 32px;
  height: 32px;
  border: 0;
  background: rgba(255,255,255,.7);
  color: #475569;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all .2s ease;
}
.action-modal-close:hover { background: #dc3545; color: #ffffff; }

/* MODAL BODY — 2 COLUMN GRID */
.action-modal-body {
  padding: 16px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  max-height: 480px;
  overflow-y: auto;
}

/* GROUP TITLE — full width */
.action-group-title {
  grid-column: 1 / -1;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 11px;
  font-weight: 800;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: .6px;
  padding: 6px 4px 2px;
  margin-top: 2px;
}
.action-group-title i { font-size: 13px; color: #94a3b8; }

/* ACTION ITEM — vertical card */
.action-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 14px 10px;
  border: 1px solid #e8edf3;
  background: #ffffff;
  border-radius: 12px;
  cursor: pointer;
  transition: all .2s ease;
  text-align: center;
  width: 100%;
  min-height: 110px;
}
.action-item:hover {
  transform: translateY(-2px);
  border-color: transparent;
  box-shadow: 0 8px 20px rgba(15,23,42,.08);
}

.action-item-icon {
  width: 44px;
  height: 44px;
  min-width: 44px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  transition: all .2s ease;
}

.action-item-content {
  display: flex;
  flex-direction: column;
  gap: 3px;
  align-items: center;
  text-align: center;
}
.action-item-content strong {
  color: #1e293b;
  font-size: 12px;
  font-weight: 700;
  line-height: 1.3;
}
.action-item-content small {
  color: #94a3b8;
  font-size: 10px;
  line-height: 1.3;
}

/* ITEM COLORS */
.id-card-item .action-item-icon { background: #eff6ff; color: #2563eb; }
.id-card-item:hover .action-item-icon { background: #2563eb; color: #ffffff; }

.authority-item .action-item-icon { background: #ecfdf5; color: #059669; }
.authority-item:hover .action-item-icon { background: #059669; color: #ffffff; }

/* ✅ ADDRESS PRINT COLOR */
.address-item .action-item-icon { background: #fef3c7; color: #d97706; }
.address-item:hover .action-item-icon { background: #d97706; color: #ffffff; }

.student-item .action-item-icon { background: #fff7ed; color: #ea580c; }
.student-item:hover .action-item-icon { background: #ea580c; color: #ffffff; }

.wallet-item .action-item-icon { background: #f5f3ff; color: #7c3aed; }
.wallet-item:hover .action-item-icon { background: #7c3aed; color: #ffffff; }

.action-modal-footer {
  padding: 12px 16px 16px;
  border-top: 1px solid #f1f5f9;
}

/* SCROLLBAR */
.consultant-card > .card-body > .table-responsive::-webkit-scrollbar { height: 9px; }
.consultant-card > .card-body > .table-responsive::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-top: 1px solid #e2e8f0;
}
.consultant-card > .card-body > .table-responsive::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 10px;
  border: 2px solid #f1f5f9;
}
.consultant-card > .card-body > .table-responsive::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

.loading-cell { height: 300px; text-align: center; }
.loading-text { color: #64748b; margin-top: 10px; font-size: 13px; }
.empty-cell { height: 300px; text-align: center; }
.empty-icon {
  width: 65px;
  height: 65px;
  margin: auto;
  border-radius: 50%;
  background: #f1f5f9;
  color: #94a3b8;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
}
.empty-title { color: #334155; font-size: 16px; margin-top: 15px; }
.empty-text { color: #94a3b8; font-size: 13px; margin-bottom: 0; }

/* FOOTER */
.table-footer {
  width: 100% !important;
  max-width: 100% !important;
  min-width: 0 !important;
  box-sizing: border-box;
  padding: 17px 24px;
  background: #ffffff;
  border-top: 1px solid #edf0f4;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  overflow: hidden !important;
}
.record-info { color: #94a3b8; font-size: 13px; }
.record-info strong { color: #334155; }

.bottom-pagination { display: flex; align-items: center; gap: 8px; }
.pagination-btn {
  height: 38px;
  padding: 0 14px;
  border: 1px solid #e2e8f0;
  background: #ffffff;
  color: #475569;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  font-size: 13px;
  font-weight: 500;
  transition: all .2s ease;
  white-space: nowrap;
}
.pagination-btn:hover:not(:disabled) {
  background: #0d6efd;
  border-color: #0d6efd;
  color: #ffffff;
  box-shadow: 0 3px 8px rgba(13,110,253,.15);
}
.pagination-btn:disabled { opacity: .45; cursor: not-allowed; }
.page-of {
  color: #64748b;
  font-size: 13px;
  margin-right: 4px;
  white-space: nowrap;
}
.page-numbers { display: flex; align-items: center; gap: 6px; }
.page-number-btn {
  width: 38px;
  height: 38px;
  border: 1px solid #dfe3eb;
  background: #fff;
  color: #344054;
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;
  transition: 0.2s ease;
}
.page-number-btn:hover:not(:disabled) { background: #f5f7ff; }
.page-number-btn.active {
  background: #4353ee;
  color: #fff;
  border-color: #4353ee;
  box-shadow: 0 5px 12px rgba(67, 83, 238, 0.25);
}
.page-number-btn:disabled { cursor: default; }

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
@keyframes modalSlide {
  from { opacity: 0; transform: translateY(20px) scale(.97); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}

@media (max-width: 768px) {
  .page-title { font-size: 21px; }
  .page-subtitle { font-size: 13px; }
  .consultant-header { padding: 17px 15px; }
  .table-toolbar {
    flex-direction: column;
    align-items: stretch;
    padding: 15px;
    gap: 12px;
  }
  .search-wrapper { width: 100%; }
  .page-size-wrapper { justify-content: flex-end; }
  .table-footer {
    flex-direction: column;
    align-items: center;
    padding: 15px;
  }
  .record-info { text-align: center; }
  .bottom-pagination { justify-content: center; }
}
@media (max-width: 480px) {
  .action-modal-body {
    grid-template-columns: 1fr;
  }
  .page-size-label { display: none; }
  .page-size-select { width: 70px; }
  .pagination-btn { padding: 0 10px; height: 36px; }
}

html, body, #root {
  width: 100% !important;
  max-width: 100% !important;
  overflow-x: hidden !important;
}
            `}</style>
        </>
    );
}

export default EmpFranchiseList;