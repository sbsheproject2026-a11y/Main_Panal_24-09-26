 import React, { useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import { printDiplomaApi } from "../../AllServicesFiles/AdminStudentService";

const MigrationCertificate = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const printedId = useRef(null);

    // ✅ A4 size
    const PAGE_WIDTH = 210;
    const PAGE_HEIGHT = 297;

    // ✅ Print margin (mm)
    const PRINT_MARGIN = 5;

    // ✅ Effective drawing area
    const CONTENT_WIDTH = PAGE_WIDTH - PRINT_MARGIN * 2;   // 200
    const CONTENT_HEIGHT = PAGE_HEIGHT - PRINT_MARGIN * 2; // 287

    // =========================================================
    // COMMON DEFAULT FONT SETTINGS (Fallback)
    // =========================================================
    const DEFAULT_FONT_SIZE = 15;
    const DEFAULT_FONT_FAMILY = "Arial";
    const DEFAULT_FONT_WEIGHT = "normal"; // "normal" ya "bold"
    const DEFAULT_FONT_STYLE = "normal";  // "normal" ya "italic"
    const FONT_COLOR = "#000000";
    const MIN_FONT_SIZE = 8;

    // =========================================================
    // ✅ GO BACK TO PREVIOUS PAGE
    // =========================================================
    const goBackToPreviousPage = () => {
        if (window.history.length > 1) {
            navigate(-1);
        } else {
            const roleId = String(localStorage.getItem("RoleId") || "").trim();

            if (roleId === "5") {
                navigate("/confirm-addmissions", { replace: true });
            } else if (roleId === "33") {
                navigate("/student-print-list", { replace: true });
            } else {
                navigate("/", { replace: true });
            }
        }
    };

    useEffect(() => {
        if (!id) return;
        if (printedId.current === id) return;

        printedId.current = id;
        printDiploma(id);
    }, [id]);

    // =========================================================
    // LOAD IMAGE
    // =========================================================
    const loadImage = (src) => {
        return new Promise((resolve, reject) => {
            if (!src) {
                reject(new Error("Image URL/Base64 empty hai."));
                return;
            }

            const image = new Image();
            image.crossOrigin = "anonymous";
            image.onload = () => resolve(image);
            image.onerror = () => reject(new Error(`Image load nahi hui: ${src.substring(0, 100)}`));
            image.src = src;
        });
    };

    const getImageFormat = (src) => {
        if (!src) return "PNG";
        const value = src.toLowerCase();
        if (value.startsWith("data:image/jpeg") || value.startsWith("data:image/jpg") || value.includes(".jpg") || value.includes(".jpeg")) {
            return "JPEG";
        }
        return "PNG";
    };

    // =========================================================
    // DRAW IMAGE
    // =========================================================
    const drawImage = async (pdf, field, imageName = "Image") => {
        if (!field?.image) return;

        try {
            const image = await loadImage(field.image);
            const x = PRINT_MARGIN + (field.x / 100) * CONTENT_WIDTH;
            const y = PRINT_MARGIN + (field.y / 100) * CONTENT_HEIGHT;
            const width = field.width || 25;
            const height = field.height || 25;

            pdf.addImage(image, getImageFormat(field.image), x - width / 2, y - height / 2, width, height, undefined, "FAST");
        } catch (error) {
            console.error(`${imageName} PDF mein add nahi hui:`, error);
        }
    };

    // =========================================================
    // CREATE TEXT IMAGE (For auto-shrinking single lines)
    // =========================================================
    const createTextImage = (field) => {
        const text = String(field?.text || "").trim();
        if (!text) return null;

        const scale = 4;
        const maxWidthPx = (field.maxWidth || 100) * 3.78 * scale;

        // ✅ Field ki properties use karein, warna default uthayein
        const fieldFontSize = field.fontSize || DEFAULT_FONT_SIZE;
        const fieldFontFamily = field.fontFamily || DEFAULT_FONT_FAMILY;
        const fieldFontWeight = field.fontWeight || DEFAULT_FONT_WEIGHT;
        const fieldFontStyle = field.fontStyle || DEFAULT_FONT_STYLE;

        let currentFontSize = fieldFontSize * scale;

        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        let textWidth;
        const canvasFontString = `${fieldFontStyle} ${fieldFontWeight} ${currentFontSize}px "${fieldFontFamily}"`;

        while (true) {
            ctx.font = `${fieldFontStyle} ${fieldFontWeight} ${currentFontSize}px "${fieldFontFamily}"`;
            textWidth = ctx.measureText(text).width;

            if (textWidth <= maxWidthPx) break;

            currentFontSize -= 0.5 * scale;

            if (currentFontSize <= MIN_FONT_SIZE * scale) {
                currentFontSize = MIN_FONT_SIZE * scale;
                break;
            }
        }

        const padding = 10 * scale;
        const finalWidth = Math.min(textWidth + padding, maxWidthPx);
        const finalHeight = currentFontSize * 1.8;

        canvas.width = Math.max(finalWidth, 20 * scale);
        canvas.height = finalHeight;

        ctx.font = `${fieldFontStyle} ${fieldFontWeight} ${currentFontSize}px "${fieldFontFamily}"`;
        ctx.fillStyle = FONT_COLOR;
        ctx.textBaseline = "middle";
        ctx.textAlign = field.align || "left";

        let drawX;
        if (field.align === "center") drawX = canvas.width / 2;
        else if (field.align === "right") drawX = canvas.width - padding / 2;
        else drawX = padding / 2;

        ctx.fillText(text, drawX, canvas.height / 2);

        return {
            image: canvas.toDataURL("image/png"),
            width: canvas.width / scale,
            height: canvas.height / scale,
            fontSize: currentFontSize / scale,
        };
    };

    // =========================================================
    // DRAW TEXT (with margin & wordWrap support)
    // =========================================================
    const drawText = (pdf, field) => {
        if (!field?.text) return;

        // ✅ Dynamic properties
        const fieldFontSize = field.fontSize || DEFAULT_FONT_SIZE;
        const fieldFontFamily = field.fontFamily || "helvetica"; // jsPDF built-in
        const fieldFontWeight = field.fontWeight || DEFAULT_FONT_WEIGHT;
        const fieldFontStyle = field.fontStyle || DEFAULT_FONT_STYLE;

        if (field.wordWrap) {
            const x = PRINT_MARGIN + (field.x / 100) * CONTENT_WIDTH;
            const y = PRINT_MARGIN + (field.y / 100) * CONTENT_HEIGHT;

            // jsPDF me bold aur italic set karna
            let pdfFontStyle = "normal";
            if (fieldFontWeight === "bold" && fieldFontStyle === "italic") pdfFontStyle = "bolditalic";
            else if (fieldFontWeight === "bold") pdfFontStyle = "bold";
            else if (fieldFontStyle === "italic") pdfFontStyle = "italic";

            // jsPDF fallback font (agar custom font use nahi kiya hai)
            let safeFontFamily = "helvetica";
            if (fieldFontFamily.toLowerCase().includes("times")) safeFontFamily = "times";
            if (fieldFontFamily.toLowerCase().includes("courier")) safeFontFamily = "courier";

            pdf.setFont(safeFontFamily, pdfFontStyle);
            pdf.setFontSize(fieldFontSize);
            pdf.setTextColor(0, 0, 0);

            const maxWidth = field.maxWidth || 150;
            const splitText = pdf.splitTextToSize(field.text, maxWidth);

            pdf.text(splitText, x, y, { align: field.align || "left" });
            return;
        }

        // Standard canvas image logic
        const textData = createTextImage(field);
        if (!textData) return;

        const x = PRINT_MARGIN + (field.x / 100) * CONTENT_WIDTH;
        const y = PRINT_MARGIN + (field.y / 100) * CONTENT_HEIGHT;

        const imageWidth = textData.width / 3.78;
        const imageHeight = textData.height / 3.78;

        let drawX = x;
        if (field.align === "center") drawX = x - imageWidth / 2;
        else if (field.align === "right") drawX = x - imageWidth;

        pdf.addImage(textData.image, "PNG", drawX, y - imageHeight / 2, imageWidth, imageHeight, undefined, "FAST");
    };

    // =========================================================
    // PRINT MIGRATION CERTIFICATE
    // =========================================================
    const printDiploma = async (studentId) => {
        try {
            const result = await printDiplomaApi(studentId);

            if (!result) {
                alert("Migration Certificate data nahi mila.");
                goBackToPreviousPage();
                return;
            }

            // =====================================================
            // FIELDS (Yahan aap fontSize, fontFamily sab set kar sakte hain)
            // =====================================================
            const FIELDS = {
                firstName: {
                    text: result.firstName || "",
                    x: 40,
                    y: 42.5,
                    align: "left",
                    maxWidth: 75,
                    fontSize: 15,
                    fontFamily: "Arial",
                    fontWeight: "bold",
                    fontStyle: "normal",
                },

                fatherName: {
                    text: result.fatherName || "",
                    x: 26,
                    y: 46.4,
                    align: "left",
                    maxWidth: 75,
                    fontSize: 15,
                    fontFamily: "Arial",
                    fontWeight: "bold",
                    fontStyle: "normal",
                },

                courseName: {
                    text: result.courseName || "",
                    x: 19,
                    y: 50.5,
                    align: "left",
                    maxWidth: 75,
                    fontSize: 15,
                    fontFamily: "Arial",
                    fontWeight: "bold",
                    fontStyle: "normal",
                },

                departmentName: {
                    text: result.departmentName || "",
                    x: 28,
                    y: 54.5,
                    align: "left",
                    maxWidth: 75,
                    fontSize: 15,
                    fontFamily: "Arial",
                    fontWeight: "bold",
                    fontStyle: "normal",
                },

                selfImage: {
                    image: result.selfImage || "",
                    x: 86,
                    y: 39,
                    width: 35,
                    height: 40,
                },

                enrollmentNo: {
                    text: result.enrollmentNo || "",
                    x: 72,
                    y: 58.6,
                    align: "left",
                    maxWidth: 100,
                    fontSize: 15,
                    fontFamily: "Arial",
                    fontWeight: "bold",
                    fontStyle: "normal",
                },

                endDate: {
                    text: result.endDate || "",
                    x: 30,
                    y: 58.6,
                    align: "left",
                    maxWidth: 40,
                    fontSize: 15,
                    fontFamily: "Arial",
                    fontWeight: "bold",
                    fontStyle: "normal",
                },

                centreName: {
                    text: result.centreName || "",
                    x: 23,
                    y: 62.6,
                    align: "left",
                    maxWidth: 150,
                    wordWrap: true, 
                    fontSize: 12,   
                    fontFamily: "Arial",
                    fontWeight: "bold",
                    fontStyle: "normal",
                },

                migrationSrno: {
                    text: result.migrationSrno || "",
                    x: 12,
                    y: 4.2,
                    align: "left",
                    maxWidth: 40,
                    fontSize: 15,
                    fontFamily: "Arial",
                    fontWeight: "bold",
                    fontStyle: "normal",
                },

                issueDate: {
                    text: result.issueDate || "",
                    x: 18,
                    y: 84.5,
                    align: "left",
                    maxWidth: 40,
                    fontSize: 15,
                    fontFamily: "Arial",
                    fontWeight: "bold",
                    fontStyle: "normal",
                },
            };

            // =====================================================
            // BACKGROUND
            // =====================================================
            const backgroundImage = await loadImage("/assets/Documents/Mig.jpeg");

            const pdf = new jsPDF({
                orientation: "portrait",
                unit: "mm",
                format: [PAGE_WIDTH, PAGE_HEIGHT],
                compress: true,
            });

            pdf.addImage(backgroundImage, "JPEG", PRINT_MARGIN, PRINT_MARGIN, CONTENT_WIDTH, CONTENT_HEIGHT, undefined, "FAST");

            // =====================================================
            // STUDENT IMAGE
            // =====================================================
            await drawImage(pdf, FIELDS.selfImage, "Student Image");

            // =====================================================
            // TEXT FIELDS
            // =====================================================
            const textFields = [
                FIELDS.firstName,
                FIELDS.fatherName,
                FIELDS.courseName,
                FIELDS.departmentName,
                FIELDS.enrollmentNo,
                FIELDS.endDate,
                FIELDS.centreName,
                FIELDS.migrationSrno,
                FIELDS.issueDate,
            ];

            textFields.forEach((field) => {
                drawText(pdf, field);
            });

            // =====================================================
            // OPEN PDF
            // =====================================================
            const pdfBlob = pdf.output("blob");
            const pdfUrl = URL.createObjectURL(pdfBlob);

            const newTab = window.open(pdfUrl, "_blank");

            if (!newTab) {
                URL.revokeObjectURL(pdfUrl);
                alert("Popup blocked hai. Browser mein popup allow karo.");
                goBackToPreviousPage();
                return;
            }

            const checkPdfClosed = setInterval(() => {
                if (newTab.closed) {
                    clearInterval(checkPdfClosed);
                    URL.revokeObjectURL(pdfUrl);
                    goBackToPreviousPage();
                }
            }, 500);

            setTimeout(() => {
                clearInterval(checkPdfClosed);
                URL.revokeObjectURL(pdfUrl);
            }, 60 * 60 * 1000);
        } catch (error) {
            console.error("Migration Certificate PDF Error:", error);
            alert(error?.message || "Migration Certificate PDF banane mein error aa gaya.");
            goBackToPreviousPage();
        }
    };

    return null;
};

export default MigrationCertificate;