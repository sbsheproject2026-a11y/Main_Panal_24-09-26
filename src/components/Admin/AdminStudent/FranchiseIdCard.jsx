 import React, { useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import { printAuthorityLetterApi } from "./AdminStudentService";
 


const FranchiseIdCard = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const printedId = useRef(null);

    const PAGE_WIDTH = 280;
    const PAGE_HEIGHT = 180;

    const FONT_SIZE = 18;
    const TEXT_SCALE = 4;
    const FONT_COLOR = "#000000";
    const MIN_FONT_SIZE = 8;

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
    // SPLIT TEXT INTO LINES — words ke hisaab se
    // ==========================================
    const splitIntoLines = (text, wrapWords) => {
        if (!text) return [];

        if (!wrapWords || wrapWords <= 0) {
            return [text];
        }

        const words = String(text).split(/\s+/);
        const lines = [];

        for (let i = 0; i < words.length; i += wrapWords) {
            lines.push(words.slice(i, i + wrapWords).join(" "));
        }

        return lines;
    };

    // ==========================================
    // DRAW IMAGE
    // ==========================================
    const drawImage = async (pdf, field, imageName) => {
        if (!field?.image) return;

        try {
            const image = await loadImage(field.image);

            const x = (field.x / 100) * PAGE_WIDTH;
            const y = (field.y / 100) * PAGE_HEIGHT;

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
    // CREATE HINDI TEXT IMAGE (Multi-line)
    // ==========================================
    const createHindiTextImage = (field) => {
        const rawText = String(field?.text || "").trim();

        if (!rawText) return null;

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

        // ✅ Multi-line banao
        const lines = splitIntoLines(rawText, field.wrapWords);

        // ✅ Auto font size
        let finalFontSize = fontSize;
        let maxMeasuredWidth = 0;

        while (true) {
            ctx.font = `${fontStyle} ${finalFontSize}px ${fontFamily}`;

            maxMeasuredWidth = 0;
            lines.forEach((line) => {
                const w = ctx.measureText(line).width;
                if (w > maxMeasuredWidth) maxMeasuredWidth = w;
            });

            if (maxMeasuredWidth <= maxWidthPx) break;

            finalFontSize -= 0.5 * scale;

            if (finalFontSize <= MIN_FONT_SIZE * scale) {
                finalFontSize = MIN_FONT_SIZE * scale;
                break;
            }
        }

        const horizontalPadding = 8 * scale;
        const verticalPadding = 20 * scale;
        const lineHeight = finalFontSize * (field.lineHeight || 1.3);

        canvas.width = Math.ceil(maxMeasuredWidth + horizontalPadding);
        canvas.height = Math.ceil(
            lineHeight * lines.length + verticalPadding
        );

        const drawContext = canvas.getContext("2d", { alpha: true });

        if (!drawContext) return null;

        drawContext.clearRect(0, 0, canvas.width, canvas.height);

        drawContext.font = `${fontStyle} ${finalFontSize}px ${fontFamily}`;
        drawContext.fillStyle = FONT_COLOR;
        drawContext.textBaseline = "middle";
        drawContext.textAlign = field.align || "center";

        lines.forEach((line, index) => {
            let drawX = canvas.width / 2;

            if (field.align === "left") {
                drawX = horizontalPadding / 2;
            } else if (field.align === "right") {
                drawX = canvas.width - horizontalPadding / 2;
            }

            const drawY =
                verticalPadding / 2 +
                lineHeight * index +
                lineHeight / 2;

            drawContext.fillText(line, drawX, drawY);
        });

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

        const x = (field.x / 100) * PAGE_WIDTH;
        const y = (field.y / 100) * PAGE_HEIGHT;

        const pixelToMm = 25.4 / (96 * TEXT_SCALE);

        let imageWidth = textImage.width * pixelToMm;
        let imageHeight = textImage.height * pixelToMm;

        const maxWidth = Math.min(
            field.maxWidth || PAGE_WIDTH,
            PAGE_WIDTH
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
    // DRAW ENGLISH TEXT (Multi-line)
    // ==========================================
    const drawEnglishText = (pdf, field) => {
        if (!field?.text) return;

        const text = String(field.text).trim();

        if (!text) return;

        const x = (field.x / 100) * PAGE_WIDTH;
        const y = (field.y / 100) * PAGE_HEIGHT;

        const fontSize = field.fontSize || FONT_SIZE;
        const fontStyle = field.fontStyle || "normal";
        const maxWidth = field.maxWidth || PAGE_WIDTH;

        pdf.setFont(
            "helvetica",
            fontStyle === "bold" ? "bold" : "normal"
        );

        pdf.setFontSize(fontSize);
        pdf.setTextColor(0, 0, 0);

        // ✅ Split into lines
        let lines = [text];

        if (field.wrapWords && field.wrapWords > 0) {
            lines = splitIntoLines(text, field.wrapWords);
        } else {
            lines = pdf.splitTextToSize(text, maxWidth);
        }

        pdf.text(lines, x, y, {
            align: field.align || "left",
            lineHeightFactor: field.lineHeight || 1.2,
        });
    };

    // ==========================================
    // DRAW TEXT
    // ==========================================
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
                    x: 25,
                    y: 48,
                    align: "center",
                    maxWidth: 100,
                    fontSize: 12,
                    fontStyle: "bold",
                    fontFamily: "Arial",
                    wrapWords: 6,
                    lineHeight: 1.3,
                },

                address: {
                    text: result.address || "",
                    x: 64.5,
                    y: 33,
                    align: "left",
                    maxWidth: 100,
                    fontSize: 12,
                    fontStyle: "bold",
                    fontFamily: "Arial",
                    wrapWords: 5,
                    lineHeight: 1.3,
                },

                endDate: {
                    text: result.endDate || "",
                    x: 20.5,
                    y: 88,
                    align: "left",
                    maxWidth: 100,
                    fontSize: 10,
                    fontStyle: "bold",
                    fontFamily: "Arial",
                },

                fatherName: {
                    text: result.fatherName || "",
                    x: 25,
                    y: 58,
                    align: "center",
                    maxWidth: 100,
                    fontSize: 14,
                    fontStyle: "bold",
                    fontFamily: "Arial",
                    wrapWords: 3,
                    lineHeight: 1.3,
                    
                },

                selfImage: {
                    image: result.selfImage || "",
                    x: 25,
                    y: 32,
                    width: 35,
                    height: 40,
                },
                stempImage: {
                    image: result.stempImage || "",
                    x: 42,
                    y: 88,
                    width: 20,
                    height: 20,
                },
                singhImage: {
                    image: result.singhImage || "",
                    x: 42,
                    y: 88,
                    width: 20,
                    height: 20,
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
                    x: 20.5,
                    y: 66.3,
                    align: "left",
                    maxWidth: 40,
                    fontSize: 10,
                    fontStyle: "bold",
                    fontFamily: "Arial",
                },
                email: {
                    text: result.email || "",
                    x: 20.5,
                    y: 71.3,
                    align: "left",
                    maxWidth: 50,
                    fontSize: 10,
                    fontStyle: "bold",
                    fontFamily: "Arial",
                },
                mobileNo: {
                    text: result.mobileNo || "",
                    x: 20.5,
                    y: 77,
                    align: "left",
                    maxWidth: 40,
                    fontSize: 10,
                    fontStyle: "bold",
                    fontFamily: "Arial",
                },
                districtName: {
                    text: result.districtName || "",
                    x: 20.5,
                    y: 82.3,
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
                "/assets/Documents/AuthorisedIDCard.jpeg"
            );

            // ==========================================
            // CREATE PDF
            // ==========================================
            const pdf = new jsPDF({
                orientation: "landscape",
                unit: "mm",
                format: [PAGE_WIDTH, PAGE_HEIGHT],
                compress: true,
            });

            // ==========================================
            // BACKGROUND IMAGE
            // ==========================================
            pdf.addImage(
                backgroundImage,
                "JPEG",
                0,
                0,
                PAGE_WIDTH,
                PAGE_HEIGHT,
                undefined,
                "FAST"
            );

            // ==========================================
            // STUDENT IMAGE
            // ==========================================
            await drawImage(pdf, FIELDS.selfImage, "Student Image");
            await drawImage(pdf, FIELDS.stempImage, "stempImage Image");
            await drawImage(pdf, FIELDS.singhImage, "singhImage Image");

            // ==========================================
            // QR IMAGE
            // ==========================================
            // await drawImage(pdf, FIELDS.qrImage, "QR Image");

            // ==========================================
            // TEXT
            // ==========================================
            [
                FIELDS.name,
                FIELDS.fatherName,
                FIELDS.address,
                FIELDS.endDate,
                FIELDS.enrollmentNo,
                FIELDS.email,
                FIELDS.email,
                FIELDS.mobileNo,
                FIELDS.districtName,
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
            console.error(
                "Authority Letter PDF Error:",
                error
            );

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

export default FranchiseIdCard;