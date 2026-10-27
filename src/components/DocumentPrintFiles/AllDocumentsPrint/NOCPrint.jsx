 import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import { printNOCApi } from "../../AllServicesFiles/AdminStudentService";
 

const NOCPrint = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const printedId = useRef(null);

    // ✅ Live Preview States
    const [pdfUrl, setPdfUrl] = useState(null);
    const [loading, setLoading] = useState(true);

    // ✅ Custom size — Landscape
    const PAGE_WIDTH = 283;
    const PAGE_HEIGHT = 200;
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

        return () => {
            if (pdfUrl) URL.revokeObjectURL(pdfUrl);
        };
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
    // ✅ DRAW ENGLISH TEXT (With Mixed Font Support)
    // ==========================================
    const drawEnglishText = (pdf, field) => {
        if (!field?.text) return;

        const x = PRINT_MARGIN + (field.x / 100) * CONTENT_WIDTH;
        const y = PRINT_MARGIN + (field.y / 100) * CONTENT_HEIGHT;
        const fontSize = field.fontSize || FONT_SIZE;

        pdf.setFontSize(fontSize);
        pdf.setTextColor(0, 0, 0);

        // 🆕 अगर valueText मौजूद है, तो Bold लेबल और Normal वैल्यू प्रिंट करें
        if (field.valueText !== undefined) {
            // 1. लेबल को Bold प्रिंट करें
            pdf.setFont("helvetica", "bold");
            pdf.text(field.text, x, y, { align: field.align || "left" });
            
            // 2. लेबल की चौड़ाई (Width) नापें
            const labelWidth = pdf.getTextWidth(field.text);
            
            // 3. लेबल के ठीक बाद वैल्यू को Normal प्रिंट करें
            pdf.setFont("helvetica", "normal");
            pdf.text(String(field.valueText), x + labelWidth, y, { align: field.align || "left" });
            return; 
        }

        // === बाकी का नॉर्मल कोड ===
        let text = String(field.text).trim();
        if (!text) return;

        if (field.maxWords && field.maxWords > 0) {
            const allWords = text.split(/\s+/);
            if (allWords.length > field.maxWords) {
                text = allWords.slice(0, field.maxWords).join(" ");
            }
        }

        const fontStyle = field.fontStyle || "normal";

        pdf.setFont("helvetica", fontStyle === "bold" ? "bold" : "normal");

        if (field.lineHeight) {
            pdf.setLineHeightFactor(field.lineHeight);
        } else {
            pdf.setLineHeightFactor(1.15);
        }

        if (field.wordWrap) {
            const maxWidth = field.maxWidth || CONTENT_WIDTH;
            const splitText = pdf.splitTextToSize(text, maxWidth);
            pdf.text(splitText, x, y, { align: field.align || "left" });
        } else {
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
        setLoading(true);
        try {
            const result = await printNOCApi(studentId);

            if (!result) {
                alert("Diploma data nahi mila.");
                goBackToPreviousPage();
                return;
            }

            const FIELDS = {
                nocSRNO: {
                    text: "Serial No. : " + (result.nocSRNO || ""),
                    x: 11,
                    y: 8,
                    align: "left",
                    maxWidth: 40,
                    fontSize: 12,
                    fontFamily: "Arial"
                },
                enrollmentNo: {
                    // 🆕 यहाँ text सिर्फ Bold वाला हिस्सा है
                    text: "Enrolment No : ", 
                    // 🆕 और valueText सिर्फ Normal वाला हिस्सा है
                    valueText: (result.enrollmentNo || ""), 
                    x: 9,
                    y: 42,
                    align: "left",
                    maxWidth: 100,
                    fontSize: 13,
                    fontFamily: "Arial"
                },
                courseName: {
                   
                    text: "Course : ", 
                    // 🆕 और valueText सिर्फ Normal वाला हिस्सा है
                    valueText: (result.courseName || ""), 
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
                    text: "This is to certify that " +  (result.name || "") + ", is a bona fide student of this institution, batch of Year " + (result.issueYear || "") + ". This institution has no objection to the above-named student undertaking the Internship Programme in the " + (result.departmentName || "") +" .",
                    x: 9,
                    y: 60,
                    align: "left",
                    maxWidth: 240, 
                    fontSize: 14,
                    fontStyle: "bold",
                    fontFamily: "Arial",
                    wordWrap: true, 
                    lineHeight: 1.8,
                    maxWords: 350 
                },
                nextlinesname: {
                    text: "It is further certified that the student is not registered for any course requiring class attendance.\nThe conduct of the student, as recorded by this institution, has been found Good /Satisfactory.",
                    x: 9,
                    y: 78,
                    align: "left",
                    maxWidth: 250, 
                    fontSize: 14,
                    fontStyle: "bold",
                    fontFamily: "Arial",
                    wordWrap: true,
                    lineHeight: 2,
                    maxWords: 350 
                },
                issueDate: {
                    text: "Date : " + (result.issueDate || ""),
                    x: 79,
                    y: 94, 
                    align: "left",
                    maxWidth: 40,
                    fontSize: 14,
                    fontFamily: "Arial"
                },
                sealstemp: {
                    text: "(Signature with Seal) " ,
                    x: 10,
                    y: 94, 
                    align: "left",
                    maxWidth: 40,
                    fontSize: 14,
                    fontFamily: "Arial"
                },
            };

            const backgroundImage = await loadImage("/assets/Documents/Final_NOC.png");

            const pdf = new jsPDF({
                orientation: "landscape",
                unit: "mm",
                format: [PAGE_WIDTH, PAGE_HEIGHT],
                compress: true
            });

            pdf.addImage(backgroundImage, "JPEG", PRINT_MARGIN, PRINT_MARGIN, CONTENT_WIDTH, CONTENT_HEIGHT, undefined, "FAST");

            [
                FIELDS.nocSRNO,
                FIELDS.enrollmentNo,
                FIELDS.courseName,
                FIELDS.subjectName,
                FIELDS.name,
                FIELDS.nextlinesname,
                FIELDS.sealstemp,
                FIELDS.issueDate
            ].forEach((field) => {
                drawText(pdf, field);
            });

            const pdfBlob = pdf.output("blob");
            const pdfObjectUrl = URL.createObjectURL(pdfBlob);
            
            if (pdfUrl) URL.revokeObjectURL(pdfUrl);
            
            setPdfUrl(pdfObjectUrl);
            setLoading(false);

        } catch (error) {
            console.error("Diploma PDF Error:", error);
            alert(error?.message || "Diploma PDF banane mein error aa gaya.");
            setLoading(false);
            goBackToPreviousPage();
        }
    };

    // ✅ UI - सिर्फ PDF दिखेगी (बिना किसी हेडर के)
    return (
        <div style={{ width: "100%", height: "100vh", position: "relative", background: "#333" }}>
            {loading && (
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, display: "flex", justifyContent: "center", alignItems: "center", background: "rgba(255,255,255,0.9)", zIndex: 5 }}>
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <span style={{ marginLeft: "15px", fontWeight: "bold", color: "#333" }}>Generating PDF...</span>
                </div>
            )}
            
            {pdfUrl && (
                <iframe 
                    src={`${pdfUrl}#toolbar=1&navpanes=0`} 
                    title="NOC PDF" 
                    width="100%" 
                    height="100%" 
                    style={{ border: "none" }}
                />
            )}
        </div>
    );
};

export default NOCPrint;