import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import {
    createProductAmount,
    deleteProductAmount,
    getProductAmounts,
    getProductAmountById,
    updateProductAmount,
    getDuration,
} from "./CourseService";

function ProductAmountAdd() {
    const { id } = useParams();

    // =====================================================
    // LIST
    // =====================================================

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);

    // =====================================================
    // AMOUNT TYPE / DROPDOWN
    // =====================================================

    const [durations, setDurations] = useState([]);
    const [durationLoading, setDurationLoading] = useState(false);

    // =====================================================
    // FORM SHOW / HIDE
    // =====================================================

    const [showForm, setShowForm] = useState(false);

    // create / edit
    const [mode, setMode] = useState("create");

    // Edit record id
    const [editId, setEditId] = useState(null);

    // =====================================================
    // DELETE MODAL
    // =====================================================

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    const [deleteTitle, setDeleteTitle] = useState("");
    const [isDeleting, setIsDeleting] = useState(false);

    // =====================================================
    // EMPTY AMOUNT
    // =====================================================

    const getEmptyAmount = () => ({
        productId: Number(id) || 0,
        name: "",
        amount: "",
        amountTypeId: 0,
    });

    // =====================================================
    // CREATE FORM
    // =====================================================

    const [formData, setFormData] = useState({
        productAmounts: [getEmptyAmount()],
    });

    // =====================================================
    // EDIT FORM
    // =====================================================

    const [editForm, setEditForm] = useState({
        id: 0,
        productId: Number(id) || 0,
        name: "",
        amount: "",
        amountTypeId: 0,
        isActive: 1,
    });

    // =====================================================
    // LOAD DATA
    // =====================================================

    useEffect(() => {
        loadAmountType();

        if (id) {
            loadProductAmounts(id);
        }
    }, [id]);

    // =====================================================
    // LOAD AMOUNT TYPE
    // =====================================================

    const loadAmountType = async () => {
        try {
            setDurationLoading(true);

            const result = await getDuration(31);

            console.log("AMOUNT TYPE RESPONSE:", result);

            setDurations(result?.data || []);
        } catch (error) {
            console.error("AMOUNT TYPE ERROR:", error);

            alert(
                error?.response?.data?.message ||
                error?.message ||
                "Unable to load Amount Types."
            );
        } finally {
            setDurationLoading(false);
        }
    };

    // =====================================================
    // LOAD PRODUCT AMOUNTS
    // =====================================================

    const loadProductAmounts = async (productId) => {
        try {
            setLoading(true);

            const result = await getProductAmounts(productId);

            console.log("PRODUCT AMOUNTS RESPONSE:", result);

            setData(result?.data || []);
        } catch (error) {
            console.error("LIST ERROR:", error);

            alert(
                error?.response?.data?.message ||
                error?.message ||
                "Unable to load Product Amounts."
            );
        } finally {
            setLoading(false);
        }
    };

    // =====================================================
    // OPEN CREATE
    // =====================================================

    const openCreate = () => {
        setMode("create");
        setEditId(null);

        setFormData({
            productAmounts: [getEmptyAmount()],
        });

        setShowForm(true);
    };

    // =====================================================
    // CLOSE FORM
    // =====================================================

    const closeForm = () => {
        setShowForm(false);
        setMode("create");
        setEditId(null);

        setFormData({
            productAmounts: [getEmptyAmount()],
        });

        setEditForm({
            id: 0,
            productId: Number(id) || 0,
            name: "",
            amount: "",
            amountTypeId: 0,
            isActive: 1,
        });
    };

    // =====================================================
    // ADD AMOUNT
    // =====================================================

    const addAmount = () => {
        if (formData.productAmounts.length >= 9) {
            alert("Maximum 9 amounts are allowed.");
            return;
        }

        setFormData((prev) => ({
            ...prev,
            productAmounts: [
                ...prev.productAmounts,
                getEmptyAmount(),
            ],
        }));
    };

    // =====================================================
    // REMOVE AMOUNT
    // =====================================================

    const removeAmount = (index) => {
        if (formData.productAmounts.length === 1) {
            alert("At least one amount is required.");
            return;
        }

        setFormData((prev) => ({
            ...prev,
            productAmounts: prev.productAmounts.filter(
                (_, i) => i !== index
            ),
        }));
    };

    // =====================================================
    // AMOUNT CHANGE
    // =====================================================

    const handleAmountChange = (index, field, value) => {
        setFormData((prev) => ({
            ...prev,
            productAmounts: prev.productAmounts.map(
                (amountItem, i) =>
                    i === index
                        ? {
                            ...amountItem,
                            [field]: value,
                        }
                        : amountItem
            ),
        }));
    };

    // =====================================================
    // EDIT
    // =====================================================

    const handleEdit = async (recordId) => {
        try {
            setLoading(true);

            const result = await getProductAmountById(recordId);



            const item = result?.data || result;

            if (!item) {
                alert("Product Amount record not found.");
                return;
            }

            setEditId(item.id);

            setMode("edit");

            setEditForm({
                id: item.id || 0,

                productId:
                    item.productId ||
                    Number(id) ||
                    0,

                name:
                    item.name ||
                    "",

                amount:
                    item.amount ??
                    "",

                amountTypeId:
                    item.amountTypeId ??
                    0,

                isActive:
                    item.isActive ??
                    1,
            });

            setShowForm(true);
        } catch (error) {
            console.error("EDIT ERROR:", error);

            alert(
                error?.response?.data?.message ||
                error?.message ||
                "Unable to load record."
            );
        } finally {
            setLoading(false);
        }
    };

    // =====================================================
    // EDIT INPUT CHANGE
    // =====================================================

    const handleEditChange = (field, value) => {
        setEditForm((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    // =====================================================
    // CREATE SUBMIT
    // =====================================================

    const handleCreateSubmit = async (e) => {
        e.preventDefault();

        // -----------------------------------------
        // PRODUCT ID
        // -----------------------------------------

        if (!id || Number(id) <= 0) {
            alert("Product ID is required.");
            return;
        }

        // -----------------------------------------
        // AMOUNT ARRAY
        // -----------------------------------------

        if (
            !formData.productAmounts ||
            formData.productAmounts.length === 0
        ) {
            alert("At least one amount is required.");
            return;
        }

        if (formData.productAmounts.length > 9) {
            alert("Maximum 9 amounts are allowed.");
            return;
        }

        // -----------------------------------------
        // NAME VALIDATION
        // -----------------------------------------

        const invalidName =
            formData.productAmounts.some(
                (item) =>
                    !item.name ||
                    !item.name.trim()
            );

        if (invalidName) {
            alert(
                "Please enter Amount Name for all amounts."
            );
            return;
        }

        // -----------------------------------------
        // AMOUNT VALIDATION
        // -----------------------------------------

        const invalidAmount =
            formData.productAmounts.some(
                (item) =>
                    item.amount === "" ||
                    item.amount === null ||
                    item.amount === undefined ||
                    Number.isNaN(
                        Number(item.amount)
                    ) ||
                    Number(item.amount) < 0
            );

        if (invalidAmount) {
            alert(
                "Please enter a valid Amount for all amounts."
            );
            return;
        }

        // -----------------------------------------
        // AMOUNT TYPE VALIDATION
        // -----------------------------------------

        const invalidAmountType =
            formData.productAmounts.some(
                (item) =>
                    !item.amountTypeId ||
                    Number(item.amountTypeId) <= 0
            );

        if (invalidAmountType) {
            alert(
                "Please select Amount Type for all amounts."
            );
            return;
        }

        // =====================================================
        // IMPORTANT:
        // BACKEND EXPECTS:
        // [FromBody] List<ProductAmountDtos> model
        //
        // Therefore send DIRECT ARRAY.
        // Do NOT send:
        // { productAmounts: [...] }
        // =====================================================

        const payload =
            formData.productAmounts.map(
                (item) => ({
                    productId: Number(id),

                    name: item.name.trim(),

                    amount: Number(item.amount),

                    amountTypeId:
                        Number(
                            item.amountTypeId
                        ),
                })
            );

        console.log(
            "CREATE PRODUCT AMOUNT PAYLOAD:",
            payload
        );

        // =====================================================
        // API
        // =====================================================

        try {
            setLoading(true);

            const result =
                await createProductAmount(
                    payload
                );

            console.log(
                "CREATE PRODUCT AMOUNT RESPONSE:",
                result
            );

            /*
             * Backend response can be:
             *
             * 1. Object:
             * {
             *    success: true,
             *    message: "..."
             * }
             *
             * OR
             *
             * 2. String:
             * "Product Amount created successfully"
             */

            const isSuccess =
                result?.success === true ||
                typeof result === "string";

            if (isSuccess) {
                alert(
                    result?.message ||
                    result ||
                    "Product Amounts created successfully."
                );

                closeForm();

                await loadProductAmounts(id);
            } else {
                alert(
                    result?.message ||
                    "Something went wrong."
                );
            }
        } catch (error) {
            console.error(
                "CREATE PRODUCT AMOUNT ERROR:",
                error
            );

            alert(
                error?.response?.data?.message ||
                error?.response?.data ||
                error?.message ||
                "Something went wrong."
            );
        } finally {
            setLoading(false);
        }
    };

    // =====================================================
    // UPDATE SUBMIT
    // =====================================================

    const handleUpdateSubmit = async (e) => {
        e.preventDefault();

        // -----------------------------------------
        // NAME
        // -----------------------------------------

        if (
            !editForm.name ||
            !editForm.name.trim()
        ) {
            alert("Amount Name is required.");
            return;
        }

        // -----------------------------------------
        // AMOUNT
        // -----------------------------------------

        if (
            editForm.amount === "" ||
            editForm.amount === null ||
            editForm.amount === undefined ||
            Number.isNaN(
                Number(editForm.amount)
            ) ||
            Number(editForm.amount) < 0
        ) {
            alert("Please enter a valid Amount.");
            return;
        }

        // -----------------------------------------
        // AMOUNT TYPE
        // -----------------------------------------

        if (
            !editForm.amountTypeId ||
            Number(editForm.amountTypeId) <= 0
        ) {
            alert("Please select Amount Type.");
            return;
        }

        // -----------------------------------------
        // UPDATE PAYLOAD
        // -----------------------------------------

        const payload = {
            id: Number(editForm.id),

            productId: Number(
                editForm.productId || id
            ),

            name: editForm.name.trim(),

            amount: Number(
                editForm.amount
            ),

            amountTypeId: Number(
                editForm.amountTypeId
            ),

            isActive: Number(
                editForm.isActive ?? 1
            ),
        };

        console.log(
            "UPDATE PRODUCT AMOUNT PAYLOAD:",
            payload
        );

        // -----------------------------------------
        // API
        // -----------------------------------------

        try {
            setLoading(true);

            const result =
                await updateProductAmount(
                    editForm.id,
                    payload
                );

            console.log(
                "UPDATE PRODUCT AMOUNT RESPONSE:",
                result
            );

            const isSuccess =
                result?.success === true ||
                typeof result === "string";

            if (isSuccess) {
                alert(
                    result?.message ||
                    result ||
                    "Product Amount updated successfully."
                );

                closeForm();

                await loadProductAmounts(id);
            } else {
                alert(
                    result?.message ||
                    "Update failed."
                );
            }
        } catch (error) {
            console.error(
                "UPDATE PRODUCT AMOUNT ERROR:",
                error
            );

            alert(
                error?.response?.data?.message ||
                error?.response?.data ||
                error?.message ||
                "Something went wrong."
            );
        } finally {
            setLoading(false);
        }
    };

    // =====================================================
    // DELETE MODAL
    // =====================================================

    const openDeleteModal = (item) => {
        setDeleteId(item.id);

     setDeleteTitle(
        `${item.name || `Amount #${item.id}`} - Amount: ${item.amount}`
    );

        setShowDeleteModal(true);
    };

    // =====================================================
    // CLOSE DELETE MODAL
    // =====================================================

    const closeDeleteModal = () => {
        if (isDeleting) {
            return;
        }

        setShowDeleteModal(false);
        setDeleteId(null);
        setDeleteTitle("");
    };

    // =====================================================
    // DELETE
    // =====================================================

    const handleDelete = async () => {
        if (!deleteId) {
            return;
        }

        setIsDeleting(true);

        try {
            const result =
                await deleteProductAmount(
                    deleteId
                );

            console.log(
                "DELETE PRODUCT AMOUNT RESPONSE:",
                result
            );

            const isSuccess =
                result?.success === true ||
                typeof result === "string";

            if (isSuccess) {
                alert(
                    result?.message ||
                    result ||
                    "Product Amount deleted successfully."
                );

                setShowDeleteModal(false);
                setDeleteId(null);
                setDeleteTitle("");

                await loadProductAmounts(id);
            } else {
                alert(
                    result?.message ||
                    "Product Amount delete failed."
                );
            }
        } catch (error) {
            console.error(
                "DELETE PRODUCT AMOUNT ERROR:",
                error
            );

            alert(
                error?.response?.data?.message ||
                error?.response?.data ||
                error?.message ||
                "Something went wrong."
            );
        } finally {
            setIsDeleting(false);
        }
    };

    // =====================================================
    // RETURN
    // =====================================================

    return (
        <div className="container-fluid py-4">

            {/* =================================================
                 CREATE / EDIT FORM
             ================================================= */}

            {showForm && (
                <div className="row">
                    <div className="col-lg-12">

                        {/* HEADER */}

                        <div className="card border-0 shadow-sm mb-4">
                            <div className="card-body">

                                <div className="d-flex justify-content-between align-items-center">

                                    <div>
                                        <h4 className="fw-bold mb-1">
                                            {mode === "create"
                                                ? "Add Amount"
                                                : "Edit Amount"}
                                        </h4>

                                        <p className="text-muted mb-0">
                                            {mode === "create"
                                                ? "Add product amounts"
                                                : "Update product amount details"}
                                        </p>
                                    </div>

                                    <button
                                        type="button"
                                        className="btn btn-light border"
                                        onClick={closeForm}
                                    >
                                        <i className="bi bi-arrow-left me-1"></i>
                                        Back to List
                                    </button>

                                </div>

                            </div>
                        </div>

                        {/* =================================================
                             CREATE FORM
                         ================================================= */}

                        {mode === "create" && (
                            <form onSubmit={handleCreateSubmit}>

                                <div className="card border-0 shadow-sm">

                                    {/* HEADER */}

                                    <div className="card-header bg-white py-3">

                                        <div className="d-flex justify-content-between align-items-center">

                                            <div>
                                                <h5 className="mb-1 fw-semibold">
                                                    Product Amounts
                                                </h5>

                                                <small className="text-muted">
                                                    Maximum 9 amounts
                                                </small>
                                            </div>

                                            <button
                                                type="button"
                                                className="btn btn-primary"
                                                onClick={addAmount}
                                                disabled={
                                                    formData.productAmounts.length >= 9
                                                }
                                            >
                                                <i className="bi bi-plus-lg me-1"></i>
                                                Add More
                                            </button>

                                        </div>

                                    </div>

                                    {/* TABLE */}

                                    <div className="card-body p-0">

                                        <div className="table-responsive">

                                            <table className="table table-bordered align-middle mb-0">

                                                <thead className="table-light">

                                                    <tr>

                                                        <th
                                                            style={{
                                                                width: "60px",
                                                            }}
                                                        >
                                                            #
                                                        </th>

                                                        <th>
                                                            Amount Type
                                                        </th>

                                                        <th>
                                                            Amount Name
                                                        </th>

                                                        <th>
                                                            Amount
                                                        </th>

                                                        <th
                                                            style={{
                                                                width: "100px",
                                                            }}
                                                        >
                                                            Action
                                                        </th>

                                                    </tr>

                                                </thead>

                                                <tbody>

                                                    {formData.productAmounts.map(
                                                        (
                                                            item,
                                                            index
                                                        ) => (

                                                            <tr
                                                                key={index}
                                                            >

                                                                <td className="text-center">
                                                                    {index + 1}
                                                                </td>

                                                                {/* AMOUNT TYPE */}

                                                                <td>

                                                                    <select
                                                                        className="form-select"
                                                                        value={
                                                                            item.amountTypeId
                                                                        }
                                                                        onChange={(
                                                                            e
                                                                        ) =>
                                                                            handleAmountChange(
                                                                                index,
                                                                                "amountTypeId",
                                                                                e.target.value
                                                                            )
                                                                        }
                                                                        disabled={
                                                                            durationLoading
                                                                        }
                                                                    >

                                                                        <option value="0">

                                                                            {durationLoading
                                                                                ? "Loading Amount Types..."
                                                                                : "Select Amount Type"}

                                                                        </option>

                                                                        {durations.map(
                                                                            (
                                                                                type
                                                                            ) => (

                                                                                <option
                                                                                    key={
                                                                                        type.id
                                                                                    }
                                                                                    value={
                                                                                        type.id
                                                                                    }
                                                                                >
                                                                                    {
                                                                                        type.name
                                                                                    }
                                                                                </option>

                                                                            )
                                                                        )}

                                                                    </select>

                                                                </td>

                                                                {/* NAME */}

                                                                <td>

                                                                    <input
                                                                        type="text"
                                                                        className="form-control"
                                                                        value={
                                                                            item.name
                                                                        }
                                                                        onChange={(
                                                                            e
                                                                        ) =>
                                                                            handleAmountChange(
                                                                                index,
                                                                                "name",
                                                                                e.target.value
                                                                            )
                                                                        }
                                                                        placeholder="Enter amount name"
                                                                    />

                                                                </td>

                                                                {/* AMOUNT */}

                                                                <td>

                                                                    <input
                                                                        type="number"
                                                                        className="form-control"
                                                                        value={
                                                                            item.amount
                                                                        }
                                                                        onChange={(
                                                                            e
                                                                        ) =>
                                                                            handleAmountChange(
                                                                                index,
                                                                                "amount",
                                                                                e.target.value
                                                                            )
                                                                        }
                                                                        placeholder="Enter amount"
                                                                        min="0"
                                                                        step="any"
                                                                    />

                                                                </td>

                                                                {/* DELETE */}

                                                                <td className="text-center">

                                                                    <button
                                                                        type="button"
                                                                        className="btn btn-outline-danger btn-sm"
                                                                        disabled={
                                                                            formData.productAmounts.length ===
                                                                            1
                                                                        }
                                                                        onClick={() =>
                                                                            removeAmount(
                                                                                index
                                                                            )
                                                                        }
                                                                    >

                                                                        <i className="bi bi-trash"></i>

                                                                    </button>

                                                                </td>

                                                            </tr>

                                                        )
                                                    )}

                                                </tbody>

                                            </table>

                                        </div>

                                    </div>

                                    {/* FOOTER */}

                                    <div className="card-footer bg-white">

                                        <div className="d-flex justify-content-between align-items-center">

                                            <span className="text-muted">
                                                Total Amounts:{" "}
                                                <strong>
                                                    {
                                                        formData.productAmounts.length
                                                    }
                                                </strong>
                                                /9
                                            </span>

                                            <div>

                                                <button
                                                    type="button"
                                                    className="btn btn-light border me-2"
                                                    onClick={closeForm}
                                                >
                                                    Cancel
                                                </button>

                                                <button
                                                    type="submit"
                                                    className="btn btn-success"
                                                    disabled={
                                                        loading ||
                                                        durationLoading
                                                    }
                                                >

                                                    {loading
                                                        ? "Saving..."
                                                        : "Save Amounts"}

                                                </button>

                                            </div>

                                        </div>

                                    </div>

                                </div>

                            </form>
                        )}

                        {/* =================================================
                             EDIT FORM
                         ================================================= */}

                        {mode === "edit" && (
                            <form onSubmit={handleUpdateSubmit}>

                                <div className="card border-0 shadow-sm">

                                    <div className="card-header bg-white py-3">

                                        <h5 className="mb-0 fw-semibold">
                                            Edit Product Amount
                                        </h5>

                                    </div>

                                    <div className="card-body">

                                        <div className="row g-3">

                                            {/* ID */}

                                            <div className="col-md-6">

                                                <label className="form-label fw-semibold">
                                                    ID
                                                </label>

                                                <input
                                                    type="number"
                                                    className="form-control"
                                                    value={
                                                        editForm.id
                                                    }
                                                    readOnly
                                                />

                                            </div>

                                            {/* PRODUCT ID */}

                                            <div className="col-md-6"  hidden >

                                                <label className="form-label fw-semibold">
                                                    Product ID
                                                </label>

                                                <input
                                                    type="number"
                                                    className="form-control"
                                                    value={
                                                        editForm.productId
                                                    }
                                                    readOnly
                                                />

                                            </div>

                                            {/* AMOUNT TYPE */}

                                            <div className="col-md-6">

                                                <label className="form-label fw-semibold">
                                                    Amount Type
                                                </label>

                                                <select
                                                    className="form-select"
                                                    value={
                                                        editForm.amountTypeId
                                                    }
                                                    onChange={(
                                                        e
                                                    ) =>
                                                        handleEditChange(
                                                            "amountTypeId",
                                                            e.target.value
                                                        )
                                                    }
                                                    disabled={
                                                        durationLoading
                                                    }
                                                >

                                                    <option value="0">

                                                        {durationLoading
                                                            ? "Loading Amount Types..."
                                                            : "Select Amount Type"}

                                                    </option>

                                                    {durations.map(
                                                        (
                                                            type
                                                        ) => (

                                                            <option
                                                                key={
                                                                    type.id
                                                                }
                                                                value={
                                                                    type.id
                                                                }
                                                            >
                                                                {
                                                                    type.name
                                                                }
                                                            </option>

                                                        )
                                                    )}

                                                </select>

                                            </div>
                                            {/* NAME */}

                                            <div className="col-md-6">

                                                <label className="form-label fw-semibold">
                                                    Name
                                                </label>

                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    placeholder="Enter amount name"
                                                    value={
                                                        editForm.name
                                                    }
                                                    onChange={(
                                                        e
                                                    ) =>
                                                        handleEditChange(
                                                            "name",
                                                            e.target.value
                                                        )
                                                    }
                                                />

                                            </div>

                                            {/* AMOUNT */}

                                            <div className="col-md-6">

                                                <label className="form-label fw-semibold">
                                                    Amount
                                                </label>

                                                <input
                                                    type="number"
                                                    className="form-control"
                                                    placeholder="Enter amount"
                                                    min="0"
                                                    step="any"
                                                    value={
                                                        editForm.amount
                                                    }
                                                    onChange={(
                                                        e
                                                    ) =>
                                                        handleEditChange(
                                                            "amount",
                                                            e.target.value
                                                        )
                                                    }
                                                />

                                            </div>



                                            {/* STATUS */}

                                            {/* <div className="col-md-6">

                                                <label className="form-label fw-semibold">
                                                    Status
                                                </label>

                                                <select
                                                    className="form-select"
                                                    value={
                                                        editForm.isActive
                                                    }
                                                    onChange={(
                                                        e
                                                    ) =>
                                                        handleEditChange(
                                                            "isActive",
                                                            e.target.value
                                                        )
                                                    }
                                                >

                                                    <option value="1">
                                                        Active
                                                    </option>

                                                    <option value="0">
                                                        Inactive
                                                    </option>

                                                </select>

                                            </div> */}

                                        </div>

                                    </div>

                                    <div className="card-footer bg-white py-3">

                                        <div className="text-end">

                                            <button
                                                type="button"
                                                className="btn btn-light border me-2"
                                                onClick={closeForm}
                                            >
                                                Cancel
                                            </button>

                                            <button
                                                type="submit"
                                                className="btn btn-success"
                                                disabled={
                                                    loading ||
                                                    durationLoading
                                                }
                                            >

                                                {loading
                                                    ? "Updating..."
                                                    : "Update"}

                                            </button>

                                        </div>

                                    </div>

                                </div>

                            </form>
                        )}

                    </div>
                </div>
            )}

            {/* =================================================
                 LIST
             ================================================= */}

            {!showForm && (
                <div className="row">

                    <div className="col-lg-12">

                        <div className="card border-0 shadow-sm">

                            <div className="card-body">

                                {/* HEADER */}

                                <div className="d-flex justify-content-between align-items-center mb-4">

                                    <div>

                                        <h5 className="card-title mb-1">
                                            Product Amount List
                                        </h5>

                                        <small className="text-muted">
                                            Manage product amounts
                                        </small>

                                    </div>

                                    <button
                                        type="button"
                                        className="btn btn-primary"
                                        onClick={openCreate}
                                    >

                                        <i className="bi bi-plus-lg me-1"></i>
                                        Add Amount

                                    </button>

                                </div>

                                {/* TABLE */}

                                <div className="table-responsive">

                                    <table className="table table-hover align-middle">

                                        <thead>

                                            <tr>

                                                <th>#</th>

                                                <th hidden>
                                                    Product ID
                                                </th>

                                                <th>
                                                    Name
                                                </th>

                                                <th>
                                                    Amount
                                                </th>

                                                <th>
                                                    Amount Type
                                                </th>

                                                <th>
                                                    Status
                                                </th>

                                                <th className="text-center">
                                                    Action
                                                </th>

                                            </tr>

                                        </thead>

                                        <tbody>

                                            {loading ? (

                                                <tr>

                                                    <td
                                                        colSpan="7"
                                                        className="text-center"
                                                    >
                                                        Loading...
                                                    </td>

                                                </tr>

                                            ) : data.length === 0 ? (

                                                <tr>

                                                    <td
                                                        colSpan="7"
                                                        className="text-center text-muted"
                                                    >
                                                        No records found.
                                                    </td>

                                                </tr>

                                            ) : (

                                                data.map(
                                                    (
                                                        item,
                                                        index
                                                    ) => (

                                                        <tr
                                                            key={
                                                                item.id ||
                                                                index
                                                            }
                                                        >

                                                            <td>
                                                                {
                                                                    index +
                                                                    1
                                                                }
                                                            </td>

                                                            <td hidden>
                                                                {
                                                                    item.productId
                                                                }
                                                            </td>

                                                            <td>
                                                                {
                                                                    item.name
                                                                }
                                                            </td>

                                                            <td>
                                                                {
                                                                    item.amount
                                                                }
                                                            </td>

                                                            <td>
                                                                {
                                                                    item.amountType
                                                                }
                                                            </td>

                                                            <td>

                                                                {Number(
                                                                    item.isActive
                                                                ) === 1 ? (

                                                                    <span className="badge bg-success">
                                                                        Active
                                                                    </span>

                                                                ) : (

                                                                    <span className="badge bg-secondary">
                                                                        Inactive
                                                                    </span>

                                                                )}

                                                            </td>

                                                            <td className="text-center">

                                                                <button
                                                                    type="button"
                                                                    className="btn btn-outline-primary btn-sm me-2"
                                                                    onClick={() =>
                                                                        handleEdit(
                                                                            item.id
                                                                        )
                                                                    }
                                                                >

                                                                    <i className="bi bi-pencil-square me-1"></i>
                                                                    Edit

                                                                </button>

                                                                <button
                                                                    type="button"
                                                                    className="btn btn-outline-danger btn-sm"
                                                                    onClick={() =>
                                                                        openDeleteModal(
                                                                            item
                                                                        )
                                                                    }
                                                                >

                                                                    <i className="bi bi-trash me-1"></i>
                                                                    Delete

                                                                </button>

                                                            </td>

                                                        </tr>

                                                    )
                                                )

                                            )}

                                        </tbody>

                                    </table>

                                </div>

                            </div>

                        </div>

                    </div>

                </div>
            )}

            {/* =================================================
                 DELETE MODAL
             ================================================= */}

            {showDeleteModal && (
                <>
                    {/* BACKDROP */}

                    <div
                        className="modal-backdrop fade show"
                        style={{
                            backgroundColor:
                                "rgba(15, 23, 42, 0.65)",
                            backdropFilter:
                                "blur(3px)",
                        }}
                    ></div>

                    {/* MODAL */}

                    <div
                        className="modal fade show d-block"
                        tabIndex="-1"
                        role="dialog"
                        aria-modal="true"
                    >

                        <div className="modal-dialog modal-dialog-centered">

                            <div
                                className="modal-content border-0 shadow-lg"
                                style={{
                                    borderRadius:
                                        "18px",
                                    overflow:
                                        "hidden",
                                }}
                            >

                                {/* TOP LINE */}

                                <div
                                    style={{
                                        height: "5px",
                                        background:
                                            "linear-gradient(90deg, #dc3545, #ff6b6b)",
                                    }}
                                ></div>

                                {/* HEADER */}

                                <div className="modal-header border-0 px-4 pt-4 pb-2">

                                    <div className="d-flex align-items-center">

                                        <div
                                            className="d-flex align-items-center justify-content-center me-3"
                                            style={{
                                                width:
                                                    "48px",
                                                height:
                                                    "48px",
                                                borderRadius:
                                                    "50%",
                                                backgroundColor:
                                                    "#fff1f2",
                                            }}
                                        >

                                            <i
                                                className="bi bi-trash3-fill text-danger"
                                                style={{
                                                    fontSize:
                                                        "21px",
                                                }}
                                            ></i>

                                        </div>

                                        <div>

                                            <h5 className="modal-title fw-bold mb-1">
                                                Delete Product Amount
                                            </h5>

                                            <small className="text-muted">
                                                Confirmation required
                                            </small>

                                        </div>

                                    </div>

                                    <button
                                        type="button"
                                        className="btn-close"
                                        onClick={
                                            closeDeleteModal
                                        }
                                        disabled={
                                            isDeleting
                                        }
                                    ></button>

                                </div>

                                {/* BODY */}

                                <div className="modal-body px-4 py-4">

                                    <div
                                        className="p-3"
                                        style={{
                                            backgroundColor:
                                                "#f8fafc",
                                            borderRadius:
                                                "12px",
                                            border:
                                                "1px solid #e9ecef",
                                        }}
                                    >

                                        <div className="d-flex align-items-start">

                                            <i
                                                className="bi bi-exclamation-circle-fill text-warning me-3 mt-1"
                                                style={{
                                                    fontSize:
                                                        "20px",
                                                }}
                                            ></i>

                                            <div>

                                                <h6 className="fw-semibold mb-2">
                                                    Are you sure you want to delete this amount?
                                                </h6>

                                                <p className="text-muted mb-0">
                                                    You are about to delete:
                                                </p>

                                                <div
                                                    className="mt-2 px-3 py-2"
                                                    style={{
                                                        backgroundColor:
                                                            "#ffffff",
                                                        borderRadius:
                                                            "8px",
                                                        border:
                                                            "1px solid #e5e7eb",
                                                    }}
                                                >

                                                    <strong className="text-dark">
                                                        {
                                                            deleteTitle
                                                        }
                                                    </strong>

                                                </div>

                                            </div>

                                        </div>

                                    </div>

                                    <div className="text-center mt-3">

                                        <small className="text-danger">

                                            <i className="bi bi-info-circle me-1"></i>

                                            This action cannot be undone.

                                        </small>

                                    </div>

                                </div>

                                {/* FOOTER */}

                                <div className="modal-footer border-0 px-4 pb-4 pt-0">

                                    <button
                                        type="button"
                                        className="btn btn-light border px-4"
                                        style={{
                                            borderRadius:
                                                "8px",
                                        }}
                                        onClick={
                                            closeDeleteModal
                                        }
                                        disabled={
                                            isDeleting
                                        }
                                    >
                                        Cancel
                                    </button>

                                    <button
                                        type="button"
                                        className="btn btn-danger px-4"
                                        style={{
                                            borderRadius:
                                                "8px",
                                            minWidth:
                                                "125px",
                                        }}
                                        onClick={
                                            handleDelete
                                        }
                                        disabled={
                                            isDeleting
                                        }
                                    >

                                        {isDeleting ? (

                                            <>
                                                <span
                                                    className="spinner-border spinner-border-sm me-2"
                                                    role="status"
                                                    aria-hidden="true"
                                                ></span>

                                                Deleting...
                                            </>

                                        ) : (

                                            <>
                                                <i className="bi bi-trash3 me-2"></i>
                                                Yes, Delete
                                            </>

                                        )}

                                    </button>

                                </div>

                            </div>

                        </div>

                    </div>
                </>
            )}

        </div>
    );
}

export default ProductAmountAdd;
