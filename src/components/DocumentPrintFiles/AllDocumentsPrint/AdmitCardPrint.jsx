 import React, { useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import { printAdmitCardApi } from "../../AllServicesFiles/AdminStudentService";

const AdmitCardPrint = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const printedId = useRef(null);

    // ✅ Custom size — 200 x 283 (A4 ratio maintain)
    const PAGE_WIDTH = 200;
    const PAGE_HEIGHT = 283;

    // ✅ Print margin (mm) — page ke border se andar space
    const PRINT_MARGIN = 5;

    // ✅ Effective drawing area (margin ke andar)
    const CONTENT_WIDTH = PAGE_WIDTH - PRINT_MARGIN * 2;   // 190
    const CONTENT_HEIGHT = PAGE_HEIGHT - PRINT_MARGIN * 2; // 273

    const FONT_COLOR = "#000000";
    const MIN_FONT_SIZE = 7;

    // =========================================================
    // ✅ GO BACK TO PREVIOUS PAGE (jahan se aaya tha)
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
            image.onerror = () => reject(new Error(`Image load nahi hui: ${String(src).substring(0, 100)}`));
            image.src = src;
        });
    };

    const getImageFormat = (src) => {
        if (!src) return "PNG";
        const value = String(src).toLowerCase();
        if (value.startsWith("data:image/jpeg") || value.startsWith("data:image/jpg") || value.includes(".jpg") || value.includes(".jpeg")) {
            return "JPEG";
        }
        return "PNG";
    };

    // =========================================================
    // DRAW IMAGE (with margin)
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
    // ✅ CREATE TEXT IMAGE (Supports Word Wrap)
    // =========================================================
    const createTextImage = (field) => {
        const text = String(field?.text ?? "").trim();
        if (!text) return null;

        const scale = 4;
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        if (!ctx) return null;

        let currentFontSize = (field.fontSize || 13) * scale;
        const fontFamily = field.fontFamily || "Arial";
        const fontWeight = field.fontWeight || "normal";
        const fontStyle = field.fontStyle || "normal";
        const fontColor = field.fontColor || field.color || FONT_COLOR;
        const align = field.align || "center";

        const maxWidthMm = field.maxWidth || 100;
        const maxWidthPx = maxWidthMm * 3.78 * scale;

        // ✅ WORD WRAP LOGIC
        if (field.wordWrap) {
            ctx.font = `${fontStyle} ${fontWeight} ${currentFontSize}px "${fontFamily}"`;
            let words = text.split(" ");
            let lines = [];
            let currentLine = words[0];

            for (let i = 1; i < words.length; i++) {
                let word = words[i];
                let width = ctx.measureText(currentLine + " " + word).width;
                if (width < maxWidthPx) {
                    currentLine += " " + word;
                } else {
                    lines.push(currentLine);
                    currentLine = word;
                }
            }
            lines.push(currentLine);

            const horizontalPadding = 8 * scale;
            const verticalPadding = 5 * scale;
            const lineHeight = currentFontSize * 1.3; 

            let maxLineWidth = 0;
            lines.forEach(line => {
                let w = ctx.measureText(line).width;
                if (w > maxLineWidth) maxLineWidth = w;
            });

            const finalWidth = Math.min(maxLineWidth + horizontalPadding, maxWidthPx + horizontalPadding);
            const finalHeight = (lines.length * lineHeight) + verticalPadding;

            canvas.width = Math.ceil(finalWidth);
            canvas.height = Math.ceil(finalHeight);

            ctx.font = `${fontStyle} ${fontWeight} ${currentFontSize}px "${fontFamily}"`;
            ctx.fillStyle = fontColor;
            ctx.textBaseline = "top";
            ctx.textAlign = align;

            let startY = verticalPadding / 2;

            lines.forEach((line, index) => {
                let drawX;
                if (align === "left") drawX = horizontalPadding / 2;
                else if (align === "right") drawX = canvas.width - horizontalPadding / 2;
                else drawX = canvas.width / 2;

                ctx.fillText(line, drawX, startY + (index * lineHeight));
            });

        } else {
            // ✅ NORMAL SINGLE LINE LOGIC (Auto Shrink)
            let textWidth = 0;
            while (true) {
                ctx.font = `${fontStyle} ${fontWeight} ${currentFontSize}px "${fontFamily}"`;
                textWidth = ctx.measureText(text).width;

                if (textWidth <= maxWidthPx) break;

                currentFontSize -= 0.25 * scale;
                if (currentFontSize <= MIN_FONT_SIZE * scale) {
                    currentFontSize = MIN_FONT_SIZE * scale;
                    ctx.font = `${fontStyle} ${fontWeight} ${currentFontSize}px "${fontFamily}"`;
                    textWidth = ctx.measureText(text).width;
                    break;
                }
            }

            const horizontalPadding = 8 * scale;
            const verticalPadding = 5 * scale;
            const finalWidth = Math.min(textWidth + horizontalPadding, maxWidthPx + horizontalPadding);
            const finalHeight = currentFontSize * 1.8 + verticalPadding;

            canvas.width = Math.ceil(finalWidth);
            canvas.height = Math.ceil(finalHeight);

            ctx.font = `${fontStyle} ${fontWeight} ${currentFontSize}px "${fontFamily}"`;
            ctx.fillStyle = fontColor;
            ctx.textBaseline = "middle";
            ctx.textAlign = align;

            let drawX;
            if (align === "left") drawX = horizontalPadding / 2;
            else if (align === "right") drawX = canvas.width - horizontalPadding / 2;
            else drawX = canvas.width / 2;

            ctx.fillText(text, drawX, canvas.height / 2);
        }

        return {
            image: canvas.toDataURL("image/png"),
            width: canvas.width,
            height: canvas.height,
            scale,
        };
    };

    // =========================================================
    // DRAW TEXT (with margin)
    // =========================================================
    const drawText = (pdf, field) => {
        if (!field || field.text === null || field.text === undefined || String(field.text).trim() === "") {
            return;
        }

        const textData = createTextImage(field);
        if (!textData) return;

        const x = PRINT_MARGIN + (field.x / 100) * CONTENT_WIDTH;
        const y = PRINT_MARGIN + (field.y / 100) * CONTENT_HEIGHT;

        const imageWidth = textData.width / textData.scale / 3.78;
        const imageHeight = textData.height / textData.scale / 3.78;

        let drawX = x;
        if (field.align === "center") drawX = x - imageWidth / 2;
        else if (field.align === "right") drawX = x - imageWidth;

        pdf.addImage(textData.image, "PNG", drawX, y - imageHeight / 2, imageWidth, imageHeight, undefined, "FAST");
    };

    // =========================================================
    // DRAW SUBJECTS (with margin)
    // =========================================================
    const drawSubjects = (pdf, subjects) => {
        if (!Array.isArray(subjects)) return;

        const validSubjects = subjects.filter((item) => item?.code && item?.name);

        validSubjects.forEach((subject, index) => {
            const y = 50 + index * 2;

            drawText(pdf, {
                text: String(index + 1),
                x: 6,
                y,
                align: "center",
                maxWidth: 15,
                fontSize: 13,
                fontFamily: "Arial",
                fontWeight: "bold",
                fontStyle: "normal",
                fontColor: "#000000",
            });

            drawText(pdf, {
                text: subject.code || "",
                x: 70.5,
                y,
                align: "center",
                maxWidth: 30,
                fontSize: 13,
                fontFamily: "Arial",
                fontWeight: "bold",
                fontStyle: "normal",
                fontColor: "#000000",
            });

            drawText(pdf, {
                text: subject.name || "",
                x: 10,
                y,
                align: "left",
                maxWidth: 100,
                fontSize: 13,
                fontFamily: "Arial",
                fontWeight: "bold",
                fontStyle: "normal",
                fontColor: "#000000",
            });

            drawText(pdf, {
                text: subject.grade?.trim() || "",
                x: 87,
                y,
                align: "center",
                maxWidth: 40,
                fontSize: 13,
                fontFamily: "Arial",
                fontWeight: "bold",
                fontStyle: "normal",
                fontColor: "#000000",
            });
        });
    };

    const printDiploma = async (studentId) => {
        try {
            const result = await printAdmitCardApi(studentId);

            if (!result) {
                alert("Diploma data nahi mila.");
                goBackToPreviousPage();
                return;
            }

            const FIELDS = {
                name: {
                    text: result.name || "",
                    x: 22,
                    y: 25,
                    align: "left",
                    maxWidth: 100,
                    fontSize: 13,
                    fontFamily: "Arial",
                    fontWeight: "bold",
                    fontStyle: "normal",
                    fontColor: "#000000",
                },

                session: {
                    text: result.session || "",
                    x: 68,
                    y: 25,
                    align: "center",
                    maxWidth: 50,
                    fontSize: 13,
                    fontFamily: "Arial",
                    fontWeight: "bold",
                    fontStyle: "normal",
                    fontColor: "#000000",
                },

                fatherName: {
                    text: result.fatherName || "",
                    x: 23,
                    y: 29.2,
                    align: "left",
                    maxWidth: 50,
                    fontSize: 13,
                    fontFamily: "Arial",
                    fontWeight: "bold",
                    fontStyle: "normal",
                    fontColor: "#000000",
                },

                // ✅ Yahan wordWrap add kar diya hai
                centreName: {
                    text: result.centreName || "",
                    x: 20,
                    y: 37.2,
                    align: "left",
                    maxWidth: 150,
                    fontSize: 13,
                    fontFamily: "Arial",
                    fontWeight: "bold",
                    fontStyle: "normal",
                    fontColor: "#000000",
                    wordWrap: true // 👈 Sirf isko add kiya hai
                },

                courseName: {
                    text: result.courseName || "",
                    x: 14,
                    y: 33.2,
                    align: "left",
                    maxWidth: 75,
                    fontSize: 13,
                    fontFamily: "Arial",
                    fontWeight: "bold",
                    fontStyle: "normal",
                    fontColor: "#000000",
                },

                selfImage: {
                    image: result.selfImage || "",
                    x: 90,
                    y: 30,
                    width: 25,
                    height: 30,
                },

                enrollmentNo: {
                    text: result.enrollmentNo || "",
                    x: 23,
                    y: 41.1,
                    align: "left",
                    maxWidth: 50,
                    fontSize: 13,
                    fontFamily: "Arial",
                    fontWeight: "bold",
                    fontStyle: "normal",
                    fontColor: "#000000",
                },

                rollNo: {
                    text: result.rollno || "",
                    x: 58,
                    y: 41.1,
                    align: "left",
                    maxWidth: 50,
                    fontSize: 13,
                    fontFamily: "Arial",
                    fontWeight: "bold",
                    fontStyle: "normal",
                    fontColor: "#000000",
                },
            };

            const backgroundImage = await loadImage("/assets/Documents/AdmitCard.jpeg");

            const pdf = new jsPDF({
                orientation: "portrait",
                unit: "mm",
                format: [PAGE_WIDTH, PAGE_HEIGHT],
                compress: true,
            });

            pdf.addImage(backgroundImage, "JPEG", PRINT_MARGIN, PRINT_MARGIN, CONTENT_WIDTH, CONTENT_HEIGHT, undefined, "FAST");

            await drawImage(pdf, FIELDS.selfImage, "Student Image");
            await drawImage(pdf, FIELDS.stampImage, "Stamp Image");

            [
                FIELDS.name,
                FIELDS.fatherName,
                FIELDS.centreName,
                FIELDS.session,
                FIELDS.courseName,
                FIELDS.enrollmentNo,
                FIELDS.rollNo,
            ].forEach((field) => {
                drawText(pdf, field);
            });

            drawSubjects(pdf, result.subjects);

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

export default AdmitCardPrint;