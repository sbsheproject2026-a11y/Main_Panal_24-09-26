 import React, { useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import { printDiplomaApi } from "../../AllServicesFiles/AdminStudentService";

const NOCPrint = () => {
    console.log("🔵 NOCPrint component LOADED");
    const { id } = useParams();
    const navigate = useNavigate();
    const printedId = useRef(null);

    // ✅ Custom size — Landscape
    const PAGE_WIDTH = 283;
    const PAGE_HEIGHT = 200;

    // ✅ Print margin (mm)
    const PRINT_MARGIN = 3;

    const CONTENT_WIDTH = PAGE_WIDTH - PRINT_MARGIN * 2;
    const CONTENT_HEIGHT = PAGE_HEIGHT - PRINT_MARGIN * 2;

    const FONT_SIZE = 18;
    const TEXT_SCALE = 4;
    const FONT_COLOR = "#000000";

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
        if (!id || printedId.current === id) return;
        printedId.current = id;
        printDiploma(id);
    }, [id]);

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

    const isHindiText = (text) => /[\u0900-\u097F]/.test(text);

    const drawImage = async (pdf, field, imageName) => {
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

    const createHindiTextImage = (field) => {
        const text = String(field?.text || "").trim();
        if (!text) return null;
        const scale = TEXT_SCALE;
        const fontSize = (field.fontSize || FONT_SIZE) * scale;
        const maxWidthMm = field.maxWidth || 100;
        const maxWidthPx = maxWidthMm * 3.779527559 * scale;
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d", { alpha: true });
        if (!ctx) return null;
        const fontFamily = field.fontFamily || '"Arial Unicode MS", "Noto Sans Devanagari", "Mangal", sans-serif';
        const fontStyle = field.fontStyle || "normal";
        ctx.font = `${fontStyle} ${fontSize}px ${fontFamily}`;
        let measuredWidth = ctx.measureText(text).width;
        let finalFontSize = fontSize;
        if (measuredWidth > maxWidthPx) {
            finalFontSize = Math.max(8 * scale, fontSize * (maxWidthPx / measuredWidth));
            ctx.font = `${fontStyle} ${finalFontSize}px ${fontFamily}`;
            measuredWidth = ctx.measureText(text).width;
        }
        const horizontalPadding = 8 * scale;
        const verticalPadding = 20 * scale;
        canvas.width = Math.ceil(measuredWidth + horizontalPadding);
        canvas.height = Math.ceil(finalFontSize + verticalPadding);
        const drawContext = canvas.getContext("2d", { alpha: true });
        if (!drawContext) return null;
        drawContext.clearRect(0, 0, canvas.width, canvas.height);
        drawContext.font = `${fontStyle} ${finalFontSize}px ${fontFamily}`;
        drawContext.fillStyle = FONT_COLOR;
        drawContext.textBaseline = "alphabetic";
        drawContext.textAlign = field.align || "center";
        let drawX = canvas.width / 2;
        if (field.align === "left") drawX = horizontalPadding / 2;
        if (field.align === "right") drawX = canvas.width - horizontalPadding / 2;
        const drawY = canvas.height / 2 + finalFontSize / 3;
        drawContext.fillText(text, drawX, drawY);
        return { image: canvas.toDataURL("image/png"), width: canvas.width, height: canvas.height };
    };

    const drawHindiText = (pdf, field) => {
        const textImage = createHindiTextImage(field);
        if (!textImage) return;
        const x = PRINT_MARGIN + (field.x / 100) * CONTENT_WIDTH;
        const y = PRINT_MARGIN + (field.y / 100) * CONTENT_HEIGHT;
        const pixelToMm = 25.4 / (96 * TEXT_SCALE);
        let imageWidth = textImage.width * pixelToMm;
        let imageHeight = textImage.height * pixelToMm;
        const maxWidth = Math.min(field.maxWidth || CONTENT_WIDTH, CONTENT_WIDTH);
        if (imageWidth > maxWidth) {
            const ratio = maxWidth / imageWidth;
            imageWidth = maxWidth;
            imageHeight *= ratio;
        }
        let drawX = x;
        if (field.align === "center") drawX = x - imageWidth / 2;
        else if (field.align === "right") drawX = x - imageWidth;
        pdf.addImage(textImage.image, "PNG", drawX, y - imageHeight / 2, imageWidth, imageHeight, undefined, "FAST");
    };

    // ==========================================
    // ✅ DRAW ENGLISH TEXT (With Line Height & Wrap)
    // ==========================================
    const drawEnglishText = (pdf, field) => {
        if (!field?.text) return;

        const text = String(field.text).trim();
        if (!text) return;

        const x = PRINT_MARGIN + (field.x / 100) * CONTENT_WIDTH;
        const y = PRINT_MARGIN + (field.y / 100) * CONTENT_HEIGHT;

        const fontSize = field.fontSize || FONT_SIZE;
        const fontStyle = field.fontStyle || "normal";

        pdf.setFont("helvetica", fontStyle === "bold" ? "bold" : "normal");
        pdf.setFontSize(fontSize);
        pdf.setTextColor(0, 0, 0);

        // ✅ Line Height Set Karein
        if (field.lineHeight) {
            pdf.setLineHeightFactor(field.lineHeight);
        } else {
            pdf.setLineHeightFactor(1.15); // Default
        }

        // ✅ BORDER LOGIC (RED COLOR BOX)
        if (field.border) {
            pdf.setDrawColor(255, 0, 0); 
            pdf.setLineWidth(0.5); 

            if (field.border.type === 'box') {
                const textWidth = pdf.getTextWidth(text);
                const textHeightMm = (fontSize * 0.352778); 
                const paddingX = 4;
                const paddingY = 3;
                pdf.rect(x - paddingX, y - textHeightMm - paddingY + 1, textWidth + (paddingX * 2), textHeightMm + (paddingY * 2));
            } else if (field.border.type === 'line') {
                const borderWidth = field.border.width || pdf.getTextWidth(text);
                const borderY = y + (field.border.offsetY || 0);
                pdf.line(x, borderY, x + borderWidth, borderY);
            }
        }

        // ✅ TEXT PRINT LOGIC
        if (field.wordWrap) {
            const maxWidth = field.maxWidth || CONTENT_WIDTH;
            const splitText = pdf.splitTextToSize(text, maxWidth);
            pdf.text(splitText, x, y, { align: field.align || "left" });
        } else {
            // Agar wordWrap false hai, toh manual \n (newline) respect hoga
            pdf.text(text, x, y, { align: field.align || "left" });
        }
    };

    const drawText = (pdf, field) => {
        if (!field?.text) return;
        const text = String(field.text).trim();
        if (!text) return;

        if (isHindiText(text)) {
            drawHindiText(pdf, field);
        } else {
            drawEnglishText(pdf, field);
        }
    };

    const printDiploma = async (studentId) => {
        try {
            const result = await printDiplomaApi(studentId);

            if (!result) {
                alert("Diploma data nahi mila.");
                goBackToPreviousPage();
                return;
            }

            // ==========================================
            // FIELDS (Yahan aap changes kar sakte hain)
            // ==========================================
            const FIELDS = {
                srnoDiploma: {
                    text: "Serial No. : " + (result.srnoDiploma || ""),
                    x: 11,
                    y: 8,
                    align: "left",
                    maxWidth: 40,
                    fontSize: 12,
                    fontFamily: "Arial"
                },
                enrollmentNo: {
                    text: "Enrolment No : " + (result.enrollmentNo || ""),
                    x: 9,
                    y: 42,
                    align: "left",
                    maxWidth: 40,
                    fontSize: 13,
                    fontStyle: "bold",
                    fontFamily: "Arial"
                },
                courseName: {
                    text: "Course : " + (result.courseName || ""),
                    x: 9,
                    y: 47,
                    align: "left",
                    maxWidth: 75,
                    fontSize: 14,
                    fontStyle: "bold",
                    fontFamily: "Arial"
                },
                subjectName: {
                    text: "Subject: NO OBJECTION CERTIFICATE FOR INTERNSHIP PROGRAMME",
                    x: 9,
                    y: 52,
                    align: "left",
                    maxWidth: 75,
                    fontSize: 14,
                    fontStyle: "bold",
                    fontFamily: "Arial"
                },
                name: {
                    // ✅ Yahan aap \n laga kar words ko apne hisaab se line me tod sakte hain
                    text: "This is to certify that " +  (result.name || "") + ", is a bona fide student of this institution, batch of Year " + (result.issueYear || "") + "\n" +
                          "This institution has no objection to the above-named student undertaking the Internship Programme in the \n" +
                          "Department of Paramedical." , 
                    x: 9,
                    y: 60,
                    align: "left",
                    maxWidth: 250, // Width badha di taaki text line se bahar na jaye
                    fontSize: 12,
                    fontStyle: "bold",
                    fontFamily: "Arial",
                    wordWrap: true, // Agar true hai, toh aapke \n ke sath sath auto-wrap bhi hoga
                    lineHeight: 1.6 // 👈 Line Height (Aap isko 1.2, 1.5 ya 2.0 kar sakte hain)
                },
                nextlinesname: {
                    // ✅ Yahan aap \n laga kar words ko apne hisaab se line me tod sakte hain
                    text: "It is further certified that the student is not registered for any course requiring class attendance.\n" +
                          "The conduct of the student, as recorded by this institution, has been found Good /Satisfactory.",
                    x: 9,
                    y: 72,
                    align: "left",
                    maxWidth: 250, // Width badha di taaki text line se bahar na jaye
                    fontSize: 12,
                    fontStyle: "bold",
                    fontFamily: "Arial",
                    wordWrap: true, // Agar true hai, toh aapke \n ke sath sath auto-wrap bhi hoga
                    lineHeight: 2 // 👈 Line Height (Aap isko 1.2, 1.5 ya 2.0 kar sakte hain)
                },
                issueDate: {
                    text: "Date : " + (result.issueDate || ""),
                    x: 79,
                    y: 94,
                    align: "left",
                    maxWidth: 40,
                    fontSize: 13,
                    fontFamily: "Arial"
                },
            };

            // ==========================================
            // BACKGROUND IMAGE
            // ==========================================
            const backgroundImage = await loadImage("/assets/Documents/Final_NOC.png");

            // ==========================================
            // PDF — ✅ Custom Landscape
            // ==========================================
            const pdf = new jsPDF({
                orientation: "landscape",
                unit: "mm",
                format: [PAGE_WIDTH, PAGE_HEIGHT],
                compress: true
            });

            pdf.addImage(backgroundImage, "JPEG", PRINT_MARGIN, PRINT_MARGIN, CONTENT_WIDTH, CONTENT_HEIGHT, undefined, "FAST");

            // ==========================================
            // STUDENT IMAGE & QR (Agar use karna ho toh uncomment karein)
            // ==========================================
            // await drawImage(pdf, FIELDS.selfImage, "Student Image");
            // await drawImage(pdf, FIELDS.qrImage, "QR Image");

            // ==========================================
            // TEXT FIELDS (Sirf valid fields map kiye hain)
            // ==========================================
            [
                FIELDS.srnoDiploma,
                FIELDS.enrollmentNo,
                FIELDS.courseName,
                FIELDS.subjectName,
                FIELDS.name,
                FIELDS.nextlinesname,
                FIELDS.issueDate
            ].forEach((field) => {
                drawText(pdf, field);
            });

            // ==========================================
            // PDF BLOB
            // ==========================================
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
            console.error("Diploma PDF Error:", error);
            alert(error?.message || "Diploma PDF banane mein error aa gaya.");
            goBackToPreviousPage();
        }
    };

    return null;
};

export default NOCPrint;