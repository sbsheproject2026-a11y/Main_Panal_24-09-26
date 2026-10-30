 import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import { printNOCApi } from "../../AllServicesFiles/AdminStudentService";

let _bgImageCache = null;

const TrainingCertificate = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);

    const PAGE_WIDTH = 210;
    const PAGE_HEIGHT = 283;
    const PRINT_MARGIN = -5;
    const CONTENT_WIDTH = PAGE_WIDTH - PRINT_MARGIN * 2;
    const CONTENT_HEIGHT = PAGE_HEIGHT - PRINT_MARGIN * 2;
    const FONT_SIZE = 18;
    const TEXT_SCALE = 2;
    const FONT_COLOR = "#000000";

    const goBackToPreviousPage = () => {
        if (window.history.length > 1) {
            navigate(-1);
        } else {
            const roleId = String(localStorage.getItem("RoleId") || "").trim();
            if (roleId === "5") navigate("/confirm-addmissions", { replace: true });
            else if (roleId === "33") navigate("/student-print-list", { replace: true });
            else navigate("/", { replace: true });
        }
    };

    useEffect(() => {
        if (id) {
            printDiploma(id);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    const loadImage = (src) => {
        const isBg = src === "/assets/Documents/Other_File.png";
        if (isBg && _bgImageCache) return Promise.resolve(_bgImageCache);

        return new Promise((resolve, reject) => {
            if (!src) return reject(new Error("Image URL empty."));
            const image = new Image();
            image.crossOrigin = "anonymous";
            image.onload = () => {
                if (isBg) _bgImageCache = image;
                resolve(image);
            };
            image.onerror = () => reject(new Error(`Image load failed: ${src.substring(0, 100)}`));
            image.src = src;
        });
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

        const horizontalPadding = 4 * scale;
        const verticalPadding = 10 * scale;

        canvas.width = Math.ceil(measuredWidth + horizontalPadding);
        canvas.height = Math.ceil(finalFontSize + verticalPadding);

        const drawCtx = canvas.getContext("2d", { alpha: true });
        if (!drawCtx) return null;

        drawCtx.clearRect(0, 0, canvas.width, canvas.height);
        drawCtx.font = `${fontStyle} ${finalFontSize}px ${fontFamily}`;
        drawCtx.fillStyle = FONT_COLOR;
        drawCtx.textBaseline = "alphabetic";
        drawCtx.textAlign = field.align || "center";

        let drawX = canvas.width / 2;
        if (field.align === "left") drawX = horizontalPadding / 2;
        if (field.align === "right") drawX = canvas.width - horizontalPadding / 2;

        const drawY = canvas.height / 2 + finalFontSize / 3;
        drawCtx.fillText(text, drawX, drawY);

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

    // ✅ drawEnglishText update (Custom Border + Color + Font)
    const drawEnglishText = (pdf, field) => {
        if (!field?.text) return;

        const x = PRINT_MARGIN + (field.x / 100) * CONTENT_WIDTH;
        const y = PRINT_MARGIN + (field.y / 100) * CONTENT_HEIGHT;
        const fontSize = field.fontSize || FONT_SIZE;

        pdf.setFontSize(fontSize);

        // Text Color
        if (field.color) {
            pdf.setTextColor(field.color[0], field.color[1], field.color[2]);
        } else {
            pdf.setTextColor(0, 0, 0);
        }

        // Font Family
        const jsPdfFont = field.fontFamily === "times" ? "times" : "helvetica";
        const fontStyle = field.fontStyle === "bold" ? "bold" : "normal";

        if (field.valueText !== undefined) {
            pdf.setFont(jsPdfFont, "bold");
            pdf.text(field.text, x, y, { align: field.align || "left" });
            const labelWidth = pdf.getTextWidth(field.text);
            pdf.setFont(jsPdfFont, "normal");
            pdf.text(String(field.valueText), x + labelWidth, y, { align: field.align || "left" });
            return;
        }

        if (Array.isArray(field.text)) {
            const tokens = [];
            field.text.forEach(part => {
                const lines = part.text.split('\n');
                lines.forEach((line, index) => {
                    if (index > 0) tokens.push({ text: '\n', bold: part.bold });
                    if (line) {
                        line.split(/(\s+)/).forEach(t => {
                            if (t) tokens.push({ text: t, bold: part.bold });
                        });
                    }
                });
            });

            let validWordCount = 0;
            const finalTokens = [];
            for (const token of tokens) {
                const isWord = token.text.trim().length > 0 && token.text !== '\n';
                if (isWord) {
                    if (field.maxWords && field.maxWords > 0 && validWordCount >= field.maxWords) break;
                    validWordCount++;
                }
                finalTokens.push(token);
            }

            let currentX = x;
            let currentY = y;
            const lineHeightMm = fontSize * (field.lineHeight || 1.15) * 0.352778;
            const maxWidth = field.maxWidth || CONTENT_WIDTH;
            let currentBold = null;

            finalTokens.forEach((token) => {
                if (currentBold !== token.bold) {
                    pdf.setFont(jsPdfFont, token.bold ? "bold" : "normal");
                    currentBold = token.bold;
                }

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
                if (currentX + wordWidth > x + maxWidth && currentX > x) {
                    currentY += lineHeightMm;
                    currentX = x;
                }

                pdf.text(token.text, currentX, currentY);
                currentX += wordWidth;
            });
            return;
        }

        let text = String(field.text).trim();
        if (!text) return;

        if (field.maxWords && field.maxWords > 0) {
            const allWords = text.split(/\s+/);
            if (allWords.length > field.maxWords) text = allWords.slice(0, field.maxWords).join(" ");
        }

        pdf.setFont(jsPdfFont, fontStyle);
        pdf.setLineHeightFactor(field.lineHeight || 1.15);

        // ✅ BORDER LOGIC (Blue Box ke liye)
        if (field.border) {
            const borderColor = field.border.color || [70, 130, 180];
            pdf.setDrawColor(borderColor[0], borderColor[1], borderColor[2]);
            pdf.setLineWidth(field.border.lineWidth || 0.6);

            if (field.border.type === 'box') {
                const textWidth = pdf.getTextWidth(text);
                const textHeightMm = (fontSize * 0.352778);
                const paddingX = field.border.paddingX || 8;
                const paddingY = field.border.paddingY || 4;

                let rectX = x - paddingX;
                if (field.align === "center") rectX = x - (textWidth / 2) - paddingX;
                else if (field.align === "right") rectX = x - textWidth - paddingX;

                const rectY = y - textHeightMm - paddingY + 1;
                const rectW = textWidth + (paddingX * 2);
                const rectH = textHeightMm + (paddingY * 2);

                if (field.border.rounded) {
                    const radius = field.border.radius || 3;
                    pdf.roundedRect(rectX, rectY, rectW, rectH, radius, radius, 'S');
                    if (field.border.double) {
                        pdf.roundedRect(rectX + 1.2, rectY + 1.2, rectW - 2.4, rectH - 2.4, radius - 0.6, radius - 0.6, 'S');
                    }
                } else {
                    pdf.rect(rectX, rectY, rectW, rectH, 'S');
                }
            }
        }

        if (field.wordWrap) {
            const maxWidth = field.maxWidth || CONTENT_WIDTH;
            pdf.text(pdf.splitTextToSize(text, maxWidth), x, y, { align: field.align || "left" });
        } else {
            pdf.text(text, x, y, { align: field.align || "left" });
        }
    };

    const drawText = (pdf, field) => {
        if (!field?.text) return;
        const text = Array.isArray(field.text) ? field.text.map(p => p.text).join("") : String(field.text).trim();
        if (!text) return;
        if (isHindiText(text)) drawHindiText(pdf, field);
        else drawEnglishText(pdf, field);
    };

    const printDiploma = async (studentId) => {
        setLoading(true);
        try {
            console.log("⏳ 1. API aur Image load ho rahi hai...");
            
            const imagePromise = Promise.race([
                loadImage("/assets/Documents/Other_File.png"),
                new Promise((_, reject) => setTimeout(() => reject(new Error("Image Timeout: 10s")), 10000))
            ]).catch(err => {
                console.error("❌ Background load failed:", err);
                return null;
            });

            const [result, backgroundImage] = await Promise.all([
                printNOCApi(studentId),
                imagePromise
            ]);

            console.log("✅ 2. Data aur Image aa gayi");

            if (!result) {
                alert("Diploma data nahi mila.");
                return; 
            }
            if (!backgroundImage) {
                alert("Background image load nahi hui.");
                return;
            }

            const FIELDS = {
                // ✅ Title update with Border & Color
                certificateName: {
                    text: "REQUEST LETTER FOR PRACTICAL INTERNSHIP",
                    x: 50,                   // Center align
                    y: 25,                   // Adjust Y position
                    align: "center",
                    maxWidth: 150,
                    fontSize: 16,
                    fontStyle: "bold",
                    fontFamily: "times",     // Times New Roman
                    color: [204, 51, 51],    // Red
                    border: {
                        type: 'box',
                        color: [74, 144, 226], // Blue Border
                        lineWidth: 0.6,
                        paddingX: 8,
                        paddingY: 4,
                        rounded: true,
                        radius: 3,
                        double: true
                    }
                },
                registrationno: { text: "Registration No. ", valueText: (result.trainingReqCode || ""), x: 7, y: 19, align: "left", maxWidth: 40, fontSize: 10, fontFamily: "Arial" },
                issueDate: { text: "Date :", valueText: (result.date || ""), x: 78, y: 19, align: "left", maxWidth: 40, fontSize: 10, fontFamily: "Arial" },
                to1: { text: "To,", x: 7, y: 30, fontSize: 11, fontStyle: "normal", fontFamily: "Arial" },
                to2: { text: "The Superintendent", x: 7, y: 33, fontSize: 11, fontStyle: "bold", fontFamily: "Arial" },
                to3: { text: "Max super speciality hospital Saket,", x: 7, y: 36, fontSize: 11, fontStyle: "normal", fontFamily: "Arial" },
                to4: { text: "New Delhi", x: 7, y: 38, fontSize: 11, fontStyle: "normal", fontFamily: "Arial" },
                subject: {
                    text: [
                        { text: "Sub: Reference letter for the Practical Internship for ", bold: false },
                        { text: (result.courseName || "DIPLOMA IN CARDIOPULMONARY TECHNOLOGY"), bold: true }
                    ],
                    x: 7, y: 41, fontSize: 11, maxWidth: 190, lineHeight: 1.5, fontFamily: "Arial"
                },
                salutation: { text: "Dear Sir/Madam,", x: 7, y: 45, fontSize: 11, fontFamily: "Arial" },
                para1: {
                    text: [
                        { text: (result.name || ""), bold: true },
                        { text: " has successfully completed ", bold: false },
                        { text: (result.courseName || "DIPLOMA IN CARDIOPULMONARY TECHNOLOGY"), bold: true },
                        { text: " course in " + (result.startDate || "") + " to " + (result.startDate || "") + " sessions. Candidate was found obedient during the course duration. We are pleased to work closely with Hospital to groom our ", bold: false },
                        { text: (result.courseName || "DIPLOMA IN CARDIOPULMONARY TECHNOLOGY"), bold: true },
                        { text: " student through clinical training at your esteem organization.", bold: false }
                    ],
                    x: 7, y: 48, fontSize: 11, maxWidth: 190, lineHeight: 1.5, fontFamily: "Arial"
                },
                det1: { text: [{ text: "NAME: ", bold: true }, { text: (result.firstName || ""), bold: false }], x: 7, y: 59, fontSize: 11, fontFamily: "Arial" },
                det2: { text: [{ text: "FATHER’S NAME: ", bold: true }, { text: (result.fatherName || ""), bold: false }], x: 7, y: 61, fontSize: 11, fontFamily: "Arial" },
                det3: { text: [{ text: "MOTHER ‘S NAME: ", bold: true }, { text: (result.motherName || ""), bold: false }], x: 7, y: 63, fontSize: 11, fontFamily: "Arial" },
                det4: { text: [{ text: "ENROLLMENT NO.: ", bold: true }, { text: (result.enrollmentNo || ""), bold: false }], x: 7, y: 65, fontSize: 11, fontFamily: "Arial" },
                det5: { text: [{ text: "ROLL NUMBER: ", bold: true }, { text: ("Ist Year : " + (result.rollnoa) + " & 2nd Year : " + (result.rollno1) + ""), bold: false }], x: 7, y: 67, fontSize: 11, fontFamily: "Arial" },
                
                para4: {
                    text: [
               
                        { text: "We wish him/her all the very best for his future endeavours we and growth!\n\nThanks you!", bold: false }
                    ],
                    x: 7, y: 74, fontSize: 11, maxWidth: 190, lineHeight: 1.5, fontFamily: "Arial"
                },
                sealstemp: { text: "Signature of Head/Authorized Authority", x: 7, y: 88, align: "left", fontStyle: "bold", maxWidth: 40, fontSize: 10, fontFamily: "Arial" },
                mainname: { text: "SHAHEED BHAGAT SINGH HEALTH AND EDUCATION (SBSHE)", x: 7, y: 90, align: "left", fontStyle: "normal", maxWidth: 40, fontSize: 10, fontFamily: "Arial" },
                website: {
                    text: "Website:" + " Shaheedbhagatsinghhealthandeducation.com" + " | " + "Email:" + " Contact@Shaheedbhagatsinghhealthandeducation.Com",
                    x: 9, y: 95, align: "left", maxWidth: 180, fontSize: 9.5, fontFamily: "Arial"
                },
            };

            console.log("⏳ 3. PDF generate ho rahi hai...");
            const pdf = new jsPDF({
                orientation: "portrait",
                unit: "mm",
                format: [PAGE_WIDTH, PAGE_HEIGHT],
                compress: true,
            });

            pdf.addImage(backgroundImage, "JPEG", PRINT_MARGIN, PRINT_MARGIN, CONTENT_WIDTH, CONTENT_HEIGHT, undefined, "FAST");

            if (document.fonts && document.fonts.ready) {
                await document.fonts.ready;
            }

            [
                FIELDS.certificateName, FIELDS.registrationno, FIELDS.issueDate,
                FIELDS.to1, FIELDS.to2, FIELDS.to3, FIELDS.to4,
                FIELDS.subject, FIELDS.salutation, FIELDS.para1,
                FIELDS.det1, FIELDS.det2, FIELDS.det3, FIELDS.det4, FIELDS.det5,
                  FIELDS.website, FIELDS.sealstemp, FIELDS.mainname, FIELDS.para4
            ].forEach(field => drawText(pdf, field));

            const pdfBlob = pdf.output("blob");
            const pdfObjectUrl = URL.createObjectURL(pdfBlob);

            window.open(pdfObjectUrl, "_blank");
            console.log("✅ 4. PDF New Tab me open ho gayi!");

            setTimeout(() => {
                goBackToPreviousPage();
            }, 1000);

        } catch (error) {
            console.error("❌ Diploma PDF Error:", error);
            alert(error?.message || "Diploma PDF banane mein error aa gaya.");
            goBackToPreviousPage();
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ width: "100%", height: "100vh", display: "flex", justifyContent: "center", alignItems: "center", background: "#333" }}>
            <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
            </div>
            <span style={{ marginLeft: "15px", fontWeight: "bold", color: "#fff" }}>Generating PDF...</span>
        </div>
    );
};

export default TrainingCertificate;