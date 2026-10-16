 import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { getStudyCentreState } from "../AllServicesFiles/StudentService";
import { getFrenchises } from "../AllServicesFiles/WebformService";

import "./StudentRegistration.css";

const RegistrationModeSelect = () => {
    const navigate = useNavigate();

    const [registrationMode, setRegistrationMode] = useState(null);
    const [states, setStates] = useState([]);

    // Offline flow
    const [selectedState, setSelectedState] = useState(null);
    const [stateFranchises, setStateFranchises] = useState([]);
    const [selectedFranchise, setSelectedFranchise] = useState(null);
    const [loadingFranchises, setLoadingFranchises] = useState(false);

    useEffect(() => {
        loadState();
    }, []);

    const loadState = async () => {
        try {
            const result = await getStudyCentreState();
            setStates(result?.data || []);
        } catch (error) {
            console.error("State Error:", error);
        }
    };

    const makeOptions = (data) =>
        data.map((item) => ({
            value: item.id,
            label: item.name,
        }));

    // ✅ ONLINE — /new-student-apply
    const handleOnlineClick = () => {
        navigate("/new-student-apply", {
            state: {
                registrationMode: "Online",
                studyModeId: 88,
                referenceId: 3,
                franchiseName: "",
                stateId: 0,
            },
        });
    };

    // ✅ OFFLINE — show state/franchise selection
    const handleOfflineClick = () => {
        setRegistrationMode("Offline");
        setSelectedState(null);
        setSelectedFranchise(null);
        setStateFranchises([]);
    };

    const handleOfflineStateChange = async (option) => {
        setSelectedState(option);
        setSelectedFranchise(null);
        setStateFranchises([]);

        if (!option) return;

        try {
            setLoadingFranchises(true);
            const result = await getFrenchises(option.value);
            setStateFranchises(result?.data || []);
        } catch (error) {
            console.error("Franchise Error:", error);
            setStateFranchises([]);
            toast.error("Unable to load franchises for this state");
        } finally {
            setLoadingFranchises(false);
        }
    };

    const handleFranchiseChange = (option) => {
        setSelectedFranchise(option);
    };

    // ✅ OFFLINE — /student-apply
    const handleOfflineNext = () => {
        if (!selectedState) {
            toast.error("Please select State");
            return;
        }
        if (!selectedFranchise) {
            toast.error("Please select Franchise");
            return;
        }

        navigate("/student-apply", {                 // ✅ Offline path
            state: {
                registrationMode: "Offline",
                studyModeId: 89,
                referenceId: Number(selectedFranchise.value),  // franchise id
                franchiseName: selectedFranchise.label,        // franchise name
                stateId: Number(selectedState.value),          // selected state
            },
        });
    };

    const handleBackToMode = () => {
        setRegistrationMode(null);
        setSelectedState(null);
        setSelectedFranchise(null);
        setStateFranchises([]);
    };

    return (
        <>
            <ToastContainer position="top-right" autoClose={3000} theme="colored" />

            <div className="student-registration-page">
                <div className="container-fluid px-3 px-md-4">
                    <div className="acc-logo-wrapper">
                        <div className="acc-logo-card">
                            <img
                                src="/assets/img/websheddlogo.png"
                                alt="SBSHE"
                                className="sbshe-acc-logo"
                            />
                        </div>
                    </div>

                    <div className="registration-card mode-step-card">
                        <div className="registration-top">
                            <div>
                                <h4>
                                    <i className="bi bi-person-vcard"></i>
                                    Choose Registration Mode
                                </h4>
                                <p>Please select Online or Offline to continue</p>
                            </div>
                        </div>

                        <div className="mode-step-body">
                            {!registrationMode && (
                                <div className="mode-cards">
                                    <button
                                        type="button"
                                        className="mode-card"
                                        onClick={handleOnlineClick}
                                    >
                                        <div className="mode-card-icon online">
                                            <i className="bi bi-globe2"></i>
                                        </div>
                                        <div className="mode-card-text">
                                            <h5>Online</h5>
                                            <p>Direct registration</p>
                                        </div>
                                    </button>

                                    <button
                                        type="button"
                                        className="mode-card"
                                        onClick={handleOfflineClick}
                                    >
                                        <div className="mode-card-icon offline">
                                            <i className="bi bi-geo-alt-fill"></i>
                                        </div>
                                        <div className="mode-card-text">
                                            <h5>Offline</h5>
                                            <p>Select State & Franchise</p>
                                        </div>
                                    </button>
                                </div>
                            )}

                            {registrationMode === "Offline" && (
                                <div className="mode-detail-block">
                                    <button
                                        type="button"
                                        className="back-mode-btn"
                                        onClick={handleBackToMode}
                                    >
                                        <i className="bi bi-arrow-left"></i>
                                        Back to modes
                                    </button>

                                    <div className="mode-detail-form">
                                        <div className="mode-field-row">
                                            <div className="mode-field">
                                                <label>
                                                    State <span>*</span>
                                                </label>
                                                <Select
                                                    options={makeOptions(states)}
                                                    value={selectedState}
                                                    onChange={handleOfflineStateChange}
                                                    placeholder="Search or select state"
                                                    isSearchable
                                                    isClearable
                                                    classNamePrefix="student-select"
                                                    menuPortalTarget={document.body}
                                                    menuPosition="fixed"
                                                    styles={{
                                                        menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                                                        menu: (base) => ({ ...base, zIndex: 9999 }),
                                                    }}
                                                />
                                            </div>

                                            <div className="mode-field">
                                                <label>
                                                    Franchise <span>*</span>
                                                </label>
                                                <Select
                                                    options={stateFranchises.map((f) => ({
                                                        value: f.id,
                                                        label: f.name,
                                                    }))}
                                                    value={selectedFranchise}
                                                    onChange={handleFranchiseChange}
                                                    placeholder={
                                                        !selectedState
                                                            ? "Select state first"
                                                            : loadingFranchises
                                                                ? "Loading franchises..."
                                                                : stateFranchises.length === 0
                                                                    ? "No franchise found in this state"
                                                                    : "Search or select franchise"
                                                    }
                                                    isSearchable
                                                    isClearable
                                                    isDisabled={!selectedState || loadingFranchises}
                                                    isLoading={loadingFranchises}
                                                    classNamePrefix="student-select"
                                                    menuPortalTarget={document.body}
                                                    menuPosition="fixed"
                                                    styles={{
                                                        menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                                                        menu: (base) => ({ ...base, zIndex: 9999 }),
                                                    }}
                                                />
                                            </div>
                                        </div>

                                        <button
                                            type="button"
                                            className="next-step-btn"
                                            onClick={handleOfflineNext}
                                            disabled={!selectedFranchise}
                                        >
                                            Continue
                                            <i className="bi bi-arrow-right"></i>
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default RegistrationModeSelect;