 import React, { useEffect, useMemo, useState } from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

import { updateWebsiteContent, getWebsiteContentById, getWebsiteContents, createWebsiteContent, deleteWebsiteContent, } from "../../AllServicesFiles/WebsiteContentService";
import { getDepartment } from "../../AllServicesFiles/EmployeeService";

// =========================================================
// ✅ CKEditor Image Upload Adapter (Base64 for now)
// =========================================================
class MyUploadAdapter {
    constructor(loader) {
        this.loader = loader;
    }

    upload() {
        return this.loader.file.then(
            (file) =>
                new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onload = () => resolve({ default: reader.result });
                    reader.onerror = (error) => reject(error);
                    reader.readAsDataURL(file);
                })
        );
    }

    abort() { }
}

function MyCustomUploadAdapterPlugin(editor) {
    editor.plugins.get("FileRepository").createUploadAdapter = (loader) => {
        return new MyUploadAdapter(loader);
    };
}

// =========================================================
// ✅ Custom Plugin: Image Size (Custom Width & Height)
// =========================================================
function CustomImageSizePlugin(editor) {
    editor.ui.componentFactory.add('imageCustomSize', (locale) => {
        const button = new editor.ui.ButtonView(locale);
        button.set({
            label: 'Set Size',
            tooltip: 'Set Custom Width & Height',
            withText: true,
            icon: false 
        });
        
        button.on('execute', () => {
            const selection = editor.model.document.selection;
            const imageElement = selection.getSelectedElement();
            
            if (imageElement && imageElement.name === 'image') {
                const currentWidth = imageElement.getAttribute('width') || '';
                const currentHeight = imageElement.getAttribute('height') || '';
                
                // Width pucho
                const newWidth = prompt("Enter Width (e.g., 300px, 50%):", currentWidth);
                if (newWidth === null) return; // Cancel dabaya toh ruk jao
                
                // Height pucho
                const newHeight = prompt("Enter Height (e.g., 200px, auto):", currentHeight);
                if (newHeight === null) return;
                
                editor.model.change(writer => {
                    // Width set karo
                    if (newWidth.trim() === '') {
                        writer.removeAttribute('width', imageElement);
                    } else {
                        writer.setAttribute('width', newWidth.trim(), imageElement);
                    }
                    
                    // Height set karo
                    if (newHeight.trim() === '') {
                        writer.removeAttribute('height', imageElement);
                    } else {
                        writer.setAttribute('height', newHeight.trim(), imageElement);
                    }
                });
            } else {
                alert('Please select an image first.');
            }
        });
        return button;
    });
}

// =========================================================
// ✅ CKEditor Main Configuration
// =========================================================
const editorConfiguration = {
    extraPlugins: [MyCustomUploadAdapterPlugin, CustomImageSizePlugin],
    toolbar: [
        "heading", "|",
        "bold", "italic", "underline", "strikethrough", "highlight", "|",
        "fontColor", "fontBackgroundColor", "|",
        "alignment", "|",
        "bulletedList", "numberedList", "todoList", "|",
        "outdent", "indent", "|",
        "link", "blockQuote", "insertTable", "horizontalLine", "|",
        "imageUpload", "mediaEmbed", "|",
        "removeFormat", "undo", "redo"
    ],
    heading: {
        options: [
            { model: "paragraph", title: "Paragraph", class: "ck-heading_paragraph" },
            { model: "heading1", view: "h1", title: "Heading 1", class: "ck-heading_heading1" },
            { model: "heading2", view: "h2", title: "Heading 2", class: "ck-heading_heading2" },
            { model: "heading3", view: "h3", title: "Heading 3", class: "ck-heading_heading3" },
            { model: "heading4", view: "h4", title: "Heading 4", class: "ck-heading_heading4" },
        ]
    },
    mediaEmbed: {
        previewsInData: true
    },
    image: {
        styles: [
            'alignLeft', 'alignCenter', 'alignRight',
            { name: 'small', title: 'Small (30%)', className: 'image-small' },
            { name: 'medium', title: 'Medium (50%)', className: 'image-medium' },
            { name: 'large', title: 'Large (80%)', className: 'image-large' }
        ],
        toolbar: [
            'imageStyle:alignLeft', 'imageStyle:alignCenter', 'imageStyle:alignRight',
            '|',
            'imageStyle:small', 'imageStyle:medium', 'imageStyle:large',
            '|',
            'imageCustomSize', // 👈 Custom Size Button (Width/Height)
            'imageTextAlternative'
        ]
    },
    htmlSupport: {
        allow: [
            {
                name: /.*/,
                attributes: true,
                classes: true,
                styles: true
            }
        ]
    }
};

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

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteId, setDeleteId] = useState(0);
    const [deleteLoading, setDeleteLoading] = useState(false);

    const [searchText, setSearchText] = useState("");
    const [recordsPerPage, setRecordsPerPage] = useState(100);
    const [currentPage, setCurrentPage] = useState(1);

    const [formData, setFormData] = useState({
        id: 0, productTypeId: "", srNo1: null, title: "", date: "", subTitle: "", shortDesc: "", desc: "", seoTitle: "", isActive: true, isHighlight: false, isDelete: 1,
    });

    const [contentItems, setContentItems] = useState([
        { id: Date.now(), documentId: 0, srNo: null, name: "", file: null, oldFile: "", altTag: "", isActive: true },
    ]);

    useEffect(() => {
        loadDepartment();
        loadWebsiteContent();
    }, []);

    const loadDepartment = async () => {
        try {
            const result = await getDepartment(35);
            setMenus(result?.data || []);
        } catch (error) {
            console.error("Menu Load Error:", error);
        }
    };

    const loadWebsiteContent = async () => {
        try {
            setLoading(true);
            const result = await getWebsiteContents();
            let data = [];
            if (Array.isArray(result)) data = result;
            else if (Array.isArray(result?.data)) data = result.data;
            else if (Array.isArray(result?.data?.data)) data = result.data.data;
            else if (Array.isArray(result?.data?.result)) data = result.data.result;
            else if (Array.isArray(result?.result)) data = result.result;
            setListData(data);
            setCurrentPage(1);
        } catch (error) {
            console.error("Website Content List Error:", error);
            alert(error?.response?.data?.message || "Unable to load website content.");
        } finally {
            setLoading(false);
        }
    };

    const filteredData = useMemo(() => {
        const search = searchText.trim().toLowerCase();
        if (!search) return listData;
        return listData.filter((item) => {
            const productType = item?.productType || "";
            const title = item?.title || "";
            const shortDescription = item?.shortDescription || "";
            const description = item?.descrption || "";
            return productType.toString().toLowerCase().includes(search) || title.toString().toLowerCase().includes(search) || shortDescription.toString().toLowerCase().includes(search) || description.toString().toLowerCase().includes(search);
        });
    }, [listData, searchText]);

    const totalPages = Math.max(1, Math.ceil(filteredData.length / recordsPerPage));
    const paginatedData = useMemo(() => {
        const startIndex = (currentPage - 1) * recordsPerPage;
        const endIndex = startIndex + recordsPerPage;
        return filteredData.slice(startIndex, endIndex);
    }, [filteredData, currentPage, recordsPerPage]);

    useEffect(() => { setCurrentPage(1); }, [searchText, recordsPerPage]);

    const getPageNumbers = () => {
        const pages = [];
        if (totalPages <= 5) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
            return pages;
        }
        let startPage = currentPage - 2;
        let endPage = currentPage + 2;
        if (startPage < 1) { startPage = 1; endPage = 5; }
        if (endPage > totalPages) { endPage = totalPages; startPage = totalPages - 4; }
        for (let i = startPage; i <= endPage; i++) pages.push(i);
        return pages;
    };

    const goToPage = (page) => {
        if (page < 1 || page > totalPages) return;
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleRecordsPerPage = (e) => {
        const value = Number(e.target.value);
        setRecordsPerPage(value);
        setCurrentPage(1);
    };

    const resetForm = () => {
        setEditId(0);
        setFormData({
            id: 0, productTypeId: "", srNo1: null, date: "", title: "", subTitle: "", shortDesc: "", desc: "", seoTitle: "", isActive: true, isHighlight: false, isDelete: 1,
        });
        setContentItems([{ id: Date.now(), documentId: 0, srNo: null, name: "", file: null, oldFile: "", altTag: "", isActive: true }]);
        setErrors({});
    };

    const handleAdd = () => {
        resetForm();
        setShowForm(true);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleEdit = async (id) => {
        if (!id) return alert("Website content ID not found.");
        try {
            setFormLoading(true);
            const result = await getWebsiteContentById(id);
            let data = null;
            if (result?.data?.data) data = result.data.data;
            else if (result?.data) data = result.data;
            else data = result;
            if (!data) return alert("Website content not found.");

            setEditId(Number(data.id || id));
            setFormData({
                id: Number(data.id || id || 0),
                productTypeId: data.productTypeId ?? "",
                srNo1: data.srNo1 ?? null,
                title: data.title ?? "",
                date: data.date ? data.date.split('T')[0] : "",
                subTitle: data.subTitle ?? "",
                shortDesc: data.shortDescription ?? "",
                desc: data.descrption ?? "",
                seoTitle: data.seoTitle ?? "",
                isActive: data.isActive === 1 || data.isActive === true,
                isHighlight: data.isHighlight === 1 || data.isHighlight === true,
                isDelete: data.isDelete ?? 1,
            });

            const documents = data.productCategoryDocuments || [];
            if (Array.isArray(documents) && documents.length > 0) {
                setContentItems(documents.map((item, index) => ({
                    id: Date.now() + index, documentId: item.id ?? 0, srNo: item.srNo ?? null, name: item.title ?? "", file: null, oldFile: item.path ?? "", altTag: item.altTag ?? "", isActive: item.isActive === 1 || item.isActive === true,
                })));
            } else {
                setContentItems([{ id: Date.now(), documentId: 0, srNo: null, name: "", file: null, oldFile: "", altTag: "", isActive: true }]);
            }
            setErrors({});
            setShowForm(true);
            window.scrollTo({ top: 0, behavior: "smooth" });
        } catch (error) {
            console.error("Get Website Content Error:", error);
            alert(error?.response?.data?.message || "Unable to load website content.");
        } finally {
            setFormLoading(false);
        }
    };

    const handleCancel = () => {
        resetForm();
        setShowForm(false);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const closeDeleteModal = () => {
        if (deleteLoading) return;
        setShowDeleteModal(false);
        setDeleteId(0);
    };

    const confirmDelete = async () => {
        if (!deleteId) return;
        try {
            setDeleteLoading(true);
            const result = await deleteWebsiteContent(deleteId);
            alert(result?.message || result?.data?.message || "Website content deleted successfully.");
            setShowDeleteModal(false);
            setDeleteId(0);
            await loadWebsiteContent();
        } catch (error) {
            console.error("Delete Error:", error);
            alert(error?.response?.data?.message || "Unable to delete website content.");
        } finally {
            setDeleteLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
        if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
    };

    const handleItemChange = (itemId, e) => {
        const { name, value, files, type, checked } = e.target;
        setContentItems((prev) =>
            prev.map((item) =>
                item.id === itemId ? { ...item, [name]: type === "file" ? files?.[0] || null : type === "checkbox" ? checked : value } : item
            )
        );
    };

    const addMore = () => {
        setContentItems((prev) => [...prev, { id: Date.now(), documentId: 0, srNo: null, name: "", file: null, oldFile: "", altTag: "", isActive: true }]);
    };

    const removeItem = (itemId) => {
        if (contentItems.length === 1) return;
        setContentItems((prev) => prev.filter((item) => item.id !== itemId));
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.productTypeId || Number(formData.productTypeId) === 0) newErrors.productTypeId = "Menu is required";
        if (!formData.title || !formData.title.trim()) newErrors.title = "Title is required";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;
        try {
            setSaving(true);
            let result;
            const formattedContentItems = contentItems.map(item => ({ ...item, file: item.file ? item.file : item.oldFile, path: item.oldFile, title: item.name }));

            if (Number(editId) === 0) {
                const payload = { productTypeId: Number(formData.productTypeId), srNo1: formData.srNo1, date: formData.date, title: formData.title, subTitle: formData.subTitle, shortDesc: formData.shortDesc, desc: formData.desc, seoTitle: formData.seoTitle, isActive: formData.isActive, isHighlight: formData.isHighlight, contentItems: formattedContentItems };
                result = await createWebsiteContent(payload);
            } else {
                const payload = { id: Number(editId), productTypeId: Number(formData.productTypeId), srNo1: formData.srNo1, date: formData.date, title: formData.title, subTitle: formData.subTitle, shortDesc: formData.shortDesc, desc: formData.desc, seoTitle: formData.seoTitle, isActive: formData.isActive, isHighlight: formData.isHighlight, isDelete: formData.isDelete, contentItems: formattedContentItems };
                result = await updateWebsiteContent(payload);
            }

            if (result?.success || result?.data?.success || result?.status === 200 || result?.status === 201) {
                alert(result?.message || result?.data?.message || (Number(editId) > 0 ? "Updated successfully." : "Created successfully."));
                resetForm();
                setShowForm(false);
                await loadWebsiteContent();
                window.scrollTo({ top: 0, behavior: "smooth" });
            } else {
                alert(result?.message || result?.data?.message || "Something went wrong.");
            }
        } catch (error) {
            console.error("Save Error:", error);
            alert(error?.response?.data?.message || "Something went wrong while saving.");
        } finally {
            setSaving(false);
        }
    };

    const getFileName = (path) => {
        if (!path) return "";
        const parts = path.split("/");
        return parts[parts.length - 1];
    };

    const stripHtml = (html) => {
        if (!html) return "";
        const temp = document.createElement("div");
        temp.innerHTML = html;
        return temp.textContent || temp.innerText || "";
    };

    if (loading && !showForm) {
        return (
            <>
                <style>{`
                    .loading-page { min-height: 100vh; display: flex; align-items: center; justify-content: center; background: #f5f7fb; font-family: Inter, Arial, sans-serif; }
                    .loading-box { background: #fff; padding: 30px 40px; border-radius: 14px; box-shadow: 0 5px 25px rgba(0,0,0,.08); text-align: center; color: #475569; font-weight: 600; }
                    .loading-spinner { width: 35px; height: 35px; border: 4px solid #ffe5d4; border-top-color: #ff6600; border-radius: 50%; animation: spin .8s linear infinite; margin: 0 auto 15px; }
                    @keyframes spin { to { transform: rotate(360deg); } }
                `}</style>
                <div className="loading-page"><div className="loading-box"><div className="loading-spinner" />Loading Website Content...</div></div>
            </>
        );
    }

    if (!showForm) {
        const pageNumbers = getPageNumbers();
        const startRecord = filteredData.length === 0 ? 0 : ((currentPage - 1) * recordsPerPage) + 1;
        const endRecord = Math.min(currentPage * recordsPerPage, filteredData.length);

        return (
            <>
                <style>{`
                    * { box-sizing: border-box; }
                    .website-content-page { min-height: 100vh; background: #f5f7fb; padding: 5px; font-family: Inter, Arial, sans-serif; color: #1f2937; }
                    .page-container { max-width: 1400px; margin: 0 auto; }
                    .page-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 24px; }
                    .page-title-wrapper { display: flex; align-items: center; gap: 14px; }
                    .page-icon { width: 48px; height: 48px; border-radius: 12px; background: linear-gradient(135deg, #ff6b00, #f45100); color: #fff; display: flex; align-items: center; justify-content: center; font-size: 22px; box-shadow: 0 8px 20px rgba(255, 102, 0, .18); }
                    .page-title { margin: 0; font-size: 25px; font-weight: 700; color: #111827; }
                    .page-subtitle { margin: 4px 0 0; color: #6b7280; font-size: 14px; }
                    .add-main-btn { border: 0; background: #ff6600; color: #fff; padding: 12px 20px; border-radius: 9px; font-size: 14px; font-weight: 700; cursor: pointer; display: flex; align-items: center; gap: 8px; box-shadow: 0 6px 16px rgba(255, 102, 0, .20); transition: .2s; }
                    .add-main-btn:hover { background: #e85d00; transform: translateY(-1px); }
                    .list-card { background: #fff; border: 1px solid #e5e7eb; border-radius: 16px; box-shadow: 0 4px 18px rgba(15, 23, 42, .04); overflow: hidden; }
                    .list-card-header { padding: 18px 22px; border-bottom: 1px solid #edf0f4; display: flex; align-items: center; justify-content: space-between; gap: 20px; flex-wrap: wrap; }
                    .list-title { margin: 0; font-size: 16px; font-weight: 700; color: #111827; }
                    .record-count { font-size: 12px; color: #64748b; background: #f8fafc; border: 1px solid #e2e8f0; padding: 6px 10px; border-radius: 20px; }
                    .list-toolbar { padding: 16px 22px; display: flex; align-items: center; justify-content: space-between; gap: 15px; border-bottom: 1px solid #edf0f4; background: #fff; flex-wrap: wrap; }
                    .search-box { position: relative; width: 330px; max-width: 100%; }
                    .search-icon { position: absolute; left: 13px; top: 50%; transform: translateY(-50%); color: #94a3b8; font-size: 14px; }
                    .search-input { width: 100%; height: 42px; padding: 0 38px 0 38px; border: 1px solid #d9dee7; border-radius: 9px; outline: none; font-size: 13px; color: #334155; background: #fff; }
                    .search-input:focus { border-color: #ff6600; box-shadow: 0 0 0 3px rgba(255, 102, 0, .08); }
                    .clear-search { position: absolute; right: 10px; top: 50%; transform: translateY(-50%); border: 0; background: transparent; color: #94a3b8; cursor: pointer; font-size: 18px; line-height: 1; }
                    .records-control { display: flex; align-items: center; gap: 8px; color: #64748b; font-size: 13px; font-weight: 600; }
                    .records-select { height: 40px; min-width: 82px; padding: 0 10px; border: 1px solid #d9dee7; border-radius: 8px; outline: none; background: #fff; color: #334155; font-size: 13px; cursor: pointer; }
                    .records-select:focus { border-color: #ff6600; }
                    .table-wrapper { display: block !important; width: 0 !important; min-width: 100% !important; max-width: 100% !important; overflow-x: auto !important; overflow-y: hidden !important; box-sizing: border-box !important; -webkit-overflow-scrolling: touch; scrollbar-width: thin; scrollbar-color: #c9ced8 #eef1f5; }
                    .table-wrapper::-webkit-scrollbar { height: 9px; }
                    .table-wrapper::-webkit-scrollbar-track { background: #eef1f5; border-radius: 10px; }
                    .table-wrapper::-webkit-scrollbar-thumb { background: #c9ced8; border-radius: 10px; }
                    .table-wrapper::-webkit-scrollbar-thumb:hover { background: #aeb5c2; }
                    .list-table { width: auto !important; min-width: 100% !important; max-width: none !important; table-layout: auto !important; border-collapse: separate !important; border-spacing: 0 !important; margin: 0 !important; }
                    .list-table th { background: #f8fafc; color: #64748b; font-size: 12px; text-transform: uppercase; letter-spacing: .3px; font-weight: 700; padding: 14px 16px; border-bottom: 1px solid #e5e7eb; text-align: left; white-space: nowrap; }
                    .list-table td { padding: 15px 16px; border-bottom: 1px solid #eef0f3; vertical-align: top; font-size: 13px; color: #475569; background-color: #fff; }
                    .list-table tr:last-child td { border-bottom: 0; }
                    .list-table tbody tr:hover td { background-color: #fafbff; }
                    .title-cell { color: #111827 !important; font-weight: 700; min-width: 180px; }
                    .description-cell { max-width: 380px; min-width: 250px; line-height: 1.5; }
                    .description-text { display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
                    .empty-text { color: #94a3b8; font-style: italic; }
                    .action-cell { width: 120px; white-space: nowrap; text-align: right; }
                    
                    /* ================= ✅ STICKY ACTION COLUMN ================= */
                    .list-table th.sticky-action,
                    .list-table td.sticky-action {
                        position: sticky !important;
                        right: 0 !important;
                        z-index: 5;
                        background-color: #fff;
                        box-shadow: -4px 0 10px -5px rgba(0, 0, 0, 0.1);
                    }

                    .list-table thead th.sticky-action {
                        background-color: #f8fafc !important;
                        z-index: 6;
                    }

                    .list-table tbody tr:hover td.sticky-action {
                        background-color: #fafbff !important;
                    }

                    .edit-btn { border: 1px solid #fed7aa; background: #fff7ed; color: #ea580c; min-width: 30px; height: 36px; padding: 0 12px; border-radius: 7px; cursor: pointer; font-size: 12px; font-weight: 700; transition: .2s; }
                    .edit-btn:hover { background: #ffedd5; }
                    .delete-btn { border: 1px solid #fecaca; background: #fff1f2; color: #dc2626; min-width: 40px; height: 36px; padding: 0 10px; border-radius: 7px; cursor: pointer; font-size: 14px; font-weight: 700; transition: .2s; margin-left: 6px; display: inline-flex; align-items: center; justify-content: center; }
                    .delete-btn:hover { background: #fee2e2; }
                    .empty-state { padding: 60px 20px; text-align: center; color: #64748b; }
                    .empty-icon { width: 60px; height: 60px; margin: 0 auto 15px; border-radius: 15px; background: #fff3e8; color: #ff6600; display: flex; align-items: center; justify-content: center; font-size: 25px; }
                    .pagination-area { padding: 16px 22px; border-top: 1px solid #edf0f4; display: flex; align-items: center; justify-content: space-between; gap: 15px; flex-wrap: wrap; background: #fff; }
                    .pagination-info { font-size: 12px; color: #64748b; }
                    .pagination { display: flex; align-items: center; gap: 5px; margin: 0; }
                    .page-btn { min-width: 36px; height: 36px; padding: 0 9px; border: 1px solid #dce1e8; background: #fff; color: #475569; border-radius: 7px; cursor: pointer; font-size: 12px; font-weight: 700; transition: .2s; }
                    .page-btn:hover:not(:disabled) { border-color: #ff6600; color: #ff6600; background: #fff7ed; }
                    .page-btn.active { background: #ff6600; color: #fff; border-color: #ff6600; }
                    .page-btn:disabled { opacity: .45; cursor: not-allowed; }
                    .page-dots { min-width: 25px; text-align: center; color: #94a3b8; }
                    .delete-modal-overlay { position: fixed; inset: 0; background: rgba(15, 23, 42, .55); display: flex; align-items: center; justify-content: center; z-index: 1050; padding: 20px; animation: deleteFadeIn .2s ease; }
                    .delete-modal-box { background: #fff; border-radius: 16px; width: 100%; max-width: 420px; box-shadow: 0 20px 60px rgba(15, 23, 42, .25); overflow: hidden; animation: deletePopIn .25s ease; }
                    .delete-modal-icon { width: 56px; height: 56px; margin: 24px auto 0; border-radius: 50%; background: #fee2e2; color: #dc2626; display: flex; align-items: center; justify-content: center; font-size: 26px; }
                    .delete-modal-body { padding: 16px 26px 20px; text-align: center; }
                    .delete-modal-title { margin: 0 0 8px; font-size: 18px; font-weight: 700; color: #111827; }
                    .delete-modal-text { margin: 0; font-size: 13.5px; color: #64748b; line-height: 1.55; }
                    .delete-modal-actions { display: flex; gap: 10px; padding: 16px 22px 22px; border-top: 1px solid #edf0f4; background: #fafbfc; }
                    .delete-modal-actions .btn { flex: 1; min-width: 0; height: 42px; border-radius: 8px; border: 1px solid #d9dee7; font-size: 14px; font-weight: 600; cursor: pointer; }
                    .btn-cancel { background: #fff; color: #475569; }
                    .btn-cancel:hover:not(:disabled) { background: #f1f5f9; }
                    .btn-danger { background: #dc2626; color: #fff; border-color: #dc2626; box-shadow: 0 5px 12px rgba(220, 38, 38, .20); }
                    .btn-danger:hover:not(:disabled) { background: #b91c1c; }
                    .delete-modal-actions .btn:disabled { opacity: .7; cursor: not-allowed; }
                    @keyframes deleteFadeIn { from { opacity: 0; } to { opacity: 1; } }
                    @keyframes deletePopIn { from { opacity: 0; transform: scale(.94); } to { opacity: 1; transform: scale(1); } }
                    @media (max-width: 768px) {
                        .website-content-page { padding: 15px; }
                        .page-header { align-items: flex-start; gap: 15px; flex-direction: column; }
                        .add-main-btn { width: 100%; justify-content: center; }
                        .list-toolbar { align-items: stretch; flex-direction: column; }
                        .search-box { width: 100%; }
                        .records-control { justify-content: space-between; }
                        .pagination-area { align-items: flex-start; flex-direction: column; }
                        .pagination { width: 100%; justify-content: center; flex-wrap: wrap; }
                    }
                `}</style>

                <div className="website-content-page">
                    <div className="page-container">
                        <div className="page-header">
                            <div className="page-title-wrapper">
                                <div className="page-icon">✦</div>
                                <div>
                                    <h1 className="page-title">Website Content</h1>
                                    <p className="page-subtitle">Manage your website content</p>
                                </div>
                            </div>
                            <button type="button" className="add-main-btn" onClick={handleAdd}><span>＋</span> Add Content</button>
                        </div>

                        <div className="list-card">
                            <div className="list-card-header">
                                <h2 className="list-title">Website Content List</h2>
                                <span className="record-count">{filteredData.length} Records</span>
                            </div>
                            <div className="list-toolbar">
                                <div className="search-box">
                                    <span className="search-icon">🔍</span>
                                    <input type="text" className="search-input" value={searchText} onChange={(e) => setSearchText(e.target.value)} placeholder="Search title, short description..." />
                                    {searchText && <button type="button" className="clear-search" onClick={() => setSearchText("")}>×</button>}
                                </div>
                                <div className="records-control">
                                    <span>Show</span>
                                    <select className="records-select" value={recordsPerPage} onChange={handleRecordsPerPage}>
                                        <option value={100}>100</option>
                                        <option value={250}>250</option>
                                        <option value={500}>500</option>
                                        <option value={1000}>1000</option>
                                    </select>
                                    <span>records</span>
                                </div>
                            </div>

                            <div className="table-wrapper">
                                {paginatedData.length === 0 ? (
                                    <div className="empty-state">
                                        <div className="empty-icon">✦</div>
                                        <div>{searchText ? "No matching website content found." : "No website content found."}</div>
                                    </div>
                                ) : (
                                    <table className="list-table">
                                        <thead>
                                            <tr>
                                                <th>#</th>
                                                <th>Type</th>
                                                <th>Title</th>
                                                <th>Short Description</th>
                                                <th>Description</th>
                                                {/* ✅ ADDED sticky-action CLASS */}
                                                <th className="sticky-action" style={{ textAlign: "right" }}>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {paginatedData.map((item, index) => (
                                                <tr key={item.id || index}>
                                                    <td className="title-cell">{index + 1}</td>
                                                    <td className="title-cell">{item.productType || "-"}</td>
                                                    <td className="title-cell">{item.title || "-"}</td>
                                                    <td className="description-cell">
                                                        {item.shortDescription ? <div className="description-text" title={stripHtml(item.shortDescription)}>{stripHtml(item.shortDescription)}</div> : <span className="empty-text">No short description</span>}
                                                    </td>
                                                    <td className="description-cell">
                                                        {item.descrption ? <div className="description-text" title={stripHtml(item.descrption)}>{stripHtml(item.descrption)}</div> : <span className="empty-text">No description</span>}
                                                    </td>
                                                    {/* ✅ ADDED sticky-action CLASS */}
                                                    <td className="sticky-action action-cell">
                                                        <button type="button" className="edit-btn" onClick={() => handleEdit(item.id)}><i className="bi bi-pencil-square"></i></button>
                                                        <button type="button" className="action-btn delete-btn" title="Delete Course" onClick={() => { setDeleteId(item.id); setShowDeleteModal(true); }}><i className="bi bi-trash3"></i></button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                )}
                            </div>

                            {filteredData.length > 0 && (
                                <div className="pagination-area">
                                    <div className="pagination-info">Showing <strong>{startRecord}</strong> - <strong>{endRecord}</strong> of <strong>{filteredData.length}</strong></div>
                                    <div className="pagination">
                                        <button type="button" className="page-btn" disabled={currentPage === 1} onClick={() => goToPage(currentPage - 1)}>Previous</button>
                                        {totalPages > 5 && currentPage > 3 && (<><button type="button" className="page-btn" onClick={() => goToPage(1)}>1</button><span className="page-dots">...</span></>)}
                                        {pageNumbers.map((page) => (<button type="button" key={page} className={`page-btn ${currentPage === page ? "active" : ""}`} onClick={() => goToPage(page)}>{page}</button>))}
                                        {totalPages > 5 && currentPage < totalPages - 2 && (<><span className="page-dots">...</span><button type="button" className="page-btn" onClick={() => goToPage(totalPages)}>{totalPages}</button></>)}
                                        <button type="button" className="page-btn" disabled={currentPage === totalPages} onClick={() => goToPage(currentPage + 1)}>Next</button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {showDeleteModal && (
                            <div className="delete-modal-overlay" onClick={closeDeleteModal}>
                                <div className="delete-modal-box" onClick={(e) => e.stopPropagation()}>
                                    <div className="delete-modal-icon"><i className="bi bi-trash3"></i></div>
                                    <div className="delete-modal-body">
                                        <h3 className="delete-modal-title">Delete Website Content</h3>
                                        <p className="delete-modal-text">Kya aap sach me ye website content delete karna chahte hain? Ye action undo nahi ho sakta.</p>
                                    </div>
                                    <div className="delete-modal-actions">
                                        <button type="button" className="btn btn-cancel" onClick={closeDeleteModal} disabled={deleteLoading}>Cancel</button>
                                        <button type="button" className="btn btn-danger" onClick={confirmDelete} disabled={deleteLoading}>{deleteLoading ? "Deleting..." : "Delete"}</button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </>
        );
    }

    if (formLoading) {
        return (
            <>
                <style>{`
                    .loading-page { min-height: 100vh; display: flex; align-items: center; justify-content: center; background: #f5f7fb; font-family: Inter, Arial, sans-serif; }
                    .loading-box { background: #fff; padding: 30px 40px; border-radius: 14px; box-shadow: 0 5px 25px rgba(0,0,0,.08); text-align: center; color: #475569; font-weight: 600; }
                    .loading-spinner { width: 35px; height: 35px; border: 4px solid #ffe5d4; border-top-color: #ff6600; border-radius: 50%; animation: spin .8s linear infinite; margin: 0 auto 15px; }
                    @keyframes spin { to { transform: rotate(360deg); } }
                `}</style>
                <div className="loading-page"><div className="loading-box"><div className="loading-spinner" />Loading Content...</div></div>
            </>
        );
    }

    return (
        <>
            <style>{`
                * { box-sizing: border-box; }
                .website-content-page { min-height: 100vh; background: #f5f7fb; padding: 12px; font-family: Inter, Arial, sans-serif; color: #1f2937; }
                .page-container { max-width: 1400px; margin: 0 auto; }
                .page-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 24px; }
                .page-title-wrapper { display: flex; align-items: center; gap: 14px; }
                .page-icon { width: 48px; height: 48px; border-radius: 12px; background: linear-gradient(135deg, #ff6b00, #f45100); color: #fff; display: flex; align-items: center; justify-content: center; font-size: 22px; box-shadow: 0 8px 20px rgba(255, 102, 0, .18); }
                .page-title { margin: 0; font-size: 25px; font-weight: 700; color: #111827; }
                .page-subtitle { margin: 4px 0 0; color: #6b7280; font-size: 14px; }
                .header-actions { display: flex; align-items: center; gap: 10px; }
                .mode-badge { padding: 7px 12px; border-radius: 20px; font-size: 12px; font-weight: 700; background: #fff3e8; color: #ff6600; }
                .back-list-btn { border: 1px solid #d9dee7; background: #fff; color: #475569; height: 38px; padding: 0 14px; border-radius: 8px; font-size: 12px; font-weight: 700; cursor: pointer; }
                .back-list-btn:hover { background: #f8fafc; }
                .card { background: #fff; border: 1px solid #e5e7eb; border-radius: 16px; box-shadow: 0 4px 18px rgba(15, 23, 42, .04); margin-bottom: 22px; overflow: hidden; }
                .card-header { padding: 18px 22px; border-bottom: 1px solid #edf0f4; display: flex; align-items: center; justify-content: space-between; background: #fff; }
                .card-header-left { display: flex; align-items: center; gap: 10px; }
                .section-number { width: 30px; height: 30px; border-radius: 8px; background: #fff3e8; color: #ff6600; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 13px; }
                .card-title { margin: 0; font-size: 16px; font-weight: 700; color: #111827; }
                .card-body { padding: 24px 22px; }
                .form-label { font-size: 13px; font-weight: 600; color: #374151; margin-bottom: 7px; }
                .required { color: #ef4444; margin-left: 3px; }
                .validation-text { display: block; margin-top: 5px; font-size: 12px; color: #dc2626; font-weight: 500; }
                .form-control, .form-select { width: 100%; min-height: 44px; padding: 10px 13px; border: 1px solid #d9dee7; border-radius: 9px; background: #fff; color: #1f2937; outline: none; font-size: 14px; transition: .2s; }
                .form-control:focus, .form-select:focus { border-color: #ff6600; box-shadow: 0 0 0 3px rgba(255, 102, 0, .10); }
                
                .ck.ck-editor { width: 100%; }
                .ck-editor__editable { min-height: 150px; }
                .short-desc-editor .ck-editor__editable { min-height: 100px; }
                .description-editor .ck-editor__editable { min-height: 250px; }
                .ck.ck-toolbar { border-color: #d9dee7 !important; border-radius: 9px 9px 0 0 !important; flex-wrap: wrap !important; }
                .ck.ck-editor__main > .ck-editor__editable { border-color: #d9dee7 !important; border-radius: 0 0 9px 9px !important; background: #fff; }
                .ck.ck-editor__main > .ck-editor__editable:focus { border-color: #ff6600 !important; box-shadow: 0 0 0 1px #ff6600 !important; }
                
                .ck-content img { max-width: 100%; height: auto; border-radius: 8px; }
                .ck-content .image.image-small { width: 30% !important; }
                .ck-content .image.image-medium { width: 50% !important; }
                .ck-content .image.image-large { width: 80% !important; }
                .ck-content .image-style-align-left { float: left; margin-right: 20px; margin-bottom: 10px; }
                .ck-content .image-style-align-right { float: right; margin-left: 20px; margin-bottom: 10px; }
                
                .status-area { display: flex; align-items: center; gap: 28px; padding-top: 3px; }
                .checkbox-wrapper { display: inline-flex; align-items: center; gap: 9px; cursor: pointer; user-select: none; }
                .checkbox-wrapper input { width: 18px; height: 18px; accent-color: #ff6600; cursor: pointer; }
                .checkbox-label { font-size: 14px; font-weight: 600; color: #374151; }
                .active-badge { font-size: 11px; padding: 4px 9px; border-radius: 20px; background: #dcfce7; color: #15803d; font-weight: 600; }
                .highlight-badge { font-size: 11px; padding: 4px 9px; border-radius: 20px; background: #fef3c7; color: #b45309; font-weight: 600; }
                .add-btn { border: 0; background: #ff6600; color: white; padding: 10px 16px; border-radius: 8px; font-size: 13px; font-weight: 600; cursor: pointer; display: flex; align-items: center; gap: 7px; }
                .add-btn:hover { background: #e85d00; }
                .table-wrapper { width: 100%; overflow-x: auto; }
                .content-table { width: 100%; border-collapse: collapse; min-width: 950px; }
                .content-table th { background: #f8fafc; color: #64748b; font-size: 12px; text-transform: uppercase; letter-spacing: .3px; font-weight: 700; padding: 13px 12px; border-bottom: 1px solid #e5e7eb; text-align: left; white-space: nowrap; }
                .content-table td { padding: 13px 12px; border-bottom: 1px solid #eef0f3; vertical-align: middle; }
                .sr-no { width: 45px; height: 32px; border-radius: 7px; background: #fff3e8; display: flex; align-items: center; justify-content: center; font-size: 13px; font-weight: 700; color: #ff6600; }
                .table-input-srno { width: 30%; min-width: 50px; height: 40px; border: 1px solid #dce1e8; border-radius: 7px; padding: 8px 10px; font-size: 13px; outline: none; background: #fff; }
                .table-input { width: 100%; min-width: 150px; height: 40px; border: 1px solid #dce1e8; border-radius: 7px; padding: 8px 10px; font-size: 13px; outline: none; background: #fff; }
                .table-input:focus { border-color: #ff6600; box-shadow: 0 0 0 3px rgba(255, 102, 0, .08); }
                .file-input { width: 210px; font-size: 12px; color: #64748b; }
                .file-input::file-selector-button { border: 0; background: #fff3e8; color: #ff6600; padding: 8px 11px; border-radius: 6px; font-weight: 600; cursor: pointer; margin-right: 8px; }
                .old-file-box { margin-top: 7px; display: flex; align-items: center; gap: 7px; font-size: 11px; color: #64748b; }
                .old-file-label { color: #94a3b8; font-weight: 600; }
                .old-file-name { color: #475569; font-weight: 500; max-width: 330px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
                .new-file-name { margin-top: 5px; font-size: 11px; color: #15803d; font-weight: 600; }
                .item-status { display: flex; align-items: center; gap: 8px; white-space: nowrap; }
                .item-status-checkbox { width: 18px; height: 18px; accent-color: #ff6600; cursor: pointer; }
                .item-status-label { font-size: 13px; font-weight: 600; color: #475569; cursor: pointer; }
                .item-active-badge { font-size: 10px; padding: 3px 7px; border-radius: 20px; background: #dcfce7; color: #15803d; font-weight: 700; }
                .item-inactive-badge { font-size: 10px; padding: 3px 7px; border-radius: 20px; background: #f1f5f9; color: #64748b; font-weight: 700; }
                .remove-btn { width: 36px; height: 36px; border: 1px solid #fecaca; background: #fff1f2; color: #dc2626; border-radius: 8px; cursor: pointer; font-size: 16px; }
                .footer { display: flex; align-items: center; justify-content: flex-end; gap: 12px; padding: 18px 22px; border-top: 1px solid #edf0f4; background: #fafbfc; }
                .btn { min-width: 110px; height: 42px; padding: 0 18px; border-radius: 8px; border: 1px solid #d9dee7; font-size: 14px; font-weight: 600; cursor: pointer; }
                .btn-cancel { background: white; color: #475569; }
                .btn-save { background: #ff6600; color: white; border-color: #ff6600; box-shadow: 0 5px 12px rgba(255, 102, 0, .20); }
                .btn-save:hover { background: #e85d00; }
                .btn-save:disabled, .btn-cancel:disabled { opacity: .7; cursor: not-allowed; }
                @media (max-width: 768px) {
                    .website-content-page { padding: 15px; }
                    .page-header { align-items: flex-start; gap: 15px; flex-direction: column; }
                    .header-actions { width: 100%; }
                    .mode-badge { display: none; }
                    .card-body { padding: 18px 15px; }
                    .status-area { flex-direction: column; align-items: flex-start; gap: 14px; }
                }
            `}</style>

            <div className="website-content-page">
                <div className="page-container">
                    <div className="page-header">
                        <div className="page-title-wrapper">
                            <div className="page-icon">✦</div>
                            <div>
                                <h1 className="page-title">Website Content</h1>
                                <p className="page-subtitle">{editId > 0 ? "Update website content" : "Create new website content"}</p>
                            </div>
                        </div>
                        <div className="header-actions">
                            <div className="mode-badge">{editId > 0 ? "Edit Mode" : "Create Mode"}</div>
                            <button type="button" className="back-list-btn" onClick={handleCancel}>← Back to List</button>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="card">
                            <div className="card-header">
                                <div className="card-header-left">
                                    <div className="section-number">01</div>
                                    <h2 className="card-title">Content Information</h2>
                                </div>
                            </div>
                            <div className="card-body">
                                <div className="row">
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label">Menu<span className="required">*</span></label>
                                        <select name="productTypeId" value={formData.productTypeId} onChange={handleChange} className="form-select">
                                            <option value="">Select Menu</option>
                                            {menus.map((item) => (<option key={item.id} value={item.id}>{item.name}</option>))}
                                        </select>
                                        {errors.productTypeId && <small className="validation-text">{errors.productTypeId}</small>}
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label">Title<span className="required">*</span></label>
                                        <input type="text" name="title" value={formData.title} onChange={handleChange} className="form-control" placeholder="Enter title" />
                                        {errors.title && <small className="validation-text">{errors.title}</small>}
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col-md-3 mb-3">
                                        <label className="form-label">SrNo</label>
                                        <input type="number" name="srNo1" value={formData.srNo1} onChange={handleChange} className="form-control" />
                                    </div>
                                    <div className="col-md-3 mb-3">
                                        <label className="form-label">Date</label>
                                        <input type="date" name="date" value={formData.date} onChange={handleChange} className="form-control" />
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label">Sub Title</label>
                                        <input type="text" name="subTitle" value={formData.subTitle} onChange={handleChange} className="form-control" placeholder="Enter sub title" />
                                    </div>

                                    <div className="col-md-12 mb-3 short-desc-editor">
                                        <label className="form-label">Short Description</label>
                                        <CKEditor
                                            editor={ClassicEditor}
                                            data={formData.shortDesc}
                                            config={editorConfiguration}
                                            onChange={(event, editor) => {
                                                setFormData((prev) => ({ ...prev, shortDesc: editor.getData() }));
                                            }}
                                        />
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col-md-12 mb-3 description-editor">
                                        <label className="form-label">Description</label>
                                        <CKEditor
                                            editor={ClassicEditor}
                                            data={formData.desc}
                                            config={editorConfiguration}
                                            onChange={(event, editor) => {
                                                setFormData((prev) => ({ ...prev, desc: editor.getData() }));
                                            }}
                                        />
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col-md-12">
                                        <label className="form-label">Status</label>
                                        <div className="status-area">
                                            <label className="checkbox-wrapper">
                                                <input type="checkbox" name="isActive" checked={!!formData.isActive} onChange={handleChange} />
                                                <span className="checkbox-label">Is Active</span>
                                                {formData.isActive && <span className="active-badge">Active</span>}
                                            </label>
                                            <label className="checkbox-wrapper">
                                                <input type="checkbox" name="isHighlight" checked={!!formData.isHighlight} onChange={handleChange} />
                                                <span className="checkbox-label">Is Highlight</span>
                                                {formData.isHighlight && <span className="highlight-badge">Highlight</span>}
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="card">
                            <div className="card-header">
                                <div className="card-header-left">
                                    <div className="section-number">02</div>
                                    <h2 className="card-title">Additional Content</h2>
                                </div>
                                <button type="button" className="add-btn" onClick={addMore}>＋ Add More</button>
                            </div>
                            <div className="card-body" style={{ padding: 0 }}>
                                <div className="table-wrapper">
                                    <table className="content-table">
                                        <thead>
                                            <tr>
                                                <th>#</th><th>Sr. No.</th><th>Name</th><th>File</th><th>Alt Tag</th><th>Status</th><th>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {contentItems.map((item, index) => (
                                                <React.Fragment key={item.id}>
                                                    <tr>
                                                        <td rowSpan="2"><div className="sr-no">{index + 1}</div></td>
                                                        <td><input type="text" name="srNo" value={item.srNo} onChange={(e) => handleItemChange(item.id, e)} className="table-input-srno" /></td>
                                                        <td><input type="text" name="name" value={item.name} onChange={(e) => handleItemChange(item.id, e)} className="table-input" placeholder="Enter name" /></td>
                                                        <td>
                                                            <input type="file" name="file" onChange={(e) => handleItemChange(item.id, e)} className="file-input" accept="image/*,.pdf,.doc,.docx" />
                                                            {item.oldFile && (<div className="old-file-box"><span className="old-file-label">Existing:</span><span className="old-file-name" title={getFileName(item.oldFile)}>{getFileName(item.oldFile)}</span></div>)}
                                                            {item.file && <div className="new-file-name">New: {item.file.name}</div>}
                                                        </td>
                                                        <td><input type="text" name="altTag" value={item.altTag} onChange={(e) => handleItemChange(item.id, e)} className="table-input" placeholder="Enter alt tag" /></td>
                                                        <td rowSpan="2">
                                                            <div className="item-status">
                                                                <input id={`item-active-${item.id}`} type="checkbox" name="isActive" checked={!!item.isActive} onChange={(e) => handleItemChange(item.id, e)} className="item-status-checkbox" />
                                                                <label htmlFor={`item-active-${item.id}`} className="item-status-label">Active</label>
                                                            </div>
                                                        </td>
                                                        <td rowSpan="2"><button type="button" className="remove-btn" onClick={() => removeItem(item.id)}>×</button></td>
                                                    </tr>
                                                    <tr><td colSpan="3" style={{ paddingTop: 0 }}></td></tr>
                                                </React.Fragment>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>

                        <div className="card">
                            <div className="footer">
                                <button type="button" className="btn btn-cancel" onClick={handleCancel} disabled={saving}>Cancel</button>
                                <button type="submit" className="btn btn-save" disabled={saving}>
                                    {saving ? "Saving..." : editId > 0 ? "Update Content" : "Save Content"}
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