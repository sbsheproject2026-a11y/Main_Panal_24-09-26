 import React, { useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import { printDiplomaApi } from "../../AllServicesFiles/AdminStudentService";

const DiplomaPrint = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const printedId = useRef(null);

    // ✅ Custom size — 200 x 283 (A4 ratio maintain)
    const PAGE_WIDTH = 200;
    const PAGE_HEIGHT = 283;

    const FONT_SIZE = 18;
    const TEXT_SCALE = 4;
    const FONT_COLOR = "#000000";

    useEffect(() => {
        if (!id || printedId.current === id) return;

        printedId.current = id;
        printDiploma(id);
    }, [id]);

    const loadImage = (src) => {
        return new Promise((resolve, reject) => {
            if (!src) {
                reject(
                    new Error(
                        "Image URL/Base64 empty hai."
                    )
                );
                return;
            }

            const image = new Image();

            image.crossOrigin = "anonymous";

            image.onload = () => {
                resolve(image);
            };

            image.onerror = () => {
                reject(
                    new Error(
                        `Image load nahi hui: ${src.substring(
                            0,
                            100
                        )}`
                    )
                );
            };

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

    const drawImage = async (
        pdf,
        field,
        imageName
    ) => {
        if (!field?.image) return;

        try {
            const image =
                await loadImage(
                    field.image
                );

            const x =
                (field.x / 100) *
                PAGE_WIDTH;

            const y =
                (field.y / 100) *
                PAGE_HEIGHT;

            const width =
                field.width || 25;

            const height =
                field.height || 25;

            pdf.addImage(
                image,
                getImageFormat(
                    field.image
                ),
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
    // HINDI TEXT IMAGE
    // ==========================================
    const createHindiTextImage = (
        field
    ) => {
        const text =
            String(
                field?.text || ""
            ).trim();

        if (!text) return null;

        const scale = TEXT_SCALE;

        const fontSize =
            (field.fontSize ||
                FONT_SIZE) *
            scale;

        const maxWidthMm =
            field.maxWidth ||
            100;

        const maxWidthPx =
            maxWidthMm *
            3.779527559 *
            scale;

        const canvas =
            document.createElement(
                "canvas"
            );

        const ctx =
            canvas.getContext(
                "2d",
                {
                    alpha: true
                }
            );

        if (!ctx) return null;

        const fontFamily =
            field.fontFamily ||
            '"Arial Unicode MS", "Noto Sans Devanagari", "Mangal", sans-serif';

        const fontStyle =
            field.fontStyle ||
            "normal";

        ctx.font =
            `${fontStyle} ${fontSize}px ${fontFamily}`;

        let measuredWidth =
            ctx.measureText(
                text
            ).width;

        let finalFontSize =
            fontSize;

        if (
            measuredWidth >
            maxWidthPx
        ) {
            finalFontSize =
                Math.max(
                    8 * scale,
                    fontSize *
                    (
                        maxWidthPx /
                        measuredWidth
                    )
                );

            ctx.font =
                `${fontStyle} ${finalFontSize}px ${fontFamily}`;

            measuredWidth =
                ctx.measureText(
                    text
                ).width;
        }

        const horizontalPadding =
            8 * scale;

        const verticalPadding =
            20 * scale;

        canvas.width =
            Math.ceil(
                measuredWidth +
                horizontalPadding
            );

        canvas.height =
            Math.ceil(
                finalFontSize +
                verticalPadding
            );

        const drawContext =
            canvas.getContext(
                "2d",
                {
                    alpha: true
                }
            );

        if (!drawContext) {
            return null;
        }

        drawContext.clearRect(
            0,
            0,
            canvas.width,
            canvas.height
        );

        drawContext.font =
            `${fontStyle} ${finalFontSize}px ${fontFamily}`;

        drawContext.fillStyle =
            FONT_COLOR;

        drawContext.textBaseline =
            "alphabetic";

        drawContext.textAlign =
            field.align ||
            "center";

        let drawX =
            canvas.width / 2;

        if (
            field.align ===
            "left"
        ) {
            drawX =
                horizontalPadding /
                2;
        }

        if (
            field.align ===
            "right"
        ) {
            drawX =
                canvas.width -
                horizontalPadding /
                2;
        }

        const drawY =
            canvas.height / 2 +
            finalFontSize / 3;

        drawContext.fillText(
            text,
            drawX,
            drawY
        );

        return {
            image:
                canvas.toDataURL(
                    "image/png"
                ),
            width:
                canvas.width,
            height:
                canvas.height
        };
    };

    // ==========================================
    // DRAW HINDI TEXT
    // ==========================================
    const drawHindiText = (
        pdf,
        field
    ) => {
        const textImage =
            createHindiTextImage(
                field
            );

        if (!textImage) return;

        const x =
            (field.x / 100) *
            PAGE_WIDTH;

        const y =
            (field.y / 100) *
            PAGE_HEIGHT;

        const pixelToMm =
            25.4 /
            (96 * TEXT_SCALE);

        let imageWidth =
            textImage.width *
            pixelToMm;

        let imageHeight =
            textImage.height *
            pixelToMm;

        const maxWidth =
            Math.min(
                field.maxWidth ||
                PAGE_WIDTH,
                PAGE_WIDTH
            );

        if (
            imageWidth >
            maxWidth
        ) {
            const ratio =
                maxWidth /
                imageWidth;

            imageWidth =
                maxWidth;

            imageHeight *=
                ratio;
        }

        let drawX = x;

        if (
            field.align ===
            "center"
        ) {
            drawX =
                x -
                imageWidth / 2;
        } else if (
            field.align ===
            "right"
        ) {
            drawX =
                x -
                imageWidth;
        }

        pdf.addImage(
            textImage.image,
            "PNG",
            drawX,
            y -
            imageHeight / 2,
            imageWidth,
            imageHeight,
            undefined,
            "FAST"
        );
    };

    // ==========================================
    // DRAW ENGLISH TEXT
    // ==========================================
    const drawEnglishText = (
        pdf,
        field
    ) => {
        if (!field?.text) return;

        const text =
            String(
                field.text
            ).trim();

        if (!text) return;

        const x =
            (field.x / 100) *
            PAGE_WIDTH;

        const y =
            (field.y / 100) *
            PAGE_HEIGHT;

        const fontSize =
            field.fontSize ||
            FONT_SIZE;

        const fontStyle =
            field.fontStyle ||
            "normal";

        pdf.setFont(
            "helvetica",
            fontStyle ===
                "bold"
                ? "bold"
                : "normal"
        );

        pdf.setFontSize(
            fontSize
        );

        pdf.setTextColor(
            0,
            0,
            0
        );

        pdf.text(
            text,
            x,
            y,
            {
                align:
                    field.align ||
                    "left"
            }
        );
    };

    // ==========================================
    // DRAW TEXT
    // ==========================================
    const drawText = (
        pdf,
        field
    ) => {
        if (!field?.text) return;

        const text =
            String(
                field.text
            ).trim();

        if (!text) return;

        if (
            isHindiText(text)
        ) {
            drawHindiText(
                pdf,
                field
            );
        } else {
            drawEnglishText(
                pdf,
                field
            );
        }
    };

    // ==========================================
    // PRINT DIPLOMA
    // ==========================================
    const printDiploma = async (
        studentId
    ) => {
        try {
            const result =
                await printDiplomaApi(
                    studentId
                );

            if (!result) {
                alert(
                    "Diploma data nahi mila."
                );

                navigate(
                    "/confirm-addmissions"
                );

                return;
            }

            // ==========================================
            // FIELDS
            // ==========================================
            const FIELDS = {
                name: {
                    text:
                        result.name ||
                        "",
                    x: 50,
                    y: 63.5,
                    align: "center",
                    maxWidth: 100,
                    fontSize: 14,
                    fontStyle: "bold",
                    fontFamily:
                        "Arial"
                },

                studentNameHindi: {
                    text:
                        result.studentNameHindi ||
                        "",
                    x: 50,
                    y: 36.5,
                    align: "center",
                    maxWidth: 100,
                    fontSize: 18,
                    fontStyle: "bold",
                    fontFamily:
                        '"Arial Unicode MS", "Noto Sans Devanagari", "Mangal", sans-serif'
                },

                courseNameHindi: {
                    text:
                        result.courseNameHindi ||
                        "",
                    x: 50,
                    y: 41.2,
                    align: "center",
                    maxWidth: 100,
                    fontSize: 18,
                    fontStyle: "bold",
                    fontFamily:
                        '"Arial Unicode MS", "Noto Sans Devanagari", "Mangal", sans-serif'
                },

                courseName: {
                    text:
                        result.courseName ||
                        "",
                    x: 50.5,
                    y: 68.5,
                    align: "center",
                    maxWidth: 75,
                    fontSize: 14,
                    fontStyle: "bold",
                    fontFamily:
                        "Arial"
                },

                certificateName: {
                    text:
                        result.certificateName ||
                        "",
                    x: 50,
                    y: 31,
                    align: "center",
                    maxWidth: 95,
                    fontSize: 26,
                    fontStyle: "bold",
                    fontFamily:
                        "Arial"
                },

                selfImage: {
                    image:
                        result.selfImage ||
                        "",
                    x: 80.1,
                    y: 91,
                    width: 25,
                    height: 30
                },

                qrImage: {
                    image:
                        result.qrimage ||
                        "",
                    x: 80,
                    y: 10,
                    width: 25,
                    height: 25
                },

                enrollmentNo: {
                    text:
                        result.enrollmentNo ||
                        "",
                    x: 34.5,
                    y: 87.9,
                    align: "left",
                    maxWidth: 40,
                    fontSize: 10,
                    fontFamily:
                        "Arial"
                },

                rollNo: {
                    text:
                        result.rollno ||
                        "",
                    x: 29.8,
                    y: 89.7,
                    align: "left",
                    maxWidth: 40,
                    fontSize: 10,
                    fontFamily:
                        "Arial"
                },

                srnoDiploma: {
                    text:
                        result.srnoDiploma ||
                        "",
                    x: 26,
                    y: 7.2,
                    align: "left",
                    maxWidth: 40,
                    fontSize: 10,
                    fontFamily:
                        "Arial"
                },

                issueDate: {
                    text:
                        result.issueDate ||
                        "",
                    x: 21,
                    y: 92,
                    align: "left",
                    maxWidth: 40,
                    fontSize: 10,
                    fontFamily:
                        "Arial"
                },

                issueYear: {
                    text:
                        result.issueYear ||
                        "",
                    x: 44,
                    y: 54.2,
                    align: "center",
                    maxWidth: 30,
                    fontSize: 14,
                    fontStyle: "bold",
                    fontFamily:
                        "Arial"
                },

                issueYear1: {
                    text:
                        result.issueYear ||
                        "",
                    x: 57,
                    y: 77.5,
                    align: "center",
                    maxWidth: 30,
                    fontSize: 14,
                    fontStyle: "bold",
                    fontFamily:
                        "Arial"
                }
            };

            // ==========================================
            // BACKGROUND IMAGE
            // ==========================================
            const backgroundImage =
                await loadImage(
                    "/assets/Documents/DiplomaFile.jpeg"
                );

            // ==========================================
            // PDF — ✅ Custom 200 x 283
            // ==========================================
            const pdf =
                new jsPDF({
                    orientation:
                        "portrait",
                    unit: "mm",
                    format: [
                        PAGE_WIDTH,
                        PAGE_HEIGHT
                    ],
                    compress: true
                });

            // ==========================================
            // ADD BACKGROUND
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
            await drawImage(
                pdf,
                FIELDS.selfImage,
                "Student Image"
            );

            // ==========================================
            // QR IMAGE
            // ==========================================
            await drawImage(
                pdf,
                FIELDS.qrImage,
                "QR Image"
            );

            // ==========================================
            // TEXT FIELDS
            // ==========================================
            [
                FIELDS.certificateName,
                FIELDS.name,
                FIELDS.studentNameHindi,
                FIELDS.courseNameHindi,
                FIELDS.courseName,
                FIELDS.enrollmentNo,
                FIELDS.rollNo,
                FIELDS.srnoDiploma,
                FIELDS.issueDate,
                FIELDS.issueYear,
                FIELDS.issueYear1
            ].forEach(
                (field) => {
                    drawText(
                        pdf,
                        field
                    );
                }
            );

            // ==========================================
            // PDF BLOB
            // ==========================================
            const pdfBlob =
                pdf.output(
                    "blob"
                );

            const pdfUrl =
                URL.createObjectURL(
                    pdfBlob
                );

            // ==========================================
            // OPEN PDF
            // ==========================================
            const newTab =
                window.open(
                    pdfUrl,
                    "_blank"
                );

            if (!newTab) {
                URL.revokeObjectURL(
                    pdfUrl
                );

                alert(
                    "Popup blocked hai. Browser mein popup allow karo."
                );

                return;
            }

            // ==========================================
            // CHECK PDF TAB CLOSED
            // ==========================================
            const checkPdfClosed =
                setInterval(
                    () => {
                        if (
                            newTab.closed
                        ) {
                            clearInterval(
                                checkPdfClosed
                            );

                            URL.revokeObjectURL(
                                pdfUrl
                            );

                            navigate(
                                "/confirm-addmissions"
                            );
                        }
                    },
                    500
                );

            // ==========================================
            // CLEANUP
            // ==========================================
            setTimeout(
                () => {
                    clearInterval(
                        checkPdfClosed
                    );

                    URL.revokeObjectURL(
                        pdfUrl
                    );
                },
                60 * 60 * 1000
            );
        } catch (error) {
            console.error(
                "Diploma PDF Error:",
                error
            );

            alert(
                error?.message ||
                "Diploma PDF banane mein error aa gaya."
            );
        }
    };

    // ==========================================
    // NO UI — sirf null return
    // ==========================================
    return null;
};

export default DiplomaPrint;