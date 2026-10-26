import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import { printNOCApi } from "../../AllServicesFiles/AdminStudentService";

const TrainingCertificate = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    // ✅ Live Preview States
    const [pdfUrl, setPdfUrl] = useState(null);
    const [loading, setLoading] = useState(true);

    // ✅ Custom size — 200 x 283 (A4 ratio maintain)
    const PAGE_WIDTH = 210;
    const PAGE_HEIGHT = 283;

    // ✅ Print margin (mm)
    const PRINT_MARGIN = -5;

    // ✅ Effective drawing area
    const CONTENT_WIDTH = PAGE_WIDTH - PRINT_MARGIN * 2;
    const CONTENT_HEIGHT = PAGE_HEIGHT - PRINT_MARGIN * 2;

    const FONT_SIZE = 18;
    const TEXT_SCALE = 4;
    const FONT_COLOR = "#000000";

    // ==========================================
    // ✅ GO BACK TO PREVIOUS PAGE
    // ==========================================
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
        // Hot-Reload Fix
        if (id && window.lastGeneratedREGId !== id) {
            window.lastGeneratedREGId = id;
            printDiploma(id);
        }

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
        if (
            value.startsWith("data:image/jpeg") ||
            value.startsWith("data:image/jpg") ||
            value.includes(".jpg") ||
            value.includes(".jpeg")
        ) {
            return "JPEG";
        }
        return "PNG";
    };

    const isHindiText = (text) => {
        return /[\u0900-\u097F]/.test(text);
    };

    const drawImage = async (pdf, field, imageName) => {
        if (!field?.image) return;
        try {
            const image = await loadImage(field.image);
            const x = PRINT_MARGIN + (field.x / 100) * CONTENT_WIDTH;
            const y = PRINT_MARGIN + (field.y / 100) * CONTENT_HEIGHT;
            const width = field.width || 25;
            const height = field.height || 25;

            pdf.addImage(
                image,
                getImageFormat(field.image),
                x - width / 2,
                y - height / 2,
                width,
                height,
                undefined,
                "FAST"
            );
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

        return {
            image: canvas.toDataURL("image/png"),
            width: canvas.width,
            height: canvas.height
        };
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

        pdf.addImage(
            textImage.image,
            "PNG",
            drawX,
            y - imageHeight / 2,
            imageWidth,
            imageHeight,
            undefined,
            "FAST"
        );
    };

    // ==========================================
    // ✅ DRAW ENGLISH TEXT (Updated for \n Support)
    // ==========================================
    const drawEnglishText = (pdf, field) => {
        if (!field?.text) return;

        const x = PRINT_MARGIN + (field.x / 100) * CONTENT_WIDTH;
        const y = PRINT_MARGIN + (field.y / 100) * CONTENT_HEIGHT;
        const fontSize = field.fontSize || FONT_SIZE;

        pdf.setFontSize(fontSize);
        pdf.setTextColor(0, 0, 0);

        // 🆕 अगर valueText मौजूद है
        if (field.valueText !== undefined) {
            pdf.setFont("helvetica", "bold");
            pdf.text(field.text, x, y, { align: field.align || "left" });

            const labelWidth = pdf.getTextWidth(field.text);

            pdf.setFont("helvetica", "normal");
            pdf.text(String(field.valueText), x + labelWidth, y, { align: field.align || "left" });
            return;
        }

        // 🆕 अगर text Array (List) के रूप में है (Mixed Bold & Normal)
        if (Array.isArray(field.text)) {
            let tokens = [];

            // 1. सारे parts को तोड़कर words में डालें (Newline \n का भी ध्यान रखें)
            field.text.forEach(part => {
                const lines = part.text.split('\n');
                lines.forEach((line, index) => {
                    if (index > 0) {
                        tokens.push({ text: '\n', bold: part.bold }); // Newline token
                    }
                    if (line) {
                        const words = line.split(/(\s+)/);
                        words.forEach(t => {
                            if (t) tokens.push({ text: t, bold: part.bold });
                        });
                    }
                });
            });

            // 2. maxWords लिमिट लागू करें
            let validWordCount = 0;
            let finalTokens = [];
            for (let i = 0; i < tokens.length; i++) {
                const token = tokens[i];
                const isWord = token.text.trim().length > 0 && token.text !== '\n';

                if (isWord) {
                    if (field.maxWords && field.maxWords > 0 && validWordCount >= field.maxWords) {
                        break; // लिमिट पूरी हो गई, रुक जाएं
                    }
                    validWordCount++;
                }
                finalTokens.push(token);
            }

            // 3. Line-by-line प्रिंट करें
            let currentX = x;
            let currentY = y;
            const lineHeightMm = fontSize * (field.lineHeight || 1.15) * 0.352778;
            const maxWidth = field.maxWidth || CONTENT_WIDTH;

            finalTokens.forEach((token) => {
                pdf.setFont("helvetica", token.bold ? "bold" : "normal");

                // 🆕 अगर यह नई लाइन है, तो Y (ऊंचाई) बढ़ाएं और X को शुरुआत में ले जाएं
                if (token.text === '\n') {
                    currentY += lineHeightMm;
                    currentX = x;
                    return;
                }

                if (token.text.trim() === "") {
                    currentX += pdf.getTextWidth(token.text);
                    return;
                }

                const wordWidth = pdf.getTextWidth(token.text);

                // Normal Word Wrap
                if (currentX + wordWidth > x + maxWidth && currentX > x) {
                    currentY += lineHeightMm;
                    currentX = x;
                }

                pdf.text(token.text, currentX, currentY);
                currentX += wordWidth;
            });
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
        const text = Array.isArray(field.text) ? field.text.map(p => p.text).join("") : String(field.text).trim();
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
                certificateName: {
                    text: "REQUEST LETTER FOR PRACTICAL INTERNSHIP",
                    x: 22,
                    y: 23,
                    align: "left",
                    maxWidth: 100,
                    fontSize: 16,
                    fontStyle: "bold",
                    fontFamily: "Arial"
                },
                 registrationno: {
                    text: "Registration No. ",
                    valueText: (result.enrollmentNo || ""),
                    x: 7,
                    y: 19,
                    align: "left",
                    maxWidth: 40,
                    fontSize: 10,
                    fontFamily: "Arial"
                },
                issueDate: {
                    text: "Date :",
                    valueText: (result.issueDate || ""),
                    x: 78,
                    y: 19,
                    align: "left",
                    maxWidth: 40,
                    fontSize: 10,
                    fontFamily: "Arial"
                },
                to1: { text: "To,", x: 7, y: 26.5, fontSize: 11, fontStyle: "normal", fontFamily: "Arial" },
                to2: { text: "The Superintendent", x: 7, y: 29.5, fontSize: 11, fontStyle: "bold", fontFamily: "Arial" },
                to3: { text: "Max super speciality hospital Saket,", x: 7, y: 32, fontSize: 11, fontStyle: "normal", fontFamily: "Arial" },
                to4: { text: "New Delhi", x: 7, y: 35, fontSize: 11, fontStyle: "normal", fontFamily: "Arial" },

                subject: {
                    text: [
                        { text: "Sub: Reference letter for the Practical Internship for ", bold: false },
                        { text: (result.courseName || "DIPLOMA IN CARDIOPULMONARY TECHNOLOGY"), bold: true }
                    ],
                    x: 7, y: 38, fontSize: 11, maxWidth: 190, lineHeight: 1.5, fontFamily: "Arial"
                },

                salutation: { text: "Dear Sir/Madam,", x: 7, y: 41, fontSize: 11, fontFamily: "Arial" },

                para1: {
                    text: [
                        { text: (result.name || ""), bold: true },
                        { text: " has successfully completed ", bold: false },
                        { text: (result.courseName || "DIPLOMA IN CARDIOPULMONARY TECHNOLOGY"), bold: true },
                        { text: " course in " + (result.startDate || "") + " to " + (result.startDate || "") + " sessions. Candidate was found obedient during the course duration. We are pleased to work closely with Hospital to groom our ", bold: false },
                        { text: (result.courseName || "DIPLOMA IN CARDIOPULMONARY TECHNOLOGY"), bold: true },
                        { text: " student through clinical training at your esteem organization.", bold: false }
                    ],
                    x: 7, y: 45, fontSize: 11, maxWidth: 190, lineHeight: 1.5, fontFamily: "Arial"
                },

                det1: { text: [{ text: "NAME: ", bold: true }, { text: (result.firstName || ""), bold: false }], x: 7, y: 54, fontSize: 11, fontFamily: "Arial" },
                det2: { text: [{ text: "FATHER’S NAME: ", bold: true }, { text: (result.fatherName || ""), bold: false }], x: 7, y: 56, fontSize: 11, fontFamily: "Arial" },
                det3: { text: [{ text: "MOTHER ‘S NAME: ", bold: true }, { text: (result.motherName || ""), bold: false }], x: 7, y: 58, fontSize: 11, fontFamily: "Arial" },
                det4: { text: [{ text: "ENROLLMENT NO.: ", bold: true }, { text: (result.enrollmentNo || ""), bold: false }], x: 7, y: 60, fontSize: 11, fontFamily: "Arial" },
                det5: { text: [{ text: "ROLL NUMBER: ", bold: true }, { text: ( "Ist Year : " + ( result.rollnoa) +" & 2nd Year : " + ( result.rollno1) +""), bold: false }], x: 7, y: 62, fontSize: 11, fontFamily: "Arial" },

                para2: {
                    text: "Training providing Healthcare organization is not liable to pay any salary to any of the candidate those are undergoing internship.\nAll interns shall maintain a training LOG book. The candidate and their hospital mentor/supervisor need to sign this on completion of internship.",
                    x: 7, y: 64, fontSize: 11, maxWidth: 190, wordWrap: true, lineHeight: 1.5, fontFamily: "Arial"
                },

                para4: {
                    text: [
                        { text: "We look forward to jointly upgrading the quality standards of ", bold: false },
                        { text: (result.courseName || "DIPLOMA IN CARDIOPULMONARY TECHNOLOGY"), bold: true },
                        { text: " in the healthcare industry.\n\n We wish him/her all the very best for his future endeavours we and growth!\n\n Thanks you!", bold: false }
                    ],
                    x: 7, y: 72.5, fontSize: 11, maxWidth: 190, lineHeight: 1.5, fontFamily: "Arial"
                },
                 sealstemp: {
                    text: "Signature of Head/Authorized Authority",
  
                    x: 7,
                    y: 88,
                    align: "left",
                    fontStyle: "bold",
                    maxWidth: 40,
                    fontSize: 10,
                    fontFamily: "Arial"
                },
                 mainname: {
                    text: "SHAHEED BHAGAT SINGH HEALTH AND EDUCATION (SBSHE)",
  
                    x: 7,
                    y: 90,
                    align: "left",
                    fontStyle: "normal",
                    maxWidth: 40,
                    fontSize: 10,
                    fontFamily: "Arial"
                },
                website: {
                    text: "Website:" + " Shaheedbhagatsinghhealthandeducation.com" + " | " + "Email:" + " Contact@Shaheedbhagatsinghhealthandeducation.Com",
                    x: 9,
                    y: 95,
                    align: "left",
                    maxWidth: 180,
                    fontSize: 9.5,
                    fontFamily: "Arial"
                },
            };

            const backgroundImage = await loadImage("/assets/Documents/Other_File.png");

            const pdf = new jsPDF({
                orientation: "portrait",
                unit: "mm",
                format: [PAGE_WIDTH, PAGE_HEIGHT],
                compress: true
            });

            pdf.addImage(
                backgroundImage,
                "JPEG",
                PRINT_MARGIN,
                PRINT_MARGIN,
                CONTENT_WIDTH,
                CONTENT_HEIGHT,
                undefined,
                "FAST"
            );

            // 👇 यहाँ भी सिर्फ एक्सिस्टिंग फील्ड्स को रखा गया है
            [
                FIELDS.certificateName,
                FIELDS.registrationno,
                FIELDS.issueDate,
                FIELDS.to1,
                FIELDS.to2,
                FIELDS.to3,
                FIELDS.to4,
                FIELDS.subject,
                FIELDS.salutation,
                FIELDS.para1,
                FIELDS.det1,
                FIELDS.det2,
                FIELDS.det3,
                FIELDS.det4,
                FIELDS.det5,
                FIELDS.para2,
                FIELDS.website,
                FIELDS.sealstemp,
                FIELDS.mainname,
                FIELDS.para4
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

    // ✅ UI - सिर्फ PDF दिखेगी
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
                    title="REG PDF"
                    width="100%"
                    height="100%"
                    style={{ border: "none" }}
                />
            )}
        </div>
    );
};

export default TrainingCertificate;