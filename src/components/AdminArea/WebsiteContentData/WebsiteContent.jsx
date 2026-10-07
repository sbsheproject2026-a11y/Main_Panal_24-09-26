import React, { useEffect, useMemo, useState } from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";



import { updateWebsiteContent, getWebsiteContentById, getWebsiteContents, createWebsiteContent, } from "../../AllServicesFiles/WebsiteContentService";
import { getDepartment } from "../../AllServicesFiles/EmployeeService";

const WebsiteContent = () => {

    // =========================================================
    // STATE
    // =========================================================

    const [menus, setMenus] = useState([]);
    const [listData, setListData] = useState([]);

    const [loading, setLoading] = useState(false);
    const [formLoading, setFormLoading] = useState(false);
    const [saving, setSaving] = useState(false);

    const [errors, setErrors] = useState({});

    const [showForm, setShowForm] = useState(false);
    const [editId, setEditId] = useState(0);

    // =========================================================
    // SEARCH + PAGINATION
    // =========================================================

    const [searchText, setSearchText] = useState("");
    const [recordsPerPage, setRecordsPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);

    // =========================================================
    // FORM DATA
    // =========================================================

    const [formData, setFormData] = useState({
        id: 0,
        productTypeId: "",
        srNo1: null,
        title: "",
        subTitle: "",
        shortDesc: "",
        desc: "",
        seoTitle: "",
        isActive: true,
        isHighlight: false,
        isDelete: 1,
    });

    // =========================================================
    // DOCUMENT ITEMS
    // =========================================================

    const [contentItems, setContentItems] = useState([
        {
            id: Date.now(),
            documentId: 0,
            srNo: null,
            name: "",
            file: null,
            oldFile: "",
            altTag: "",
            isActive: true,
        },
    ]);

    // =========================================================
    // INITIAL LOAD
    // =========================================================

    useEffect(() => {
        loadDepartment();
        loadWebsiteContent();
    }, []);

    // =========================================================
    // LOAD MENU
    // =========================================================

    const loadDepartment = async () => {
        try {
            const result = await getDepartment(35);

            setMenus(result?.data || []);
        } catch (error) {
            console.error("Menu Load Error:", error);
        }
    };

    // =========================================================
    // GET ALL WEBSITE CONTENT
    // =========================================================

    const loadWebsiteContent = async () => {
        try {
            setLoading(true);

            const result = await getWebsiteContents();

            console.log("Website Content List:", result);

            let data = [];

            if (Array.isArray(result)) {
                data = result;
            } else if (Array.isArray(result?.data)) {
                data = result.data;
            } else if (Array.isArray(result?.data?.data)) {
                data = result.data.data;
            } else if (Array.isArray(result?.data?.result)) {
                data = result.data.result;
            } else if (Array.isArray(result?.result)) {
                data = result.result;
            }

            setListData(data);

            setCurrentPage(1);

        } catch (error) {
            console.error(
                "Website Content List Error:",
                error
            );

            alert(
                error?.response?.data?.message ||
                "Unable to load website content."
            );

        } finally {
            setLoading(false);
        }
    };

    // =========================================================
    // SEARCH FILTER
    // =========================================================

    const filteredData = useMemo(() => {

        const search = searchText
            .trim()
            .toLowerCase();

        if (!search) {
            return listData;
        }

        return listData.filter((item) => {

            const title =
                item?.title || "";

            const shortDescription =
                item?.shortDescription || "";

            const description =
                item?.descrption || "";

            return (
                title
                    .toString()
                    .toLowerCase()
                    .includes(search) ||

                shortDescription
                    .toString()
                    .toLowerCase()
                    .includes(search) ||

                description
                    .toString()
                    .toLowerCase()
                    .includes(search)
            );
        });

    }, [listData, searchText]);

    // =========================================================
    // TOTAL PAGES
    // =========================================================

    const totalPages = Math.max(
        1,
        Math.ceil(
            filteredData.length /
            recordsPerPage
        )
    );

    // =========================================================
    // CURRENT PAGE DATA
    // =========================================================

    const paginatedData = useMemo(() => {

        const startIndex =
            (currentPage - 1) *
            recordsPerPage;

        const endIndex =
            startIndex +
            recordsPerPage;

        return filteredData.slice(
            startIndex,
            endIndex
        );

    }, [
        filteredData,
        currentPage,
        recordsPerPage,
    ]);

    // =========================================================
    // RESET PAGE WHEN SEARCH CHANGES
    // =========================================================

    useEffect(() => {
        setCurrentPage(1);
    }, [searchText, recordsPerPage]);

    // =========================================================
    // PAGE NUMBERS
    // MAXIMUM 5 AT ONE TIME
    // =========================================================

    const getPageNumbers = () => {

        const pages = [];

        if (totalPages <= 5) {

            for (
                let i = 1;
                i <= totalPages;
                i++
            ) {
                pages.push(i);
            }

            return pages;
        }

        let startPage =
            currentPage - 2;

        let endPage =
            currentPage + 2;

        if (startPage < 1) {
            startPage = 1;
            endPage = 5;
        }

        if (endPage > totalPages) {
            endPage = totalPages;
            startPage = totalPages - 4;
        }

        for (
            let i = startPage;
            i <= endPage;
            i++
        ) {
            pages.push(i);
        }

        return pages;
    };

    // =========================================================
    // GO TO PAGE
    // =========================================================

    const goToPage = (page) => {

        if (
            page < 1 ||
            page > totalPages
        ) {
            return;
        }

        setCurrentPage(page);

        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    // =========================================================
    // CHANGE RECORDS PER PAGE
    // =========================================================

    const handleRecordsPerPage = (e) => {

        const value =
            Number(e.target.value);

        setRecordsPerPage(value);
        setCurrentPage(1);
    };

    // =========================================================
    // RESET FORM
    // =========================================================

    const resetForm = () => {

        setEditId(0);

        setFormData({
            id: 0,
            productTypeId: "",
            srNo: null,
            title: "",
            subTitle: "",
            shortDesc: "",
            desc: "",
            seoTitle: "",
            isActive: true,
            isHighlight: false,
            isDelete: 1,
        });

        setContentItems([
            {
                id: Date.now(),
                documentId: 0,
                srNo: null,
                name: "",
                file: null,
                oldFile: "",
                altTag: "",
                isActive: true,
            },
        ]);

        setErrors({});
    };

    // =========================================================
    // OPEN CREATE FORM
    // =========================================================

    const handleAdd = () => {

        resetForm();

        setShowForm(true);

        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    // =========================================================
    // OPEN EDIT FORM
    // =========================================================

    const handleEdit = async (id) => {

        if (!id) {
            alert("Website content ID not found.");
            return;
        }

        try {

            setFormLoading(true);

            const result =
                await getWebsiteContentById(id);

            console.log(
                "Get Website Content By ID:",
                result
            );

            let data = null;

            if (result?.data?.data) {
                data = result.data.data;
            } else if (result?.data) {
                data = result.data;
            } else {
                data = result;
            }

            if (!data) {

                alert(
                    "Website content not found."
                );

                return;
            }

            // =================================================
            // SET EDIT ID
            // =================================================

            setEditId(
                Number(data.id || id)
            );

            // =================================================
            // MAIN FORM
            // =================================================

            setFormData({

                id:
                    Number(
                        data.id ||
                        id ||
                        0
                    ),

                productTypeId:
                    data.productTypeId ??
                    "",

                srNo:
                    data.srNo ??
                    null,

                title:
                    data.title ??
                    "",

                subTitle:
                    data.subTitle ??
                    "",

                shortDesc:
                    data.shortDescription ??
                    "",

                desc:
                    data.descrption ??
                    "",

                seoTitle:
                    data.seoTitle ??
                    "",

                isActive:
                    data.isActive === 1 ||
                    data.isActive === true,

                isHighlight:
                    data.isHighlight === 1 ||
                    data.isHighlight === true,

                isDelete:
                    data.isDelete ??
                    1,
            });

            // =================================================
            // DOCUMENTS
            // =================================================

            const documents =
                data.productCategoryDocuments ||
                [];

            if (
                Array.isArray(documents) &&
                documents.length > 0
            ) {

                setContentItems(

                    documents.map(
                        (item, index) => ({

                            id:
                                Date.now() +
                                index,

                            documentId:
                                item.id ??
                                0,

                            srNo:
                                item.srNo ??
                                null,

                            name:
                                item.title ??
                                "",

                            file:
                                null,

                            oldFile:
                                item.path ??
                                "",

                            altTag:
                                item.altTag ??
                                "",

                            isActive:
                                item.isActive === 1 ||
                                item.isActive === true,
                        })
                    )
                );

            } else {

                setContentItems([
                    {
                        id: Date.now(),
                        documentId: 0,
                        srNo: null,
                        name: "",
                        file: null,
                        oldFile: "",
                        altTag: "",
                        isActive: true,
                    },
                ]);
            }

            setErrors({});
            setShowForm(true);

            window.scrollTo({
                top: 0,
                behavior: "smooth",
            });

        } catch (error) {

            console.error(
                "Get Website Content Error:",
                error
            );

            alert(
                error?.response?.data?.message ||
                "Unable to load website content."
            );

        } finally {

            setFormLoading(false);
        }
    };

    // =========================================================
    // CLOSE FORM
    // =========================================================

    const handleCancel = () => {

        resetForm();

        setShowForm(false);

        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    // =========================================================
    // MAIN FORM CHANGE
    // =========================================================

    const handleChange = (e) => {

        const {
            name,
            value,
            type,
            checked,
        } = e.target;

        setFormData((prev) => ({
            ...prev,

            [name]:
                type === "checkbox"
                    ? checked
                    : value,
        }));

        if (errors[name]) {

            setErrors((prev) => ({
                ...prev,
                [name]: "",
            }));
        }
    };

    // =========================================================
    // CONTENT ITEM CHANGE
    // =========================================================

    const handleItemChange = (
        itemId,
        e
    ) => {

        const {
            name,
            value,
            files,
            type,
            checked,
        } = e.target;

        setContentItems((prev) =>
            prev.map((item) =>
                item.id === itemId
                    ? {
                        ...item,

                        [name]:
                            type === "file"
                                ? files?.[0] || null
                                : type ===
                                    "checkbox"
                                    ? checked
                                    : value,
                    }
                    : item
            )
        );
    };

    // =========================================================
    // ADD MORE DOCUMENT
    // =========================================================

    const addMore = () => {

        setContentItems((prev) => [

            ...prev,

            {
                id: Date.now(),
                documentId: 0,
                srNo: null,
                name: "",
                file: null,
                oldFile: "",
                altTag: "",
                isActive: true,
            },

        ]);
    };

    // =========================================================
    // REMOVE DOCUMENT
    // =========================================================

    const removeItem = (itemId) => {

        if (
            contentItems.length === 1
        ) {
            return;
        }

        setContentItems((prev) =>
            prev.filter(
                (item) =>
                    item.id !== itemId
            )
        );
    };

    // =========================================================
    // VALIDATION
    // =========================================================

    const validateForm = () => {

        const newErrors = {};

        if (
            !formData.productTypeId ||
            Number(
                formData.productTypeId
            ) === 0
        ) {

            newErrors.productTypeId =
                "Menu is required";
        }

        if (
            !formData.title ||
            !formData.title.trim()
        ) {

            newErrors.title =
                "Title is required";
        }

        setErrors(newErrors);

        return (
            Object.keys(
                newErrors
            ).length === 0
        );
    };

    // =========================================================
    // SUBMIT
    // =========================================================

    const handleSubmit = async (e) => {

        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        try {

            setSaving(true);

            let result;

            // =================================================
            // CREATE
            // =================================================

            if (
                Number(editId) === 0
            ) {

                const payload = {

                    productTypeId:
                        Number(
                            formData.productTypeId
                        ),

                    srNo:
                        formData.srNo,

                    title:
                        formData.title,

                    subTitle:
                        formData.subTitle,

                    shortDesc:
                        formData.shortDesc,

                    desc:
                        formData.desc,

                    seoTitle:
                        formData.seoTitle,

                    isActive:
                        formData.isActive,

                    isHighlight:
                        formData.isHighlight,

                    contentItems:
                        contentItems,
                };

                console.log(
                    "CREATE PAYLOAD:",
                    payload
                );

                result =
                    await createWebsiteContent(
                        payload
                    );

            }

            // =================================================
            // UPDATE
            // =================================================

            else {

                const payload = {

                    id:
                        Number(editId),

                    productTypeId:
                        Number(
                            formData.productTypeId
                        ),

                    srNo:
                        formData.srNo,

                    title:
                        formData.title,

                    subTitle:
                        formData.subTitle,

                    shortDesc:
                        formData.shortDesc,

                    desc:
                        formData.desc,

                    seoTitle:
                        formData.seoTitle,

                    isActive:
                        formData.isActive,

                    isHighlight:
                        formData.isHighlight,

                    isDelete:
                        formData.isDelete,

                    contentItems:
                        contentItems,
                };

                console.log(
                    "UPDATE PAYLOAD:",
                    payload
                );

                result =
                    await updateWebsiteContent(
                        payload
                    );
            }

            console.log(
                "SAVE RESPONSE:",
                result
            );

            // =================================================
            // SUCCESS
            // =================================================

            if (
                result?.success ||
                result?.data?.success ||
                result?.status === 200 ||
                result?.status === 201
            ) {

                alert(
                    result?.message ||
                    result?.data?.message ||
                    (
                        Number(editId) > 0
                            ? "Website content updated successfully."
                            : "Website content created successfully."
                    )
                );

                resetForm();

                setShowForm(false);

                await loadWebsiteContent();

                window.scrollTo({
                    top: 0,
                    behavior: "smooth",
                });

            } else {

                alert(
                    result?.message ||
                    result?.data?.message ||
                    (
                        Number(editId) > 0
                            ? "Unable to update website content."
                            : "Unable to create website content."
                    )
                );
            }

        } catch (error) {

            console.error(
                "Website Content Save Error:",
                error
            );

            alert(
                error?.response?.data?.message ||
                error?.response?.data ||
                "Something went wrong while saving website content."
            );

        } finally {

            setSaving(false);
        }
    };

    // =========================================================
    // FILE NAME
    // =========================================================

    const getFileName = (path) => {

        if (!path) {
            return "";
        }

        const parts =
            path.split("/");

        return parts[
            parts.length - 1
        ];
    };

    // =========================================================
    // STRIP HTML
    // =========================================================

    const stripHtml = (html) => {

        if (!html) {
            return "";
        }

        const temp =
            document.createElement("div");

        temp.innerHTML = html;

        return (
            temp.textContent ||
            temp.innerText ||
            ""
        );
    };

    // =========================================================
    // LIST LOADING
    // =========================================================

    if (
        loading &&
        !showForm
    ) {

        return (
            <>
                <style>{`

                    .loading-page {
                        min-height: 100vh;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        background: #f5f7fb;
                        font-family: Inter, Arial, sans-serif;
                    }

                    .loading-box {
                        background: #fff;
                        padding: 30px 40px;
                        border-radius: 14px;
                        box-shadow:
                            0 5px 25px
                            rgba(0,0,0,.08);
                        text-align: center;
                        color: #475569;
                        font-weight: 600;
                    }

                    .loading-spinner {
                        width: 35px;
                        height: 35px;
                        border: 4px solid #ffe5d4;
                        border-top-color: #ff6600;
                        border-radius: 50%;
                        animation:
                            spin .8s linear infinite;
                        margin:
                            0 auto 15px;
                    }

                    @keyframes spin {
                        to {
                            transform: rotate(360deg);
                        }
                    }

                `}</style>

                <div className="loading-page">

                    <div className="loading-box">

                        <div
                            className="loading-spinner"
                        />

                        Loading Website Content...

                    </div>

                </div>
            </>
        );
    }

    // =========================================================
    // LIST VIEW
    // =========================================================

    if (!showForm) {

        const pageNumbers =
            getPageNumbers();

        const startRecord =
            filteredData.length === 0
                ? 0
                : (
                    (currentPage - 1) *
                    recordsPerPage
                ) + 1;

        const endRecord =
            Math.min(
                currentPage *
                recordsPerPage,
                filteredData.length
            );

        return (
            <>
                <style>{`

                    * {
                        box-sizing: border-box;
                    }

                    .website-content-page {
                        min-height: 100vh;
                        background: #f5f7fb;
                        padding: 28px;
                        font-family:
                            Inter,
                            Arial,
                            sans-serif;
                        color: #1f2937;
                    }

                    .page-container {
                        max-width: 1400px;
                        margin: 0 auto;
                    }

                    .page-header {
                        display: flex;
                        align-items: center;
                        justify-content: space-between;
                        margin-bottom: 24px;
                    }

                    .page-title-wrapper {
                        display: flex;
                        align-items: center;
                        gap: 14px;
                    }

                    .page-icon {
                        width: 48px;
                        height: 48px;
                        border-radius: 12px;
                        background:
                            linear-gradient(
                                135deg,
                                #ff6b00,
                                #f45100
                            );
                        color: #fff;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-size: 22px;
                        box-shadow:
                            0 8px 20px
                            rgba(
                                255,
                                102,
                                0,
                                .18
                            );
                    }

                    .page-title {
                        margin: 0;
                        font-size: 25px;
                        font-weight: 700;
                        color: #111827;
                    }

                    .page-subtitle {
                        margin: 4px 0 0;
                        color: #6b7280;
                        font-size: 14px;
                    }

                    .add-main-btn {
                        border: 0;
                        background: #ff6600;
                        color: #fff;
                        padding: 12px 20px;
                        border-radius: 9px;
                        font-size: 14px;
                        font-weight: 700;
                        cursor: pointer;
                        display: flex;
                        align-items: center;
                        gap: 8px;
                        box-shadow:
                            0 6px 16px
                            rgba(
                                255,
                                102,
                                0,
                                .20
                            );
                        transition: .2s;
                    }

                    .add-main-btn:hover {
                        background: #e85d00;
                        transform:
                            translateY(-1px);
                    }

                    .list-card {
                        background: #fff;
                        border: 1px solid #e5e7eb;
                        border-radius: 16px;
                        box-shadow:
                            0 4px 18px
                            rgba(
                                15,
                                23,
                                42,
                                .04
                            );
                        overflow: hidden;
                    }

                    .list-card-header {
                        padding: 18px 22px;
                        border-bottom:
                            1px solid #edf0f4;
                        display: flex;
                        align-items: center;
                        justify-content:
                            space-between;
                        gap: 20px;
                        flex-wrap: wrap;
                    }

                    .list-title {
                        margin: 0;
                        font-size: 16px;
                        font-weight: 700;
                        color: #111827;
                    }

                    .record-count {
                        font-size: 12px;
                        color: #64748b;
                        background: #f8fafc;
                        border: 1px solid #e2e8f0;
                        padding: 6px 10px;
                        border-radius: 20px;
                    }

                    .list-toolbar {
                        padding: 16px 22px;
                        display: flex;
                        align-items: center;
                        justify-content:
                            space-between;
                        gap: 15px;
                        border-bottom:
                            1px solid #edf0f4;
                        background: #fff;
                        flex-wrap: wrap;
                    }

                    .search-box {
                        position: relative;
                        width: 330px;
                        max-width: 100%;
                    }

                    .search-icon {
                        position: absolute;
                        left: 13px;
                        top: 50%;
                        transform:
                            translateY(-50%);
                        color: #94a3b8;
                        font-size: 14px;
                    }

                    .search-input {
                        width: 100%;
                        height: 42px;
                        padding:
                            0 38px 0 38px;
                        border:
                            1px solid #d9dee7;
                        border-radius: 9px;
                        outline: none;
                        font-size: 13px;
                        color: #334155;
                        background: #fff;
                    }

                    .search-input:focus {
                        border-color: #ff6600;
                        box-shadow:
                            0 0 0 3px
                            rgba(
                                255,
                                102,
                                0,
                                .08
                            );
                    }

                    .clear-search {
                        position: absolute;
                        right: 10px;
                        top: 50%;
                        transform:
                            translateY(-50%);
                        border: 0;
                        background: transparent;
                        color: #94a3b8;
                        cursor: pointer;
                        font-size: 18px;
                        line-height: 1;
                    }

                    .records-control {
                        display: flex;
                        align-items: center;
                        gap: 8px;
                        color: #64748b;
                        font-size: 13px;
                        font-weight: 600;
                    }

                    .records-select {
                        height: 40px;
                        min-width: 82px;
                        padding: 0 10px;
                        border:
                            1px solid #d9dee7;
                        border-radius: 8px;
                        outline: none;
                        background: #fff;
                        color: #334155;
                        font-size: 13px;
                        cursor: pointer;
                    }

                    .records-select:focus {
                        border-color: #ff6600;
                    }

                    .table-wrapper {
                        width: 100%;
                        overflow-x: auto;
                    }

                    .list-table {
                        width: 100%;
                        border-collapse:
                            collapse;
                    }

                    .list-table th {
                        background: #f8fafc;
                        color: #64748b;
                        font-size: 12px;
                        text-transform:
                            uppercase;
                        letter-spacing: .3px;
                        font-weight: 700;
                        padding: 14px 16px;
                        border-bottom:
                            1px solid #e5e7eb;
                        text-align: left;
                        white-space: nowrap;
                    }

                    .list-table td {
                        padding: 15px 16px;
                        border-bottom:
                            1px solid #eef0f3;
                        vertical-align: top;
                        font-size: 13px;
                        color: #475569;
                    }

                    .list-table tr:last-child td {
                        border-bottom: 0;
                    }

                    .title-cell {
                        color: #111827 !important;
                        font-weight: 700;
                        min-width: 180px;
                    }

                    .description-cell {
                        max-width: 380px;
                        min-width: 250px;
                        line-height: 1.5;
                    }

                    .description-text {
                        display: -webkit-box;
                        -webkit-line-clamp: 3;
                        -webkit-box-orient: vertical;
                        overflow: hidden;
                    }

                    .empty-text {
                        color: #94a3b8;
                        font-style: italic;
                    }

                    .action-cell {
                        width: 120px;
                        white-space: nowrap;
                    }

                    .edit-btn {
                        border:
                            1px solid #fed7aa;
                        background: #fff7ed;
                        color: #ea580c;
                        min-width: 72px;
                        height: 36px;
                        padding: 0 12px;
                        border-radius: 7px;
                        cursor: pointer;
                        font-size: 12px;
                        font-weight: 700;
                        transition: .2s;
                    }

                    .edit-btn:hover {
                        background: #ffedd5;
                    }

                    .empty-state {
                        padding: 60px 20px;
                        text-align: center;
                        color: #64748b;
                    }

                    .empty-icon {
                        width: 60px;
                        height: 60px;
                        margin: 0 auto 15px;
                        border-radius: 15px;
                        background: #fff3e8;
                        color: #ff6600;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-size: 25px;
                    }

                    .pagination-area {
                        padding:
                            16px 22px;
                        border-top:
                            1px solid #edf0f4;
                        display: flex;
                        align-items: center;
                        justify-content:
                            space-between;
                        gap: 15px;
                        flex-wrap: wrap;
                    }

                    .pagination-info {
                        font-size: 12px;
                        color: #64748b;
                    }

                    .pagination {
                        display: flex;
                        align-items: center;
                        gap: 5px;
                        margin: 0;
                    }

                    .page-btn {
                        min-width: 36px;
                        height: 36px;
                        padding: 0 9px;
                        border:
                            1px solid #dce1e8;
                        background: #fff;
                        color: #475569;
                        border-radius: 7px;
                        cursor: pointer;
                        font-size: 12px;
                        font-weight: 700;
                        transition: .2s;
                    }

                    .page-btn:hover:not(:disabled) {
                        border-color: #ff6600;
                        color: #ff6600;
                        background: #fff7ed;
                    }

                    .page-btn.active {
                        background: #ff6600;
                        color: #fff;
                        border-color: #ff6600;
                    }

                    .page-btn:disabled {
                        opacity: .45;
                        cursor: not-allowed;
                    }

                    .page-dots {
                        min-width: 25px;
                        text-align: center;
                        color: #94a3b8;
                    }

                    @media (max-width: 768px) {

                        .website-content-page {
                            padding: 15px;
                        }

                        .page-header {
                            align-items: flex-start;
                            gap: 15px;
                            flex-direction:
                                column;
                        }

                        .add-main-btn {
                            width: 100%;
                            justify-content:
                                center;
                        }

                        .list-toolbar {
                            align-items:
                                stretch;
                            flex-direction:
                                column;
                        }

                        .search-box {
                            width: 100%;
                        }

                        .records-control {
                            justify-content:
                                space-between;
                        }

                        .pagination-area {
                            align-items:
                                flex-start;
                            flex-direction:
                                column;
                        }

                        .pagination {
                            width: 100%;
                            justify-content:
                                center;
                            flex-wrap: wrap;
                        }

                    }

                `}</style>

                <div
                    className="website-content-page"
                >

                    <div
                        className="page-container"
                    >

                        {/* =================================================
                            HEADER
                        ================================================= */}

                        <div
                            className="page-header"
                        >

                            <div
                                className="page-title-wrapper"
                            >

                                <div
                                    className="page-icon"
                                >
                                    ✦
                                </div>

                                <div>

                                    <h1
                                        className="page-title"
                                    >
                                        Website Content
                                    </h1>

                                    <p
                                        className="page-subtitle"
                                    >
                                        Manage your website content
                                    </p>

                                </div>

                            </div>

                            <button
                                type="button"
                                className="add-main-btn"
                                onClick={handleAdd}
                            >

                                <span>
                                    ＋
                                </span>

                                Add Content

                            </button>

                        </div>

                        {/* =================================================
                            LIST CARD
                        ================================================= */}

                        <div
                            className="list-card"
                        >

                            <div
                                className="list-card-header"
                            >

                                <h2
                                    className="list-title"
                                >
                                    Website Content List
                                </h2>

                                <span
                                    className="record-count"
                                >
                                    {filteredData.length} Records
                                </span>

                            </div>

                            {/* =================================================
                                SEARCH + RECORDS
                            ================================================= */}

                            <div
                                className="list-toolbar"
                            >

                                <div
                                    className="search-box"
                                >

                                    <span
                                        className="search-icon"
                                    >
                                        🔍
                                    </span>

                                    <input
                                        type="text"
                                        className="search-input"
                                        value={searchText}
                                        onChange={(e) =>
                                            setSearchText(
                                                e.target.value
                                            )
                                        }
                                        placeholder="Search title, short description..."
                                    />

                                    {searchText && (

                                        <button
                                            type="button"
                                            className="clear-search"
                                            onClick={() =>
                                                setSearchText("")
                                            }
                                        >
                                            ×
                                        </button>

                                    )}

                                </div>

                                <div
                                    className="records-control"
                                >

                                    <span>
                                        Show
                                    </span>

                                    <select
                                        className="records-select"
                                        value={
                                            recordsPerPage
                                        }
                                        onChange={
                                            handleRecordsPerPage
                                        }
                                    >

                                        <option value={10}>
                                            10
                                        </option>

                                        <option value={25}>
                                            25
                                        </option>

                                        <option value={50}>
                                            50
                                        </option>

                                        <option value={100}>
                                            100
                                        </option>

                                    </select>

                                    <span>
                                        records
                                    </span>

                                </div>

                            </div>

                            {/* =================================================
                                TABLE
                            ================================================= */}

                            <div
                                className="table-wrapper"
                            >

                                {paginatedData.length ===
                                    0 ? (

                                    <div
                                        className="empty-state"
                                    >

                                        <div
                                            className="empty-icon"
                                        >
                                            ✦
                                        </div>

                                        <div>
                                            {searchText
                                                ? "No matching website content found."
                                                : "No website content found."}
                                        </div>

                                    </div>

                                ) : (

                                    <table
                                        className="list-table"
                                    >

                                        <thead>

                                            <tr>

                                                <th>
                                                    #
                                                </th>
                                                <th>
                                                    Title
                                                </th>

                                                <th>
                                                    Short Description
                                                </th>

                                                <th>
                                                    Description
                                                </th>

                                                <th>
                                                    Action
                                                </th>

                                            </tr>

                                        </thead>

                                        <tbody>

                                            {paginatedData.map(
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

                                                        {/* TITLE */}

                                                        <td
                                                            className="title-cell"
                                                        >
                                                            {
                                                                 index + 1
                                                            }
                                                        </td>
                                                        {/* TITLE */}

                                                        <td
                                                            className="title-cell"
                                                        >
                                                            {
                                                                item.title ||
                                                                "-"
                                                            }
                                                        </td>

                                                        {/* SHORT DESCRIPTION */}

                                                        <td
                                                            className="description-cell"
                                                        >

                                                            {item.shortDescription ? (

                                                                <div
                                                                    className="description-text"
                                                                    title={
                                                                        stripHtml(
                                                                            item.shortDescription
                                                                        )
                                                                    }
                                                                >
                                                                    {
                                                                        stripHtml(
                                                                            item.shortDescription
                                                                        )
                                                                    }
                                                                </div>

                                                            ) : (

                                                                <span
                                                                    className="empty-text"
                                                                >
                                                                    No short description
                                                                </span>

                                                            )}

                                                        </td>

                                                        {/* DESCRIPTION */}

                                                        <td
                                                            className="description-cell"
                                                        >

                                                            {item.descrption ? (

                                                                <div
                                                                    className="description-text"
                                                                    title={
                                                                        stripHtml(
                                                                            item.descrption
                                                                        )
                                                                    }
                                                                >
                                                                    {
                                                                        stripHtml(
                                                                            item.descrption
                                                                        )
                                                                    }
                                                                </div>

                                                            ) : (

                                                                <span
                                                                    className="empty-text"
                                                                >
                                                                    No description
                                                                </span>

                                                            )}

                                                        </td>

                                                        {/* ACTION */}

                                                        <td
                                                            className="action-cell"
                                                        >

                                                            <button
                                                                type="button"
                                                                className="edit-btn"
                                                                onClick={() =>
                                                                    handleEdit(
                                                                        item.id
                                                                    )
                                                                }
                                                            >
                                                                Edit
                                                            </button>

                                                        </td>

                                                    </tr>

                                                )
                                            )}

                                        </tbody>

                                    </table>

                                )}

                            </div>

                            {/* =================================================
                                PAGINATION
                            ================================================= */}

                            {filteredData.length > 0 && (

                                <div
                                    className="pagination-area"
                                >

                                    <div
                                        className="pagination-info"
                                    >
                                        Showing{" "}
                                        <strong>
                                            {startRecord}
                                        </strong>
                                        {" - "}
                                        <strong>
                                            {endRecord}
                                        </strong>
                                        {" of "}
                                        <strong>
                                            {filteredData.length}
                                        </strong>
                                    </div>

                                    <div
                                        className="pagination"
                                    >

                                        {/* PREVIOUS */}

                                        <button
                                            type="button"
                                            className="page-btn"
                                            disabled={
                                                currentPage === 1
                                            }
                                            onClick={() =>
                                                goToPage(
                                                    currentPage - 1
                                                )
                                            }
                                        >
                                            Previous
                                        </button>

                                        {/* FIRST PAGE DOT */}

                                        {totalPages > 5 &&
                                            currentPage > 3 && (
                                                <>
                                                    <button
                                                        type="button"
                                                        className="page-btn"
                                                        onClick={() =>
                                                            goToPage(1)
                                                        }
                                                    >
                                                        1
                                                    </button>

                                                    <span
                                                        className="page-dots"
                                                    >
                                                        ...
                                                    </span>
                                                </>
                                            )}

                                        {/* PAGE NUMBERS */}

                                        {pageNumbers.map(
                                            (page) => (

                                                <button
                                                    type="button"
                                                    key={page}
                                                    className={`page-btn ${currentPage === page
                                                            ? "active"
                                                            : ""
                                                        }`}
                                                    onClick={() =>
                                                        goToPage(
                                                            page
                                                        )
                                                    }
                                                >
                                                    {page}
                                                </button>

                                            )
                                        )}

                                        {/* LAST PAGE DOT */}

                                        {totalPages > 5 &&
                                            currentPage <
                                            totalPages - 2 && (
                                                <>
                                                    <span
                                                        className="page-dots"
                                                    >
                                                        ...
                                                    </span>

                                                    <button
                                                        type="button"
                                                        className="page-btn"
                                                        onClick={() =>
                                                            goToPage(
                                                                totalPages
                                                            )
                                                        }
                                                    >
                                                        {
                                                            totalPages
                                                        }
                                                    </button>
                                                </>
                                            )}

                                        {/* NEXT */}

                                        <button
                                            type="button"
                                            className="page-btn"
                                            disabled={
                                                currentPage ===
                                                totalPages
                                            }
                                            onClick={() =>
                                                goToPage(
                                                    currentPage + 1
                                                )
                                            }
                                        >
                                            Next
                                        </button>

                                    </div>

                                </div>

                            )}

                        </div>

                    </div>

                </div>
            </>
        );
    }

    // =========================================================
    // FORM LOADING
    // =========================================================

    if (formLoading) {

        return (
            <>
                <style>{`

                    .loading-page {
                        min-height: 100vh;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        background: #f5f7fb;
                        font-family: Inter, Arial, sans-serif;
                    }

                    .loading-box {
                        background: #fff;
                        padding: 30px 40px;
                        border-radius: 14px;
                        box-shadow:
                            0 5px 25px
                            rgba(0,0,0,.08);
                        text-align: center;
                        color: #475569;
                        font-weight: 600;
                    }

                    .loading-spinner {
                        width: 35px;
                        height: 35px;
                        border: 4px solid #ffe5d4;
                        border-top-color: #ff6600;
                        border-radius: 50%;
                        animation:
                            spin .8s linear infinite;
                        margin:
                            0 auto 15px;
                    }

                    @keyframes spin {
                        to {
                            transform: rotate(360deg);
                        }
                    }

                `}</style>

                <div className="loading-page">

                    <div className="loading-box">

                        <div
                            className="loading-spinner"
                        />

                        Loading Content...

                    </div>

                </div>
            </>
        );
    }

    // =========================================================
    // FORM VIEW
    // =========================================================

    return (
        <>
            <style>{`

                * {
                    box-sizing: border-box;
                }

                .website-content-page {
                    min-height: 100vh;
                    background: #f5f7fb;
                    padding: 28px;
                    font-family:
                        Inter,
                        Arial,
                        sans-serif;
                    color: #1f2937;
                }

                .page-container {
                    max-width: 1400px;
                    margin: 0 auto;
                }

                .page-header {
                    display: flex;
                    align-items: center;
                    justify-content:
                        space-between;
                    margin-bottom: 24px;
                }

                .page-title-wrapper {
                    display: flex;
                    align-items: center;
                    gap: 14px;
                }

                .page-icon {
                    width: 48px;
                    height: 48px;
                    border-radius: 12px;
                    background:
                        linear-gradient(
                            135deg,
                            #ff6b00,
                            #f45100
                        );
                    color: #fff;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 22px;
                    box-shadow:
                        0 8px 20px
                        rgba(
                            255,
                            102,
                            0,
                            .18
                        );
                }

                .page-title {
                    margin: 0;
                    font-size: 25px;
                    font-weight: 700;
                    color: #111827;
                }

                .page-subtitle {
                    margin: 4px 0 0;
                    color: #6b7280;
                    font-size: 14px;
                }

                .header-actions {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }

                .mode-badge {
                    padding: 7px 12px;
                    border-radius: 20px;
                    font-size: 12px;
                    font-weight: 700;
                    background: #fff3e8;
                    color: #ff6600;
                }

                .back-list-btn {
                    border: 1px solid #d9dee7;
                    background: #fff;
                    color: #475569;
                    height: 38px;
                    padding: 0 14px;
                    border-radius: 8px;
                    font-size: 12px;
                    font-weight: 700;
                    cursor: pointer;
                }

                .back-list-btn:hover {
                    background: #f8fafc;
                }

                .card {
                    background: #fff;
                    border: 1px solid #e5e7eb;
                    border-radius: 16px;
                    box-shadow:
                        0 4px 18px
                        rgba(
                            15,
                            23,
                            42,
                            .04
                        );
                    margin-bottom: 22px;
                    overflow: hidden;
                }

                .card-header {
                    padding: 18px 22px;
                    border-bottom:
                        1px solid #edf0f4;
                    display: flex;
                    align-items: center;
                    justify-content:
                        space-between;
                    background: #fff;
                }

                .card-header-left {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }

                .section-number {
                    width: 30px;
                    height: 30px;
                    border-radius: 8px;
                    background: #fff3e8;
                    color: #ff6600;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: 700;
                    font-size: 13px;
                }

                .card-title {
                    margin: 0;
                    font-size: 16px;
                    font-weight: 700;
                    color: #111827;
                }

                .card-body {
                    padding: 24px 22px;
                }

                .form-label {
                    font-size: 13px;
                    font-weight: 600;
                    color: #374151;
                    margin-bottom: 7px;
                }

                .required {
                    color: #ef4444;
                    margin-left: 3px;
                }

                .validation-text {
                    display: block;
                    margin-top: 5px;
                    font-size: 12px;
                    color: #dc2626;
                    font-weight: 500;
                }

                .form-control,
                .form-select {
                    width: 100%;
                    min-height: 44px;
                    padding: 10px 13px;
                    border:
                        1px solid #d9dee7;
                    border-radius: 9px;
                    background: #fff;
                    color: #1f2937;
                    outline: none;
                    font-size: 14px;
                    transition: .2s;
                }

                .form-control:focus,
                .form-select:focus {
                    border-color: #ff6600;
                    box-shadow:
                        0 0 0 3px
                        rgba(
                            255,
                            102,
                            0,
                            .10
                        );
                }

                .ck.ck-editor {
                    width: 100%;
                }

                .ck-editor__editable {
                    min-height: 150px;
                }

                .short-desc-editor
                .ck-editor__editable {
                    min-height: 100px;
                }

                .description-editor
                .ck-editor__editable {
                    min-height: 180px;
                }

                .ck.ck-toolbar {
                    border-color:
                        #d9dee7 !important;
                    border-radius:
                        9px 9px 0 0 !important;
                }

                .ck.ck-editor__main
                > .ck-editor__editable {
                    border-color:
                        #d9dee7 !important;
                    border-radius:
                        0 0 9px 9px !important;
                }

                .ck.ck-editor__main
                > .ck-editor__editable:focus {
                    border-color:
                        #ff6600 !important;
                    box-shadow:
                        0 0 0 1px
                        #ff6600 !important;
                }

                .status-area {
                    display: flex;
                    align-items: center;
                    gap: 28px;
                    padding-top: 3px;
                }

                .checkbox-wrapper {
                    display: inline-flex;
                    align-items: center;
                    gap: 9px;
                    cursor: pointer;
                    user-select: none;
                }

                .checkbox-wrapper input {
                    width: 18px;
                    height: 18px;
                    accent-color: #ff6600;
                    cursor: pointer;
                }

                .checkbox-label {
                    font-size: 14px;
                    font-weight: 600;
                    color: #374151;
                }

                .active-badge {
                    font-size: 11px;
                    padding: 4px 9px;
                    border-radius: 20px;
                    background: #dcfce7;
                    color: #15803d;
                    font-weight: 600;
                }

                .highlight-badge {
                    font-size: 11px;
                    padding: 4px 9px;
                    border-radius: 20px;
                    background: #fef3c7;
                    color: #b45309;
                    font-weight: 600;
                }

                .add-btn {
                    border: 0;
                    background: #ff6600;
                    color: white;
                    padding: 10px 16px;
                    border-radius: 8px;
                    font-size: 13px;
                    font-weight: 600;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    gap: 7px;
                }

                .add-btn:hover {
                    background: #e85d00;
                }

                .table-wrapper {
                    width: 100%;
                    overflow-x: auto;
                }

                .content-table {
                    width: 100%;
                    border-collapse:
                        collapse;
                    min-width: 950px;
                }

                .content-table th {
                    background: #f8fafc;
                    color: #64748b;
                    font-size: 12px;
                    text-transform:
                        uppercase;
                    letter-spacing: .3px;
                    font-weight: 700;
                    padding: 13px 12px;
                    border-bottom:
                        1px solid #e5e7eb;
                    text-align: left;
                    white-space: nowrap;
                }

                .content-table td {
                    padding: 13px 12px;
                    border-bottom:
                        1px solid #eef0f3;
                    vertical-align: middle;
                }

                .sr-no {
                    width: 45px;
                    height: 32px;
                    border-radius: 7px;
                    background: #fff3e8;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 13px;
                    font-weight: 700;
                    color: #ff6600;
                }

                .table-input-srno {
                    width: 30%;
                    min-width: 50px;
                    height: 40px;
                    border:
                        1px solid #dce1e8;
                    border-radius: 7px;
                    padding: 8px 10px;
                    font-size: 13px;
                    outline: none;
                    background: #fff;
                }
                .table-input {
                    width: 100%;
                    min-width: 150px;
                    height: 40px;
                    border:
                        1px solid #dce1e8;
                    border-radius: 7px;
                    padding: 8px 10px;
                    font-size: 13px;
                    outline: none;
                    background: #fff;
                }

                .table-input:focus {
                    border-color: #ff6600;
                    box-shadow:
                        0 0 0 3px
                        rgba(
                            255,
                            102,
                            0,
                            .08
                        );
                }

                .file-input {
                    width: 210px;
                    font-size: 12px;
                    color: #64748b;
                }

                .file-input::file-selector-button {
                    border: 0;
                    background: #fff3e8;
                    color: #ff6600;
                    padding: 8px 11px;
                    border-radius: 6px;
                    font-weight: 600;
                    cursor: pointer;
                    margin-right: 8px;
                }

                .old-file-box {
                    margin-top: 7px;
                    display: flex;
                    align-items: center;
                    gap: 7px;
                    font-size: 11px;
                    color: #64748b;
                }

                .old-file-label {
                    color: #94a3b8;
                    font-weight: 600;
                }

                .old-file-name {
                    color: #475569;
                    font-weight: 500;
                    max-width: 330px;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }

                .new-file-name {
                    margin-top: 5px;
                    font-size: 11px;
                    color: #15803d;
                    font-weight: 600;
                }

                .item-status {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    white-space: nowrap;
                }

                .item-status-checkbox {
                    width: 18px;
                    height: 18px;
                    accent-color: #ff6600;
                    cursor: pointer;
                }

                .item-status-label {
                    font-size: 13px;
                    font-weight: 600;
                    color: #475569;
                    cursor: pointer;
                }

                .item-active-badge {
                    font-size: 10px;
                    padding: 3px 7px;
                    border-radius: 20px;
                    background: #dcfce7;
                    color: #15803d;
                    font-weight: 700;
                }

                .item-inactive-badge {
                    font-size: 10px;
                    padding: 3px 7px;
                    border-radius: 20px;
                    background: #f1f5f9;
                    color: #64748b;
                    font-weight: 700;
                }

                .remove-btn {
                    width: 36px;
                    height: 36px;
                    border:
                        1px solid #fecaca;
                    background: #fff1f2;
                    color: #dc2626;
                    border-radius: 8px;
                    cursor: pointer;
                    font-size: 16px;
                }

                .footer {
                    display: flex;
                    align-items: center;
                    justify-content: flex-end;
                    gap: 12px;
                    padding: 18px 22px;
                    border-top:
                        1px solid #edf0f4;
                    background: #fafbfc;
                }

                .btn {
                    min-width: 110px;
                    height: 42px;
                    padding: 0 18px;
                    border-radius: 8px;
                    border:
                        1px solid #d9dee7;
                    font-size: 14px;
                    font-weight: 600;
                    cursor: pointer;
                }

                .btn-cancel {
                    background: white;
                    color: #475569;
                }

                .btn-save {
                    background: #ff6600;
                    color: white;
                    border-color: #ff6600;
                    box-shadow:
                        0 5px 12px
                        rgba(
                            255,
                            102,
                            0,
                            .20
                        );
                }

                .btn-save:hover {
                    background: #e85d00;
                }

                .btn-save:disabled,
                .btn-cancel:disabled {
                    opacity: .7;
                    cursor: not-allowed;
                }

                @media (max-width: 768px) {

                    .website-content-page {
                        padding: 15px;
                    }

                    .page-header {
                        align-items:
                            flex-start;
                        gap: 15px;
                        flex-direction:
                            column;
                    }

                    .header-actions {
                        width: 100%;
                    }

                    .mode-badge {
                        display: none;
                    }

                    .card-body {
                        padding:
                            18px 15px;
                    }

                    .status-area {
                        flex-direction:
                            column;
                        align-items:
                            flex-start;
                        gap: 14px;
                    }

                }

            `}</style>

            <div
                className="website-content-page"
            >

                <div
                    className="page-container"
                >

                    {/* =================================================
                        HEADER
                    ================================================= */}

                    <div
                        className="page-header"
                    >

                        <div
                            className="page-title-wrapper"
                        >

                            <div
                                className="page-icon"
                            >
                                ✦
                            </div>

                            <div>

                                <h1
                                    className="page-title"
                                >
                                    Website Content
                                </h1>

                                <p
                                    className="page-subtitle"
                                >
                                    {editId > 0
                                        ? "Update website content"
                                        : "Create new website content"}
                                </p>

                            </div>

                        </div>

                        <div
                            className="header-actions"
                        >

                            <div
                                className="mode-badge"
                            >
                                {editId > 0
                                    ? "Edit Mode"
                                    : "Create Mode"}
                            </div>

                            <button
                                type="button"
                                className="back-list-btn"
                                onClick={
                                    handleCancel
                                }
                            >
                                ← Back to List
                            </button>

                        </div>

                    </div>

                    {/* =================================================
                        FORM
                    ================================================= */}

                    <form
                        onSubmit={
                            handleSubmit
                        }
                    >

                        {/* =================================================
                            CONTENT INFORMATION
                        ================================================= */}

                        <div className="card">

                            <div
                                className="card-header"
                            >

                                <div
                                    className="card-header-left"
                                >

                                    <div
                                        className="section-number"
                                    >
                                        01
                                    </div>

                                    <h2
                                        className="card-title"
                                    >
                                        Content Information
                                    </h2>

                                </div>

                            </div>

                            <div
                                className="card-body"
                            >

                                {/* MENU + TITLE */}

                                <div className="row">

                                    <div
                                        className="col-md-6 mb-3"
                                    >

                                        <label
                                            className="form-label"
                                        >
                                            Menu
                                            <span
                                                className="required"
                                            >
                                                *
                                            </span>
                                        </label>

                                        <select
                                            name="productTypeId"
                                            value={
                                                formData.productTypeId
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            className="form-select"
                                        >

                                            <option value="">
                                                Select Menu
                                            </option>

                                            {menus.map(
                                                (item) => (

                                                    <option
                                                        key={
                                                            item.id
                                                        }
                                                        value={
                                                            item.id
                                                        }
                                                    >
                                                        {
                                                            item.name
                                                        }
                                                    </option>

                                                )
                                            )}

                                        </select>

                                        {errors.productTypeId && (

                                            <small
                                                className="validation-text"
                                            >
                                                {
                                                    errors.productTypeId
                                                }
                                            </small>

                                        )}

                                    </div>

                                    <div
                                        className="col-md-6 mb-3"
                                    >

                                        <label
                                            className="form-label"
                                        >
                                            Title
                                            <span
                                                className="required"
                                            >
                                                *
                                            </span>
                                        </label>

                                        <input
                                            type="text"
                                            name="title"
                                            value={
                                                formData.title
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            className="form-control"
                                            placeholder="Enter title"
                                        />

                                        {errors.title && (

                                            <small
                                                className="validation-text"
                                            >
                                                {
                                                    errors.title
                                                }
                                            </small>

                                        )}

                                    </div>

                                </div>

                                {/* SUB TITLE + SHORT DESCRIPTION */}

                                <div className="row">

                                    <div
                                        className="col-md-2 mb-3"
                                    >

                                        <label
                                            className="form-label"
                                        >
                                           SrNo
                                        </label>

                                        <input
                                            type="number"
                                            name="srNo1"
                                            value={
                                                formData.srNo1
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            className="form-control"
                                            
                                        />

                                    </div>
                                    <div
                                        className="col-md-4 mb-3"
                                    >

                                        <label
                                            className="form-label"
                                        >
                                            Sub Title
                                        </label>

                                        <input
                                            type="text"
                                            name="subTitle"
                                            value={
                                                formData.subTitle
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            className="form-control"
                                            placeholder="Enter sub title"
                                        />

                                    </div>

                                    <div
                                        className="col-md-6 mb-3 short-desc-editor"
                                    >

                                        <label
                                            className="form-label"
                                        >
                                            Short Description
                                        </label>

                                        <CKEditor
                                            editor={
                                                ClassicEditor
                                            }
                                            data={
                                                formData.shortDesc
                                            }
                                            onChange={(
                                                event,
                                                editor
                                            ) => {

                                                setFormData(
                                                    (prev) => ({
                                                        ...prev,
                                                        shortDesc:
                                                            editor.getData(),
                                                    })
                                                );

                                            }}
                                        />

                                    </div>

                                </div>

                                {/* DESCRIPTION */}

                                <div className="row">

                                    <div
                                        className="col-md-12 mb-3 description-editor"
                                    >

                                        <label
                                            className="form-label"
                                        >
                                            Description
                                        </label>

                                        <CKEditor
                                            editor={
                                                ClassicEditor
                                            }
                                            data={
                                                formData.desc
                                            }
                                            onChange={(
                                                event,
                                                editor
                                            ) => {

                                                setFormData(
                                                    (prev) => ({
                                                        ...prev,
                                                        desc:
                                                            editor.getData(),
                                                    })
                                                );

                                            }}
                                        />

                                    </div>

                                </div>

                                {/* STATUS */}

                                <div className="row">

                                    <div
                                        className="col-md-12"
                                    >

                                        <label
                                            className="form-label"
                                        >
                                            Status
                                        </label>

                                        <div
                                            className="status-area"
                                        >

                                            <label
                                                className="checkbox-wrapper"
                                            >

                                                <input
                                                    type="checkbox"
                                                    name="isActive"
                                                    checked={
                                                        !!formData.isActive
                                                    }
                                                    onChange={
                                                        handleChange
                                                    }
                                                />

                                                <span
                                                    className="checkbox-label"
                                                >
                                                    Is Active
                                                </span>

                                                {formData.isActive && (

                                                    <span
                                                        className="active-badge"
                                                    >
                                                        Active
                                                    </span>

                                                )}

                                            </label>

                                            <label
                                                className="checkbox-wrapper"
                                            >

                                                <input
                                                    type="checkbox"
                                                    name="isHighlight"
                                                    checked={
                                                        !!formData.isHighlight
                                                    }
                                                    onChange={
                                                        handleChange
                                                    }
                                                />

                                                <span
                                                    className="checkbox-label"
                                                >
                                                    Is Highlight
                                                </span>

                                                {formData.isHighlight && (

                                                    <span
                                                        className="highlight-badge"
                                                    >
                                                        Highlight
                                                    </span>

                                                )}

                                            </label>

                                        </div>

                                    </div>

                                </div>

                            </div>

                        </div>

                        {/* =================================================
                            ADDITIONAL CONTENT
                        ================================================= */}

                        <div className="card">

                            <div
                                className="card-header"
                            >

                                <div
                                    className="card-header-left"
                                >

                                    <div
                                        className="section-number"
                                    >
                                        02
                                    </div>

                                    <h2
                                        className="card-title"
                                    >
                                        Additional Content
                                    </h2>

                                </div>

                                <button
                                    type="button"
                                    className="add-btn"
                                    onClick={
                                        addMore
                                    }
                                >
                                    ＋ Add More
                                </button>

                            </div>

                            <div
                                className="card-body"
                                style={{
                                    padding: 0,
                                }}
                            >

                                <div
                                    className="table-wrapper"
                                >

                                    <table
                                        className="content-table"
                                    >

                                        <thead>

                                            <tr>

                                                <th>
                                                    #
                                                </th>
                                                <th>
                                                    Sr. No.
                                                </th>

                                                <th>
                                                    Name
                                                </th>

                                                <th>
                                                    File
                                                </th>

                                                <th>
                                                    Alt Tag
                                                </th>

                                                <th>
                                                    Status
                                                </th>

                                                <th>
                                                    Action
                                                </th>

                                            </tr>

                                        </thead>

                                        <tbody>

                                            {contentItems.map(
                                                (
                                                    item,
                                                    index
                                                ) => (

                                                    <React.Fragment
                                                        key={
                                                            item.id
                                                        }
                                                    >

                                                        <tr>

                                                            <td
                                                                rowSpan="2"
                                                            >

                                                                <div
                                                                    className="sr-no"
                                                                >
                                                                    {
                                                                        index + 1
                                                                    }
                                                                </div>

                                                            </td>

                                                            <td>

                                                                <input
                                                                    type="text"
                                                                    name="srNo"
                                                                    value={
                                                                        item.srNo
                                                                    }
                                                                    onChange={(
                                                                        e
                                                                    ) =>
                                                                        handleItemChange(
                                                                            item.id,
                                                                            e
                                                                        )
                                                                    }
                                                                    className="table-input-srno"

                                                                />

                                                            </td>
                                                            <td>

                                                                <input
                                                                    type="text"
                                                                    name="name"
                                                                    value={
                                                                        item.name
                                                                    }
                                                                    onChange={(
                                                                        e
                                                                    ) =>
                                                                        handleItemChange(
                                                                            item.id,
                                                                            e
                                                                        )
                                                                    }
                                                                    className="table-input"
                                                                    placeholder="Enter name"
                                                                />

                                                            </td>

                                                            <td>

                                                                <input
                                                                    type="file"
                                                                    name="file"
                                                                    onChange={(
                                                                        e
                                                                    ) =>
                                                                        handleItemChange(
                                                                            item.id,
                                                                            e
                                                                        )
                                                                    }
                                                                    className="file-input"
                                                                    accept="image/*,.pdf,.doc,.docx"
                                                                />

                                                                {item.oldFile && (

                                                                    <div
                                                                        className="old-file-box"
                                                                    >

                                                                        <span
                                                                            className="old-file-label"
                                                                        >
                                                                            Existing:
                                                                        </span>

                                                                        <span
                                                                            className="old-file-name"
                                                                            title={
                                                                                getFileName(
                                                                                    item.oldFile
                                                                                )
                                                                            }
                                                                        >
                                                                            {
                                                                                getFileName(
                                                                                    item.oldFile
                                                                                )
                                                                            }
                                                                        </span>

                                                                    </div>

                                                                )}

                                                                {item.file && (

                                                                    <div
                                                                        className="new-file-name"
                                                                    >
                                                                        New:
                                                                        {" "}
                                                                        {
                                                                            item.file.name
                                                                        }
                                                                    </div>

                                                                )}

                                                            </td>

                                                            <td>

                                                                <input
                                                                    type="text"
                                                                    name="altTag"
                                                                    value={
                                                                        item.altTag
                                                                    }
                                                                    onChange={(
                                                                        e
                                                                    ) =>
                                                                        handleItemChange(
                                                                            item.id,
                                                                            e
                                                                        )
                                                                    }
                                                                    className="table-input"
                                                                    placeholder="Enter alt tag"
                                                                />

                                                            </td>

                                                            <td
                                                                rowSpan="2"
                                                            >

                                                                <div
                                                                    className="item-status"
                                                                >

                                                                    <input
                                                                        id={
                                                                            `item-active-${item.id}`
                                                                        }
                                                                        type="checkbox"
                                                                        name="isActive"
                                                                        checked={
                                                                            !!item.isActive
                                                                        }
                                                                        onChange={(
                                                                            e
                                                                        ) =>
                                                                            handleItemChange(
                                                                                item.id,
                                                                                e
                                                                            )
                                                                        }
                                                                        className="item-status-checkbox"
                                                                    />

                                                                    <label
                                                                        htmlFor={
                                                                            `item-active-${item.id}`
                                                                        }
                                                                        className="item-status-label"
                                                                    >
                                                                        Active
                                                                    </label>



                                                                </div>

                                                            </td>

                                                            <td
                                                                rowSpan="2"
                                                            >

                                                                <button
                                                                    type="button"
                                                                    className="remove-btn"
                                                                    onClick={() =>
                                                                        removeItem(
                                                                            item.id
                                                                        )
                                                                    }
                                                                >
                                                                    ×
                                                                </button>

                                                            </td>

                                                        </tr>

                                                        <tr>

                                                            <td
                                                                colSpan="3"
                                                                style={{
                                                                    paddingTop: 0,
                                                                }}
                                                            >

                                                                {item.file && (

                                                                    <small
                                                                        style={{
                                                                            color:
                                                                                "#15803d",
                                                                            fontWeight:
                                                                                600,
                                                                        }}
                                                                    >
                                                                        Selected File:
                                                                        {" "}
                                                                        {
                                                                            item.file.name
                                                                        }
                                                                    </small>

                                                                )}

                                                            </td>

                                                        </tr>

                                                    </React.Fragment>

                                                )
                                            )}

                                        </tbody>

                                    </table>

                                </div>

                            </div>

                        </div>

                        {/* =================================================
                            FOOTER
                        ================================================= */}

                        <div className="card">

                            <div
                                className="footer"
                            >

                                <button
                                    type="button"
                                    className="btn btn-cancel"
                                    onClick={
                                        handleCancel
                                    }
                                    disabled={
                                        saving
                                    }
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    className="btn btn-save"
                                    disabled={
                                        saving
                                    }
                                >

                                    {saving
                                        ? "Saving..."
                                        : editId > 0
                                            ? "Update Content"
                                            : "Save Content"}

                                </button>

                            </div>

                        </div>

                    </form>

                </div>

            </div>
        </>
    );
};

export default WebsiteContent;