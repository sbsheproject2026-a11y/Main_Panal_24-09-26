 import React, { useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import { printDiplomaApi } from "./AdminStudentService";

const MigrationCertificate = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    // React StrictMode double render rokne ke liye
    const printedId = useRef(null);

    // ✅ Custom size — 200 x 283 (A4 ratio maintain)
    const PAGE_WIDTH = 200;
    const PAGE_HEIGHT = 283;

    // =========================================================
    // COMMON FONT SETTINGS
    // =========================================================
    const FONT_SIZE = 16;
    const FONT_FAMILY = "Arial";
    const FONT_WEIGHT = "bold";
    const FONT_STYLE = "normal";
    const FONT_COLOR = "#000000";
    const MIN_FONT_SIZE = 8;

    // =========================================================
    // PAGE LOAD
    // =========================================================
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

    // =========================================================
    // IMAGE FORMAT
    // =========================================================
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

    // =========================================================
    // DRAW IMAGE
    // =========================================================
    const drawImage = async (pdf, field, imageName = "Image") => {
        if (!field?.image) {
            console.log(`${imageName} nahi mili.`);
            return;
        }

        try {
            const image = await loadImage(field.image);

            const x = (field.x / 100) * PAGE_WIDTH;
            const y = (field.y / 100) * PAGE_HEIGHT;

            const width = field.width || 25;
            const height = field.height || 25;

            const format = getImageFormat(field.image);

            pdf.addImage(
                image,
                format,
                x - width / 2,
                y - height / 2,
                width,
                height,
                undefined,
                "FAST"
            );

            console.log(`${imageName} PDF mein add ho gayi.`);
        } catch (error) {
            console.error(
                `${imageName} PDF mein add nahi hui:`,
                error
            );
        }
    };

    // =========================================================
    // CREATE TEXT IMAGE
    // =========================================================
    const createTextImage = (field) => {
        const text = String(field?.text || "").trim();

        if (!text) return null;

        const scale = 4;

        const maxWidthPx =
            (field.maxWidth || 100) * 3.78 * scale;

        let currentFontSize = FONT_SIZE * scale;

        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        let textWidth;

        while (true) {
            ctx.font = `${FONT_STYLE} ${FONT_WEIGHT} ${currentFontSize}px "${FONT_FAMILY}"`;

            textWidth = ctx.measureText(text).width;

            if (textWidth <= maxWidthPx) break;

            currentFontSize -= 0.5 * scale;

            if (currentFontSize <= MIN_FONT_SIZE * scale) {
                currentFontSize = MIN_FONT_SIZE * scale;
                break;
            }
        }

        const padding = 10 * scale;

        const finalWidth = Math.min(
            textWidth + padding,
            maxWidthPx
        );

        const finalHeight = currentFontSize * 1.8;

        canvas.width = Math.max(finalWidth, 20 * scale);
        canvas.height = finalHeight;

        ctx.font = `${FONT_STYLE} ${FONT_WEIGHT} ${currentFontSize}px "${FONT_FAMILY}"`;
        ctx.fillStyle = FONT_COLOR;
        ctx.textBaseline = "middle";
        ctx.textAlign = field.align || "left";

        let drawX;

        if (field.align === "center") {
            drawX = canvas.width / 2;
        } else if (field.align === "right") {
            drawX = canvas.width - padding / 2;
        } else {
            drawX = padding / 2;
        }

        ctx.fillText(text, drawX, canvas.height / 2);

        return {
            image: canvas.toDataURL("image/png"),
            width: canvas.width / scale,
            height: canvas.height / scale,
            fontSize: currentFontSize / scale,
        };
    };

    // =========================================================
    // DRAW TEXT
    // =========================================================
    const drawText = (pdf, field) => {
        if (!field?.text) return;

        const textData = createTextImage(field);
        if (!textData) return;

        const x = (field.x / 100) * PAGE_WIDTH;
        const y = (field.y / 100) * PAGE_HEIGHT;

        const imageWidth = textData.width / 3.78;
        const imageHeight = textData.height / 3.78;

        let drawX = x;

        if (field.align === "center") {
            drawX = x - imageWidth / 2;
        } else if (field.align === "right") {
            drawX = x - imageWidth;
        }

        pdf.addImage(
            textData.image,
            "PNG",
            drawX,
            y - imageHeight / 2,
            imageWidth,
            imageHeight,
            undefined,
            "FAST"
        );
    };

    // =========================================================
    // PRINT MIGRATION CERTIFICATE
    // =========================================================
    const printDiploma = async (studentId) => {
        try {
            console.log("Migration Certificate Print ID:", studentId);

            const result = await printDiplomaApi(studentId);

            if (!result) {
                alert("Migration Certificate data nahi mila.");
                navigate("/confirm-addmissions");
                return;
            }

            // =====================================================
            // FIELDS
            // =====================================================
            const FIELDS = {
                firstName: {
                    text: result.firstName || "",
                    x: 40,
                    y: 42.5,
                    fontWeight: FONT_WEIGHT,
                    align: "left",
                    maxWidth: 75,
                },

                fatherName: {
                    text: result.fatherName || "",
                    x: 26,
                    y: 46.4,
                    align: "left",
                    maxWidth: 75,
                },

                courseName: {
                    text: result.courseName || "",
                    x: 19,
                    y: 50.5,
                    align: "left",
                    maxWidth: 75,
                },

                departmentName: {
                    text: result.departmentName || "",
                    x: 33,
                    y: 54.5,
                    align: "left",
                    maxWidth: 75,
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
                    x: 69,
                    y: 58.6,
                    align: "left",
                    maxWidth: 100,
                },

                endDate: {
                    text: result.endDate || "",
                    x: 28,
                    y: 58.6,
                    align: "left",
                    maxWidth: 40,
                },

                centreName: {
                    text: result.centreName || "",
                    x: 22,
                    y: 62.6,
                    align: "left",
                    maxWidth: 100,
                },

                migrationSrno: {
                    text: result.migrationSrno || "",
                    x: 12,
                    y: 4.2,
                    align: "left",
                    maxWidth: 40,
                },

                issueDate: {
                    text: result.issueDate || "",
                    x: 18,
                    y: 84.5,
                    align: "left",
                    maxWidth: 40,
                },
            };

            // =====================================================
            // BACKGROUND
            // =====================================================
            const backgroundImage = await loadImage(
                "/assets/Documents/Mig.jpeg"
            );

            // =====================================================
            // CREATE PDF — ✅ Custom 200 x 283
            // =====================================================
            const pdf = new jsPDF({
                orientation: "portrait",
                unit: "mm",
                format: [PAGE_WIDTH, PAGE_HEIGHT],
                compress: true,
            });

            // =====================================================
            // BACKGROUND
            // =====================================================
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

            // =====================================================
            // STUDENT IMAGE
            // =====================================================
            await drawImage(pdf, FIELDS.selfImage, "Student Image");

            // =====================================================
            // TEXT
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
                alert(
                    "Popup blocked hai. Browser mein popup allow karo."
                );
                return;
            }

            // =====================================================
            // PDF TAB CLOSE CHECK
            // =====================================================
            const checkPdfClosed = setInterval(() => {
                if (newTab.closed) {
                    clearInterval(checkPdfClosed);
                    URL.revokeObjectURL(pdfUrl);
                    navigate("/confirm-addmissions");
                }
            }, 500);

            // =====================================================
            // SAFETY CLEANUP
            // =====================================================
            setTimeout(() => {
                clearInterval(checkPdfClosed);
                URL.revokeObjectURL(pdfUrl);
            }, 60 * 60 * 1000);
        } catch (error) {
            console.error(
                "Migration Certificate PDF Error:",
                error
            );

            alert(
                error?.message ||
                "Migration Certificate PDF banane mein error aa gaya."
            );
        }
    };

    // =========================================================
    // NO UI — sirf null return
    // =========================================================
    return null;
};

export default MigrationCertificate;