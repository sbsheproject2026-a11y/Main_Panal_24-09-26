 import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import { printNOCApi } from "../../AllServicesFiles/AdminStudentService";

const REGPrint = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);

    const PAGE_WIDTH = 200;
    const PAGE_HEIGHT = 283;
    const PRINT_MARGIN = -3;
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
        if (id) {
            printDiploma(id);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
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

        const text = String(field.text).trim();
        if (!text) return;

        pdf.setFont(jsPdfFont, fontStyle);

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
                    // Outer border
                    pdf.roundedRect(rectX, rectY, rectW, rectH, radius, radius, 'S');
                    // Inner Double Border
                    if (field.border.double) {
                        pdf.roundedRect(rectX + 1.2, rectY + 1.2, rectW - 2.4, rectH - 2.4, radius - 0.6, radius - 0.6, 'S');
                    }
                } else {
                    pdf.rect(rectX, rectY, rectW, rectH, 'S');
                }
            } else if (field.border.type === 'line') {
                const borderWidth = field.border.width || pdf.getTextWidth(text);
                const borderY = y + (field.border.offsetY || 0);
                pdf.line(x, borderY, x + borderWidth, borderY);
            }
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
                certificateName: {
                    text: "REGISTRATION CERTIFICATE",
                    x: 50,                   // ✅ Center position
                    y: 26.5,                 // ✅ Thoda upar set kiya
                    align: "center",
                    maxWidth: 150,
                    fontSize: 20,            // ✅ Box me fit aane ke liye size adjust kiya
                    fontStyle: "bold",
                    fontFamily: "times",     // ✅ Serif Font
                    color: [204, 51, 51],    // ✅ Red Text
                    border: {                // ✅ Blue Box Border settings
                        type: 'box',
                        color: [74, 144, 226], // Light Blue border color
                        lineWidth: 0.6,
                        paddingX: 10,
                        paddingY: 4,
                        rounded: true,
                        radius: 3,
                        double: true
                    }
                },
                name: {
                    text: "Student's Name : ", 
                    valueText: (result.firstName || ""), 
                    x: 7, y: 34.5, align: "left", maxWidth: 100,
                    fontSize: 12, fontStyle: "normal", fontFamily: "Arial"
                },
                fatherName: {
                    text: "Father's Name : ", 
                    valueText: (result.fatherName || ""), 
                    x: 7, y: 38, align: "left", maxWidth: 100,
                    fontSize: 12, fontStyle: "normal", fontFamily: "Arial"
                },
                motherName: {
                    text: "Mother's Name : ", 
                    valueText: (result.motherName || ""), 
                    x: 7, y: 42, align: "left", maxWidth: 100,
                    fontSize: 12, fontStyle: "normal", fontFamily: "Arial"
                },
                dOB1: {
                    text: "Date of Birth : ", 
                    valueText: (result.dOB1 || ""), 
                    x: 7, y: 45.5, align: "left", maxWidth: 100,
                    fontSize: 12, fontStyle: "normal", fontFamily: "Arial"
                },
                courseName: {
                    text: "Course's Name : ", 
                    valueText: (result.courseName || ""), 
                    x: 7, y: 31, align: "left", maxWidth: 100,
                    fontSize: 12, fontFamily: "Arial"
                },
                address: {
                    valueText: (result.address || ""), 
                    text: "Address : "  ,
                    x: 7, y: 49, align: "left", maxWidth: 75,
                    fontSize: 12, fontStyle: "normal", fontFamily: "Arial"
                },
                trainingcentreName: {
                    text: "Training Centre’s Name : ",
                    x: 7, y: 53, align: "left", maxWidth: 180,
                    fontSize: 12, fontStyle: "bold", fontFamily: "Arial",
                    wordWrap: true
                },
                centreName: {
                    text: (result.centreName || ""),
                    x: 32, y: 53, align: "left", maxWidth: 100,
                    fontSize: 12, fontStyle: "normal", fontFamily: "Arial",
                    wordWrap: true
                },
                examiningcentreName1: {
                    text: "Examining Body :",
                    x: 7, y: 62.5, align: "left", maxWidth: 100,
                    fontSize: 12, fontStyle: "bold", fontFamily: "Arial",
                    wordWrap: true
                },
                centreName1: {
                    text: "SHAHEED BHAGAT SINGH HEALTH AND EDUCATION ",
                    x: 25, y: 62.5, align: "left", maxWidth: 130,
                    fontSize: 12, fontStyle: "normal", fontFamily: "Arial",
                    wordWrap: true
                },
                selfImage: {
                    image: result.selfImage || "",
                    x: 85, y: 36, width: 25, height: 30
                },
                qrImage: {
                    image: result.qrimage || "",
                    x: 85, y: 68, width: 25, height: 25
                },
                sealstemp: {
                    text: "(Signature with Seal) " ,
                    x: 70, y: 83, align: "left", maxWidth: 40,
                    fontSize: 14, fontFamily: "Arial"
                },
                registrationno: {
                    text: "Registration No. " + (result.srnoDiploma || ""),
                    x: 13, y: 5.5, align: "left", maxWidth: 40,
                    fontSize: 10, fontFamily: "Arial"
                },
                enrollmentNo: {
                    text: (result.enrollmentNo || ""),
                    x: 76, y: 43, align: "left", maxWidth: 40,
                    fontSize: 10, fontFamily: "Arial"
                },
                srnoDiploma: {
                    text: "Sr. No." + (result.migrationSrno || ""),
                    x: 77, y: 5.5, align: "left", maxWidth: 40,
                    fontSize: 10, fontFamily: "Arial"
                },
                issueDate: {
                    text: "Date :" + (result.issueDate || ""),
                    x: 7, y: 73, align: "left", maxWidth: 40,
                    fontSize: 10, fontFamily: "Arial"
                },
                palce: {
                    text: "Place : DELHI",
                    x: 7, y: 75, align: "left", maxWidth: 40,
                    fontSize: 10, fontFamily: "Arial"
                },
                issueYear: {
                    valueText: (result.issueYear || ""), 
                    text: "Passing Year : "  ,
                    x: 7, y: 59, align: "left", maxWidth: 30,
                    fontSize: 13, fontStyle: "normal", fontFamily: "Arial"
                },
                noteTitle: {
                    text: "Note :",
                    x: 7, y: 82, align: "left",
                    fontSize: 12, fontStyle: "bold", fontFamily: "Arial"
                },
                note1: {
                    text: "• Shaheed Bhagat Singh Health & Education reserves the right to cancel or withdraw this certificate if any\n  information or document submitted by the student is found to be incorrect, false, or fraudulent. As per the \n  applicable rules, this certificate is valid for a lifetime, unless cancelled or withdrawn by the issuing authority.",
                    x: 10, y: 85, align: "left", maxWidth: 175,
                    fontSize: 10, fontFamily: "Arial", wordWrap: true
                },
                note2: {
                    text: "•" + " This is a Membership/Registration Certificate issued by Shaheed Bhagat Singh Health & Education, New  \n  Delhi. It is not a professional or government-issued license.",
                    x: 10, y: 90.5, align: "left", maxWidth: 175,
                    fontSize: 10, fontFamily: "Arial", wordWrap: true
                },
                website: {
                    text: "Website:" + " Shaheedbhagatsinghhealthandeducation.com" + " | " + "Email:" + " Contact@Shaheedbhagatsinghhealthandeducation.Com",
                    x: 6, y: 95, align: "left", maxWidth: 180,
                    fontSize: 9.5, fontFamily: "Arial"
                },
            };

            const backgroundImage = await loadImage("/assets/Documents/REGFinal.png");

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

            await drawImage(pdf, FIELDS.selfImage, "Student Image");
            await drawImage(pdf, FIELDS.qrImage, "QR Image");

            [
                FIELDS.certificateName,
                FIELDS.trainingcentreName,
                FIELDS.examiningcentreName1,
                FIELDS.name,
                FIELDS.fatherName,
                FIELDS.dOB1,
                FIELDS.motherName,
                FIELDS.courseName,
                FIELDS.address,
                FIELDS.centreName,
                FIELDS.palce,
                FIELDS.enrollmentNo,
                FIELDS.srnoDiploma,
                FIELDS.centreName1,
                FIELDS.issueDate,
                FIELDS.issueYear,
                FIELDS.noteTitle,
                FIELDS.note1,
                FIELDS.note2,
                FIELDS.website,
                FIELDS.registrationno,
                FIELDS.sealstemp,
            ].forEach((field) => {
                drawText(pdf, field);
            });

            const pdfBlob = pdf.output("blob");
            const pdfObjectUrl = URL.createObjectURL(pdfBlob);

            window.open(pdfObjectUrl, "_blank");

            setTimeout(() => {
                goBackToPreviousPage();
            }, 1000);

        } catch (error) {
            console.error("Diploma PDF Error:", error);
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

export default REGPrint;