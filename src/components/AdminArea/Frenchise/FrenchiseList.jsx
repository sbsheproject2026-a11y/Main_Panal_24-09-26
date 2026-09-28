 import React, { useEffect, useState } from "react";
import { getFrenchises, getFrenchiseDelete } from "../../AllServicesFiles/FrenchiseService";
import { useNavigate, useParams } from "react-router-dom";

function FrenchiseList() {
    const { typeid } = useParams();
    const [data, setData] = useState([]);
    const [search, setSearch] = useState("");
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteId, setDeleteId] = useState(0);
    const [pageNo, setPageNo] = useState(1);
    const [pageSize, setPageSize] = useState(100);
    const [totalRecords, setTotalRecords] = useState(0);
    const [loading, setLoading] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);

    const navigate = useNavigate();

    const handleEdit = (id) => {
        navigate(`/study-centre-update/${id}`);
    };


    useEffect(() => {
        loadAccAcounts();
    }, [typeid, pageNo, pageSize, search]);

    const loadAccAcounts = async () => {
        try {
            setLoading(true);

            const result = await getFrenchises(
                typeid, pageNo,
                pageSize,
                search
            );

            setData(result?.data?.data || []);
            setTotalRecords(result?.data?.totalRecords || 0);
        } catch (error) {
            console.log("Error loading accounts:", error);
            setData([]);
            setTotalRecords(0);
        } finally {
            setLoading(false);
        }
    };

    const totalPages = Math.ceil(totalRecords / pageSize);

    const handleSearch = (e) => {
        setSearch(e.target.value);
        setPageNo(1);
    };

    const handlePageSize = (e) => {
        setPageSize(Number(e.target.value));
        setPageNo(1);
    };

    const confirmDelete = async () => {
        try {
            setDeleteLoading(true);
            await getFrenchiseDelete(deleteId);
            setShowDeleteModal(false);
            setDeleteId(0);
            await loadAccAcounts();
        } catch (error) {
            console.log(error);
            alert("Something went wrong while deleting.");
        } finally {
            setDeleteLoading(false);
        }
    };

    return (
        <>

            <style>
                {`

                /* =====================================================
                   GLOBAL PAGE OVERFLOW FIX
                   ===================================================== */

                html,
                body,
                #root {
                    width: 100%;
                    max-width: 100%;
                    overflow-x: hidden !important;
                }


                /* =====================================================
                   PAGE
                   ===================================================== */

                .franchise-page {
                    background: #f6f8fc;
                    min-height: 100vh;
                    padding: 25px;

                    width: 100%;
                    max-width: 100%;
                    min-width: 0;

                    overflow-x: hidden;

                    box-sizing: border-box;
                }


                /* =====================================================
                   HEADER
                   ===================================================== */

                .franchise-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 25px;

                    min-width: 0;
                    max-width: 100%;
                }

                .franchise-title {
                    margin: 0;
                    font-size: 27px;
                    font-weight: 700;
                    color: #172033;
                }

                .franchise-subtitle {
                    color: #7b8497;
                    margin-top: 6px;
                    font-size: 14px;
                }

                .franchise-breadcrumb {
                    background: transparent;
                    padding: 0;
                    margin: 8px 0 0;
                }


                /* =====================================================
                   CARD
                   ===================================================== */

                .franchise-card {
                    border: 0;
                    border-radius: 18px;
                    background: #ffffff;
                    box-shadow: 0 8px 30px rgba(30, 41, 59, 0.07);
                    overflow: hidden;

                    width: 100%;
                    max-width: 100%;
                    min-width: 0;

                    box-sizing: border-box;
                }

                .authority-letter {
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

                /* =====================================================
                   CARD HEADER
                   ===================================================== */

                .franchise-card-header {
                    padding: 22px 24px;
                    border-bottom: 1px solid #edf0f5;

                    display: flex;
                    justify-content: space-between;
                    align-items: center;

                    gap: 15px;
                    flex-wrap: wrap;

                    min-width: 0;
                    max-width: 100%;

                    box-sizing: border-box;
                }

                .franchise-card-title {
                    display: flex;
                    align-items: center;
                    gap: 12px;

                    min-width: 0;
                }

                .franchise-card-icon {
                    width: 43px;
                    height: 43px;
                    min-width: 43px;

                    border-radius: 12px;

                    background: linear-gradient(
                        135deg,
                        #4154f1,
                        #6c7cff
                    );

                    color: white;

                    display: flex;
                    align-items: center;
                    justify-content: center;

                    font-size: 19px;
                }

                .franchise-card-title h5 {
                    margin: 0;
                    color: #172033;
                    font-size: 18px;
                    font-weight: 700;
                }

                .franchise-card-title span {
                    display: block;
                    color: #8991a3;
                    font-size: 12px;
                    margin-top: 3px;
                }


                /* =====================================================
                   SEARCH / TOOLS
                   ===================================================== */

                .franchise-tools {
                    padding: 20px 24px;
                    background: #fbfcfe;
                    border-bottom: 1px solid #edf0f5;

                    width: 100%;
                    max-width: 100%;
                    min-width: 0;

                    box-sizing: border-box;
                }

                .franchise-search {
                    position: relative;
                    max-width: 100%;
                }

                .franchise-search i {
                    position: absolute;
                    left: 14px;
                    top: 50%;

                    transform: translateY(-50%);

                    color: #8d96a8;
                    z-index: 2;
                }

                .franchise-search input {
                    height: 45px;

                    border: 1px solid #e2e6ee;
                    border-radius: 10px;

                    padding-left: 42px;

                    font-size: 14px;

                    box-shadow: none;

                    max-width: 100%;
                    box-sizing: border-box;
                }

                .franchise-search input:focus {
                    border-color: #4154f1;

                    box-shadow:
                        0 0 0 3px rgba(65, 84, 241, 0.08);
                }

                .franchise-page-size {
                    height: 45px;

                    border: 1px solid #e2e6ee;
                    border-radius: 10px;

                    padding: 0 14px;

                    color: #4d5668;
                    background: white;

                    outline: none;
                }


                /* =====================================================
                   CARD BODY
                   ===================================================== */

                .franchise-card > .card-body {
                    width: 100%;
                    max-width: 100%;
                    min-width: 0;

                    overflow: hidden;

                    box-sizing: border-box;
                }


                /* =====================================================
                   TABLE WRAPPER
                   ONLY THIS AREA WILL SCROLL
                   ===================================================== */

                .franchise-table-wrapper {
                    display: block;

                    width: 0 !important;
                    min-width: 100% !important;
                    max-width: 100% !important;

                    overflow-x: auto !important;
                    overflow-y: hidden !important;

                    box-sizing: border-box;

                    position: relative;

                    -webkit-overflow-scrolling: touch;

                    scrollbar-gutter: stable;

                    contain: inline-size;
                }


                /* =====================================================
                   TABLE  (AUTO WIDTH — NO FIXED COLUMN WIDTHS)
                   ===================================================== */

                .franchise-table {
                    display: table;

                    width: auto !important;
                    min-width: 100% !important;
                    max-width: none !important;

                    margin: 0;

                    border-collapse: separate;
                    border-spacing: 0;

                    table-layout: auto;
                }


                /* =====================================================
                   TABLE HEADER
                   ===================================================== */

                .franchise-table thead th {
                    background: #f8f9fc;

                    color: #687185;

                    font-size: 12px;
                    font-weight: 700;

                    text-transform: uppercase;
                    letter-spacing: .3px;

                    padding: 15px 16px;

                    border-bottom: 1px solid #e9edf3;

                    white-space: nowrap;

                    box-sizing: border-box;

                    vertical-align: middle;
                }


                /* =====================================================
                   TABLE BODY
                   ===================================================== */

                .franchise-table tbody td {
                    padding: 15px 16px;

                    color: #414a5d;

                    font-size: 13px;

                    vertical-align: middle;

                    border-bottom: 1px solid #f0f2f6;

                    white-space: nowrap;

                    box-sizing: border-box;

                    height: 66px;
                }

                .franchise-table tbody tr:hover {
                    background: #fafbff;
                }


                /* =====================================================
                   TABLE CONTENT
                   ===================================================== */

                .franchise-number {
                    width: 38px;
                    height: 38px;

                    border-radius: 10px;

                    display: flex;
                    align-items: center;
                    justify-content: center;

                    background: #eef1ff;
                    color: #4154f1;

                    font-weight: 700;
                    font-size: 12px;
                }

                .franchise-code {
                    display: inline-flex;
                    align-items: center;

                    padding: 6px 10px;

                    border-radius: 7px;

                    background: #f0fdf4;
                    color: #15803d;

                    font-weight: 700;
                    font-size: 12px;

                    white-space: nowrap;
                }

                .franchise-name {
                    font-weight: 700;
                    color: #20283a;

                    display: block;

                    white-space: nowrap;
                }

                .franchise-muted {
                    color: #7c8597;

                    display: block;

                    white-space: nowrap;
                }

                .franchise-contact {
                    color: #475166;
                    font-weight: 500;

                    display: block;

                    white-space: nowrap;
                }

                .franchise-login {
                    display: inline-block;

                    padding: 5px 9px;

                    border-radius: 7px;

                    background: #f4f5f7;
                    color: #424b5c;

                    font-size: 12px;
                    font-weight: 600;

                    white-space: nowrap;
                }

                .franchise-password {
                    display: inline-block;

                    padding: 5px 9px;

                    border-radius: 7px;

                    background: #fff7ed;
                    color: #c2410c;

                    font-size: 12px;
                    font-weight: 600;

                    white-space: nowrap;
                }

                .franchise-location {
                    display: block;

                    color: #586174;

                    white-space: nowrap;
                }


                /* =====================================================
                   ACTIONS
                   ===================================================== */

                .franchise-actions {
                    display: flex;
                    align-items: center;
                    gap: 8px;

                    white-space: nowrap;
                }

                .franchise-action {
                    width: 36px;
                    height: 36px;

                    flex: 0 0 36px;

                    border: 0;
                    border-radius: 9px;

                    display: flex;
                    align-items: center;
                    justify-content: center;

                    cursor: pointer;

                    transition: all .2s ease;
                }

                .franchise-edit {
                    background: #eef2ff;
                    color: #4154f1;
                }

                .franchise-edit:hover {
                    background: #4154f1;
                    color: white;
                }

                .franchise-delete {
                    background: #fff1f2;
                    color: #e11d48;
                }

                .franchise-delete:hover {
                    background: #e11d48;
                    color: white;
                }


                /* =====================================================
                   TABLE SCROLLBAR
                   ===================================================== */

                .franchise-table-wrapper::-webkit-scrollbar {
                    height: 9px;
                }

                .franchise-table-wrapper::-webkit-scrollbar-track {
                    background: #eef1f5;
                    border-radius: 10px;
                }

                .franchise-table-wrapper::-webkit-scrollbar-thumb {
                    background: #b8bfcc;
                    border-radius: 10px;
                }

                .franchise-table-wrapper::-webkit-scrollbar-thumb:hover {
                    background: #8f98a8;
                }

                .franchise-table-wrapper {
                    scrollbar-width: thin;
                    scrollbar-color: #b8bfcc #eef1f5;
                }


                /* =====================================================
                   EMPTY
                   ===================================================== */

                .franchise-empty {
                    padding: 55px 20px !important;

                    text-align: center;

                    color: #8991a3;
                }

                .franchise-empty i {
                    display: block;

                    font-size: 42px;

                    color: #cbd1dc;

                    margin-bottom: 10px;
                }


                /* =====================================================
                   LOADING
                   ===================================================== */

                .franchise-loading {
                    padding: 50px !important;

                    text-align: center;

                    color: #737d91;
                }


                /* =====================================================
                   PAGINATION
                   ===================================================== */

                .franchise-pagination {
                    padding: 18px 24px;

                    display: flex;
                    justify-content: space-between;
                    align-items: center;

                    gap: 15px;

                    flex-wrap: wrap;

                    min-width: 0;
                    max-width: 100%;

                    box-sizing: border-box;
                }

                .franchise-records {
                    color: #7a8395;
                    font-size: 13px;
                }

                .franchise-records strong {
                    color: #414a5d;
                }

                .franchise-pagination-buttons {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }

                .franchise-page-btn {
                    min-width: 38px;
                    height: 38px;

                    border: 1px solid #e2e6ee;

                    background: white;

                    color: #515a6c;

                    border-radius: 8px;

                    cursor: pointer;

                    font-size: 13px;
                    font-weight: 600;
                }

                .franchise-page-btn:hover:not(:disabled) {
                    background: #4154f1;
                    border-color: #4154f1;
                    color: white;
                }

                .franchise-page-btn:disabled {
                    opacity: .45;
                    cursor: not-allowed;
                }

                .page-numbers {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                }

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

                .page-number-btn:hover:not(:disabled) {
                    background: #f5f7ff;
                }

                .page-number-btn.active {
                    background: #4353ee;
                    color: #fff;
                    border-color: #4353ee;
                    box-shadow: 0 5px 12px rgba(67, 83, 238, 0.25);
                }

                .page-number-btn:disabled {
                    cursor: default;
                }

                .page-of {
                    color: #64748b;
                    font-size: 13px;
                    margin-right: 4px;
                    white-space: nowrap;
                }


                /* =====================================================
                   DELETE MODAL
                   ===================================================== */

                .franchise-modal-overlay {
                    position: fixed;
                    inset: 0;

                    background: rgba(15, 23, 42, 0.65);

                    display: flex;
                    align-items: center;
                    justify-content: center;

                    padding: 20px;

                    z-index: 9999;
                }

                .franchise-modal {
                    width: 100%;
                    max-width: 440px;

                    background: white;

                    border-radius: 18px;

                    overflow: hidden;

                    box-shadow:
                        0 25px 70px rgba(0,0,0,.25);

                    animation:
                        franchiseModalShow .2s ease;
                }

                @keyframes franchiseModalShow {
                    from {
                        opacity: 0;
                        transform: translateY(15px) scale(.98);
                    }

                    to {
                        opacity: 1;
                        transform: translateY(0) scale(1);
                    }
                }

                .franchise-modal-header {
                    background:
                        linear-gradient(
                            135deg,
                            #dc3545,
                            #e63950
                        );

                    color: white;

                    padding: 18px 22px;

                    text-align: center;
                }

                .franchise-modal-header h5 {
                    margin: 0;

                    font-size: 18px;
                    font-weight: 700;
                }

                .franchise-modal-body {
                    padding: 30px 25px;

                    text-align: center;
                }

                .franchise-delete-icon {
                    width: 70px;
                    height: 70px;

                    margin: 0 auto 18px;

                    border-radius: 50%;

                    background: #fff1f2;
                    color: #dc3545;

                    display: flex;
                    align-items: center;
                    justify-content: center;

                    font-size: 30px;
                }

                .franchise-modal-body h5 {
                    color: #20283a;

                    font-weight: 700;

                    margin-bottom: 8px;
                }

                .franchise-modal-body p {
                    color: #7b8497;

                    font-size: 14px;

                    margin: 0;

                    line-height: 1.6;
                }

                .franchise-modal-footer {
                    padding: 18px 25px 24px;

                    display: flex;

                    justify-content: center;

                    gap: 10px;
                }

                .franchise-modal-btn {
                    height: 42px;

                    padding: 0 20px;

                    border-radius: 9px;

                    border: 0;

                    font-weight: 600;

                    cursor: pointer;
                }

                .franchise-cancel {
                    background: #eef0f4;
                    color: #4e5768;
                }

                .franchise-confirm {
                    background: #dc3545;
                    color: white;
                }

                .franchise-confirm:disabled {
                    opacity: .65;
                    cursor: not-allowed;
                }


                /* =====================================================
                   MOBILE
                   ===================================================== */

                @media (max-width: 768px) {

                    .franchise-page {
                        padding: 15px;
                    }

                    .franchise-header {
                        display: block;
                    }

                    .franchise-title {
                        font-size: 23px;
                    }

                    .franchise-card-header {
                        padding: 18px;
                    }

                    .franchise-tools {
                        padding: 15px;
                    }

                    .franchise-pagination {
                        padding: 15px;
                    }

                    .franchise-table-wrapper {
                        width: 0 !important;
                        min-width: 100% !important;
                        max-width: 100% !important;

                        overflow-x: auto !important;
                        overflow-y: hidden !important;
                    }

                    .franchise-table {
                        width: auto !important;
                        min-width: 100% !important;
                        max-width: none !important;
                    }
                }


                /* =====================================================
                   FINAL OVERFLOW SAFETY
                   ===================================================== */

                .franchise-page,
                .franchise-card,
                .franchise-card-header,
                .franchise-tools,
                .franchise-card > .card-body {
                    min-width: 0;
                    max-width: 100%;
                }

                `}
            </style>


            <div className="franchise-page">

                {/* =====================================================
                    HEADER
                    ===================================================== */}

                <div className="franchise-header">

                    <div>

                        <h1 className="franchise-title">
                            Study Centre
                        </h1>

                        <div className="franchise-subtitle">
                            Manage and view all registered study centres
                        </div>

                        <nav>

                            <ol className="breadcrumb franchise-breadcrumb">

                                <li className="breadcrumb-item">
                                    <span>
                                        Dashboard
                                    </span>
                                </li>

                                <li className="breadcrumb-item active">
                                    Study Centre List
                                </li>

                            </ol>

                        </nav>

                    </div>

                </div>


                {/* =====================================================
                    MAIN CARD
                    ===================================================== */}

                <div className="franchise-card">


                    {/* =================================================
                        CARD HEADER
                        ================================================= */}

                    <div className="franchise-card-header">

                        <div className="franchise-card-title">

                            <div className="franchise-card-icon">

                                <i className="bi bi-building"></i>

                            </div>

                            <div>

                                <h5>
                                    Study Centre List
                                </h5>

                                <span>
                                    Total {totalRecords} registered centres
                                </span>

                            </div>

                        </div>

                    </div>


                    {/* =================================================
                        SEARCH
                        ================================================= */}

                    <div className="franchise-tools">

                        <div className="row align-items-center g-3">

                            <div className="col-md-6 col-lg-5">

                                <div className="franchise-search">

                                    <i className="bi bi-search"></i>

                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Search by Code or Name..."
                                        value={search}
                                        onChange={handleSearch}
                                    />

                                </div>

                            </div>


                            <div className="col-md-3 col-lg-2">

                                <select
                                    className="form-select franchise-page-size"
                                    value={pageSize}
                                    onChange={handlePageSize}
                                >

                                    <option value={100}>
                                        100 Records
                                    </option>

                                    <option value={250}>
                                        250 Records
                                    </option>

                                    <option value={500}>
                                        500 Records
                                    </option>

                                </select>

                            </div>

                        </div>

                    </div>


                    {/* =================================================
                        TABLE
                        ================================================= */}

                    <div className="franchise-table-wrapper">

                        <table className="franchise-table">

                            <thead>

                                <tr>

                                    <th>#</th>

                                    <th>
                                        Print
                                    </th>
                                    <th>
                                        Code
                                    </th>

                                    <th>
                                        Name
                                    </th>

                                    <th>
                                        Contact Person
                                    </th>

                                    <th>
                                        Address
                                    </th>

                                    <th>
                                        Mobile No
                                    </th>

                                    <th>
                                        Username
                                    </th>

                                    <th>
                                        Password
                                    </th>

                                    <th>
                                        City
                                    </th>

                                    <th>
                                        Action
                                    </th>

                                </tr>

                            </thead>


                            <tbody>

                                {loading ? (

                                    <tr>

                                        <td
                                            colSpan="11"
                                            className="franchise-loading"
                                        >

                                            <div className="spinner-border text-primary mb-2"></div>

                                            <div>
                                                Loading study centres...
                                            </div>

                                        </td>

                                    </tr>

                                ) : data.length === 0 ? (

                                    <tr>

                                        <td
                                            colSpan="11"
                                            className="franchise-empty"
                                        >

                                            <i className="bi bi-building-x"></i>

                                            <div>
                                                No study centre found
                                            </div>

                                            <small>
                                                Try changing your search
                                                criteria.
                                            </small>

                                        </td>

                                    </tr>

                                ) : (

                                    data.map((item, index) => (

                                        <tr
                                            key={item.id || index}
                                        >

                                            {/* =====================
                                                #
                                                ===================== */}

                                            <td>

                                                <div className="franchise-number">

                                                    {(pageNo - 1) *
                                                        pageSize +
                                                        index +
                                                        1}

                                                </div>

                                            </td>


                                            {/* =====================
                                                PRINT
                                                ===================== */}

                                            <td>
                          <div className="d-flex flex-column gap-2 align-items-center">

                            {/* ================= ID CARD VIEW ================= */}
                            <div className="authority-letter">
                              <a
                                href="#"
                                className="authority-view-btn"
                                title="View ID Card"
                                onClick={(e) => {
                                  e.preventDefault();
                                  navigate(`/id-card-print/${item.id}`);
                                }}
                              >
                                <i className="bi bi-person-vcard me-1"></i>
                                <span>ID Card View</span>
                              </a>
                            </div>

                            {/* ================= AUTHORITY LETTER VIEW ================= */}
                            <div className="authority-letter">
                              <a
                                href="#"
                                className="authority-view-btn"
                                title="View Authority Letter"
                                onClick={(e) => {
                                  e.preventDefault();
                                  navigate(`/authority-letterPrint-print/${item.id}`);
                                }}
                              >
                                <i className="bi bi-file-earmark-text me-1"></i>
                                <span>Authority Letter</span>
                              </a>
                            </div>

                          </div>
                        </td>

                                            <td>

                                                <span className="franchise-code">

                                                    {item.code || "-"}

                                                </span>

                                            </td>


                                            {/* =====================
                                                NAME
                                                ===================== */}

                                            <td>

                                                <span className="franchise-name">

                                                    {item.name || "-"}

                                                </span>

                                            </td>


                                            {/* =====================
                                                CONTACT PERSON
                                                ===================== */}

                                            <td>

                                                <span className="franchise-contact">

                                                    {item.fatherName || "-"}

                                                </span>

                                            </td>


                                            {/* =====================
                                                ADDRESS
                                                ===================== */}

                                            <td>

                                                <span className="franchise-muted">

                                                    {item.address || "-"}

                                                </span>

                                            </td>


                                            {/* =====================
                                                MOBILE
                                                ===================== */}

                                            <td>

                                                {item.mobileNo || "-"}

                                            </td>


                                            {/* =====================
                                                USERNAME
                                                ===================== */}

                                            <td>

                                                <span className="franchise-login">

                                                    {item.userName || "-"}

                                                </span>

                                            </td>


                                            {/* =====================
                                                PASSWORD
                                                ===================== */}

                                            <td>

                                                <span className="franchise-password">

                                                    {item.password || "-"}

                                                </span>

                                            </td>


                                            {/* =====================
                                                CITY
                                                ===================== */}

                                            <td>

                                                <span className="franchise-location">

                                                    {item.cityName || "-"}

                                                </span>

                                            </td>


                                            {/* =====================
                                                ACTION
                                                ===================== */}

                                            <td>

                                                <div className="franchise-actions">

                                                    <button
                                                        type="button"
                                                        className="franchise-action franchise-edit"
                                                        title="Edit"
                                                        onClick={() =>
                                                            handleEdit(item.id)
                                                        }
                                                    >

                                                        <i className="bi bi-pencil-square"></i>

                                                    </button>


                                                    <button
                                                        type="button"
                                                        className="franchise-action franchise-delete"
                                                        title="Delete"
                                                        onClick={() => {

                                                            setDeleteId(item.id);

                                                            setShowDeleteModal(
                                                                true
                                                            );

                                                        }}
                                                    >

                                                        <i className="bi bi-trash3-fill"></i>

                                                    </button>

                                                </div>

                                            </td>

                                        </tr>

                                    ))

                                )}

                            </tbody>

                        </table>

                    </div>


                    {/* =================================================
                        PAGINATION
                        ================================================= */}

                    <div className="franchise-pagination">

                        <div className="franchise-records">

                            Showing{" "}

                            <strong>

                                {data.length > 0
                                    ? (pageNo - 1) *
                                    pageSize +
                                    1
                                    : 0}

                            </strong>{" "}

                            to{" "}

                            <strong>

                                {(pageNo - 1) *
                                    pageSize +
                                    data.length}

                            </strong>{" "}

                            of{" "}

                            <strong>
                                {totalRecords}
                            </strong>{" "}

                            records

                        </div>


                        <div className="franchise-pagination-buttons">

                            <button
                                type="button"
                                className="franchise-page-btn"
                                disabled={
                                    pageNo === 1 ||
                                    loading
                                }
                                onClick={() =>
                                    setPageNo(
                                        (prev) =>
                                            prev - 1
                                    )
                                }
                            >

                                Previous

                            </button>


                            <div className="page-numbers">
                                {Array.from(
                                    { length: Math.min(totalPages || 1, 5) },
                                    (_, index) => index + 1
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

                            <span className="page-of">
                                of {totalPages || 1}
                            </span>


                            <button
                                type="button"
                                className="franchise-page-btn"
                                disabled={
                                    pageNo >= totalPages ||
                                    loading ||
                                    totalPages === 0
                                }
                                onClick={() =>
                                    setPageNo(
                                        (prev) =>
                                            prev + 1
                                    )
                                }
                            >

                                Next

                            </button>

                        </div>

                    </div>

                </div>

            </div>


            {/* =========================================================
                DELETE MODAL
                ========================================================= */}

            {showDeleteModal && (

                <div className="franchise-modal-overlay">

                    <div className="franchise-modal">


                        <div className="franchise-modal-header">

                            <h5>

                                <i className="bi bi-exclamation-triangle-fill me-2"></i>

                                Delete Study Centre

                            </h5>

                        </div>


                        <div className="franchise-modal-body">

                            <div className="franchise-delete-icon">

                                <i className="bi bi-trash3-fill"></i>

                            </div>


                            <h5>
                                Are you sure?
                            </h5>


                            <p>

                                Do you really want to delete this study
                                centre?

                                <br />

                                This action cannot be undone.

                            </p>

                        </div>


                        <div className="franchise-modal-footer">


                            <button
                                type="button"
                                className="franchise-modal-btn franchise-cancel"
                                onClick={() =>
                                    setShowDeleteModal(false)
                                }
                                disabled={deleteLoading}
                            >

                                <i className="bi bi-x-circle me-1"></i>

                                Cancel

                            </button>


                            <button
                                type="button"
                                className="franchise-modal-btn franchise-confirm"
                                onClick={confirmDelete}
                                disabled={deleteLoading}
                            >

                                {deleteLoading ? (

                                    <>

                                        <span
                                            className="spinner-border spinner-border-sm me-2"
                                        ></span>

                                        Deleting...

                                    </>

                                ) : (

                                    <>

                                        <i className="bi bi-trash3 me-1"></i>

                                        Confirm Delete

                                    </>

                                )}

                            </button>

                        </div>

                    </div>

                </div>

            )}

        </>
    );
}

export default FrenchiseList;