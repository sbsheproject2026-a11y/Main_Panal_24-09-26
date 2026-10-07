 import React, { useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import { printAuthorityLetterApi } from "../../AllServicesFiles/AdminStudentService";

const AuthorityLetterPrint = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const printedId = useRef(null);

    // ✅ Page size (A4)
    const PAGE_WIDTH = 210;
    const PAGE_HEIGHT = 297;

    // ✅ Printer safe margin — border cut nahi hoga
    const PRINT_MARGIN = 5;

    // ✅ Inner area (background ke andar)
    const INNER_WIDTH = PAGE_WIDTH - PRINT_MARGIN * 2;
    const INNER_HEIGHT = PAGE_HEIGHT - PRINT_MARGIN * 2;

    // ✅ % → mm conversion (margin ke saath)
    const getX = (percent) => PRINT_MARGIN + (percent / 100) * INNER_WIDTH;
    const getY = (percent) => PRINT_MARGIN + (percent / 100) * INNER_HEIGHT;

    const FONT_SIZE = 18;
    const TEXT_SCALE = 4;
    const FONT_COLOR = "#000000";

    useEffect(() => {
        if (!id || printedId.current === id) return;

        printedId.current = id;
        printAuthorityLetter(id);
    }, [id]);

    // ==========================================
    // LOAD IMAGE
    // ==========================================
    const loadImage = (src) => {
        return new Promise((resolve, reject) => {
            if (!src) {
                reject(new Error("Image URL/Base64 empty hai."));
                return;
            }

            const image = new Image();
            image.crossOrigin = "anonymous";

            image.onload = () => resolve(image);

            image.onerror = () => {
                reject(
                    new Error(
                        `Image load nahi hui: ${src.substring(0, 100)}`
                    )
                );
            };

            image.src = src;
        });
    };

    // ==========================================
    // IMAGE FORMAT
    // ==========================================
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

    // ==========================================
    // CHECK HINDI
    // ==========================================
    const isHindiText = (text) => {
        return /[\u0900-\u097F]/.test(text);
    };

    // ==========================================
    // DRAW IMAGE
    // ==========================================
    const drawImage = async (pdf, field, imageName) => {
        if (!field?.image) return;

        try {
            const image = await loadImage(field.image);

            const x = getX(field.x);   // ✅ margin ke saath
            const y = getY(field.y);   // ✅ margin ke saath

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
            console.error(
                `${imageName} PDF mein add nahi hui:`,
                error
            );
        }
    };

    // ==========================================
    // CREATE HINDI TEXT IMAGE
    // ==========================================
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

        const fontFamily =
            field.fontFamily ||
            '"Arial Unicode MS", "Noto Sans Devanagari", "Mangal", sans-serif';

        const fontStyle = field.fontStyle || "normal";

        ctx.font = `${fontStyle} ${fontSize}px ${fontFamily}`;

        let measuredWidth = ctx.measureText(text).width;
        let finalFontSize = fontSize;

        if (measuredWidth > maxWidthPx) {
            finalFontSize = Math.max(
                8 * scale,
                fontSize * (maxWidthPx / measuredWidth)
            );

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

        if (field.align === "left") {
            drawX = horizontalPadding / 2;
        }

        if (field.align === "right") {
            drawX = canvas.width - horizontalPadding / 2;
        }

        const drawY = canvas.height / 2 + finalFontSize / 3;

        drawContext.fillText(text, drawX, drawY);

        return {
            image: canvas.toDataURL("image/png"),
            width: canvas.width,
            height: canvas.height,
        };
    };

    // ==========================================
    // DRAW HINDI TEXT
    // ==========================================
    const drawHindiText = (pdf, field) => {
        const textImage = createHindiTextImage(field);

        if (!textImage) return;

        const x = getX(field.x);   // ✅ margin ke saath
        const y = getY(field.y);   // ✅ margin ke saath

        const pixelToMm = 25.4 / (96 * TEXT_SCALE);

        let imageWidth = textImage.width * pixelToMm;
        let imageHeight = textImage.height * pixelToMm;

        const maxWidth = Math.min(
            field.maxWidth || INNER_WIDTH,   // ✅ inner width
            INNER_WIDTH                       // ✅ inner width
        );

        if (imageWidth > maxWidth) {
            const ratio = maxWidth / imageWidth;
            imageWidth = maxWidth;
            imageHeight *= ratio;
        }

        let drawX = x;

        if (field.align === "center") {
            drawX = x - imageWidth / 2;
        } else if (field.align === "right") {
            drawX = x - imageWidth;
        }

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
    // DRAW ENGLISH TEXT
    // ==========================================
    const drawEnglishText = (pdf, field) => {
        if (!field?.text) return;

        const text = String(field.text).trim();

        if (!text) return;

        const x = getX(field.x);   // ✅ margin ke saath
        const y = getY(field.y);   // ✅ margin ke saath

        const fontSize = field.fontSize || FONT_SIZE;
        const fontStyle = field.fontStyle || "normal";

        pdf.setFont(
            "helvetica",
            fontStyle === "bold" ? "bold" : "normal"
        );

        pdf.setFontSize(fontSize);
        pdf.setTextColor(0, 0, 0);

        pdf.text(text, x, y, {
            align: field.align || "left",
        });
    };

    // ==========================================
    // DRAW TEXT — wrapWords ke saath
    // ==========================================
    const drawText = (pdf, field) => {
        if (!field?.text) return;

        const text = String(field.text).trim();

        if (!text) return;

        // ✅ wrapWords — words per line, poora text show hoga
        if (field.wrapWords && field.wrapWords > 0) {
            const words = text.split(/\s+/);
            const lines = [];

            for (let i = 0; i < words.length; i += field.wrapWords) {
                lines.push(words.slice(i, i + field.wrapWords).join(" "));
            }

            const lineHeightMm = field.lineHeight || 2.5;

            lines.forEach((line, index) => {
                const lineField = {
                    ...field,
                    text: line,
                    y: field.y + index * lineHeightMm,
                };

                if (isHindiText(line)) {
                    drawHindiText(pdf, lineField);
                } else {
                    drawEnglishText(pdf, lineField);
                }
            });

            return;
        }

        // Default — single line
        if (isHindiText(text)) {
            drawHindiText(pdf, field);
        } else {
            drawEnglishText(pdf, field);
        }
    };

    // ==========================================
    // PRINT AUTHORITY LETTER
    // ==========================================
    const printAuthorityLetter = async (authorityId) => {
        try {
            const result = await printAuthorityLetterApi(authorityId);

            if (!result) {
                alert("Authority Letter data nahi mila.");
                navigate(-1);
                return;
            }

            // ==========================================
            // FIELDS
            // ==========================================
            const FIELDS = {
                name: {
                    text: result.name || "",
                    x: 26,
                    y: 45,
                    align: "left",
                    maxWidth: 100,
                    fontSize: 13,
                    fontStyle: "bold",
                    wrapWords: 4,
                    lineHeight: 2.5,
                    fontFamily: "Arial",
                },

                address: {
                    text: result.address || "",
                    x: 18,
                    y: 49.5,
                    align: "left",
                    maxWidth: 150,
                    fontSize: 10,
                    fontStyle: "normal",
                    fontFamily: "Arial",
                    wrapWords: 8,
                    lineHeight: 2.5,
                },

                endDate: {
                    text: result.endDate || "",
                    x: 39,
                    y: 73.2,
                    align: "left",
                    maxWidth: 100,
                    fontSize: 14,
                    fontStyle: "bold",
                    fontFamily: "Arial",
                },

                fatherName: {
                    text: result.fatherName || "",
                    x: 50,
                    y: 34,
                    align: "center",
                    maxWidth: 100,
                    fontSize: 16,
                    fontStyle: "bold",
                    fontFamily: "Arial",
                },

                relacition: {
                    text: result.relacition || "",
                    x: 50,
                    y: 36.5,
                    align: "center",
                    maxWidth: 100,
                    fontSize: 13,
                    fontStyle: "bold",
                    fontFamily: "Arial",
                },

                fatherName1: {
                    text: result.fatherName1 || "",
                    x: 50,
                    y: 39,
                    align: "center",
                    maxWidth: 100,
                    fontSize: 16,
                    fontStyle: "bold",
                    fontFamily: "Arial",
                },

                entityType: {
                    text: result.entityType || "",
                    x: 50,
                    y: 60,
                    align: "center",
                    maxWidth: 100,
                    fontSize: 18,
                    fontStyle: "bold",
                    fontFamily: "Arial",
                    wrapWords: 5,
                    lineHeight: 2.5,
                },

                centreName: {
                    text: result.centreName || "",
                    x: 50,
                    y: 77,
                    align: "center",
                    maxWidth: 100,
                    fontSize: 18,
                    fontStyle: "bold",
                    fontFamily: "Arial",
                    wrapWords: 5,
                    lineHeight: 2.5,
                },

                selfImage: {
                    image: result.selfImage || "",
                    x: 11,
                    y: 81,
                    width: 25,
                    height: 30,
                },

                qrImage: {
                    image: result.qrimage || "",
                    x: 87,
                    y: 90,
                    width: 25,
                    height: 25,
                },

                enrollmentNo: {
                    text: result.enrollmentNo || "",
                    x: 32.5,
                    y: 22.1,
                    align: "left",
                    maxWidth: 40,
                    fontSize: 10,
                    fontStyle: "bold",
                    fontFamily: "Arial",
                },
            };

            // ==========================================
            // BACKGROUND
            // ==========================================
            const backgroundImage = await loadImage(
                "/assets/Documents/AuthorityLetter.jpeg"
            );

            // ==========================================
            // CREATE PDF — A4
            // ==========================================
            const pdf = new jsPDF({
                orientation: "portrait",
                unit: "mm",
                format: [PAGE_WIDTH, PAGE_HEIGHT],
                compress: true,
            });

            // ==========================================
            // BACKGROUND IMAGE — ✅ Margin ke saath (border safe)
            // ==========================================
            pdf.addImage(
                backgroundImage,
                "JPEG",
                PRINT_MARGIN,          // ✅ x = 5 mm
                PRINT_MARGIN,          // ✅ y = 5 mm
                INNER_WIDTH,           // ✅ width = 200 mm
                INNER_HEIGHT,          // ✅ height = 287 mm
                undefined,
                "FAST"
            );

            // ==========================================
            // STUDENT IMAGE
            // ==========================================
            await drawImage(pdf, FIELDS.selfImage, "Student Image");

            // ==========================================
            // QR IMAGE
            // ==========================================
            await drawImage(pdf, FIELDS.qrImage, "QR Image");

            // ==========================================
            // TEXT
            // ==========================================
            [
                FIELDS.name,
                FIELDS.fatherName,
                FIELDS.centreName,
                FIELDS.entityType,
                FIELDS.address,
                FIELDS.endDate,
                FIELDS.enrollmentNo,
                FIELDS.fatherName1,
                FIELDS.relacition,
            ].forEach((field) => {
                drawText(pdf, field);
            });

            // ==========================================
            // PDF BLOB
            // ==========================================
            const pdfBlob = pdf.output("blob");
            const pdfUrl = URL.createObjectURL(pdfBlob);

            // ==========================================
            // OPEN PDF
            // ==========================================
            const newTab = window.open(pdfUrl, "_blank");

            if (!newTab) {
                URL.revokeObjectURL(pdfUrl);
                alert(
                    "Popup blocked hai. Browser mein popup allow karo."
                );
                return;
            }

            // ==========================================
            // CHECK PDF TAB CLOSED
            // ==========================================
            const checkPdfClosed = setInterval(() => {
                if (newTab.closed) {
                    clearInterval(checkPdfClosed);
                    URL.revokeObjectURL(pdfUrl);
                    navigate(-1);
                }
            }, 500);

            // ==========================================
            // CLEANUP
            // ==========================================
            setTimeout(() => {
                clearInterval(checkPdfClosed);
                URL.revokeObjectURL(pdfUrl);
            }, 60 * 60 * 1000);
        } catch (error) {
            console.error("Authority Letter PDF Error:", error);

            alert(
                error?.message ||
                "Authority Letter PDF banane mein error aa gaya."
            );
        }
    };

    // ==========================================
    // NO UI
    // ==========================================
    return null;
};

export default AuthorityLetterPrint;