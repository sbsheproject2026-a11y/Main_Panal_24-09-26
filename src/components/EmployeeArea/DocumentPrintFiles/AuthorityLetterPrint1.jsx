 import React, { useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import { printAuthorityLetterApi } from "../../AllServicesFiles/AdminStudentService";
 

const AuthorityLetterPrint1 = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const printedId = useRef(null);

    const PAGE_WIDTH = 210;
    const PAGE_HEIGHT = 297;

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
                reject(
                    new Error("Image URL/Base64 empty hai.")
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
    const drawImage = async (
        pdf,
        field,
        imageName
    ) => {
        if (!field?.image) return;

        try {
            const image = await loadImage(
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
                "NONE"
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
    const createHindiTextImage = (
        field
    ) => {
        const text =
            String(
                field?.text || ""
            ).trim();

        if (!text) return null;

        const scale =
            TEXT_SCALE;

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
                    alpha: true,
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
                    alpha: true,
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
                canvas.height,
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
            "NONE"
        );
    };

    // ==========================================
    // DRAW ENGLISH TEXT
    // ==========================================
    const drawEnglishText = (
        pdf,
        field
    ) => {
        if (!field?.text)
            return;

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
                    "left",
            }
        );
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

            // ✅ Line height (mm) — field.lineHeight se control
            // 2 = tight, 2.5 = balanced, 3 = comfortable
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
    const printAuthorityLetter =
        async (authorityId) => {
            try {
                const result =
                    await printAuthorityLetterApi(
                        authorityId
                    );

                if (!result) {
                    alert(
                        "Authority Letter data nahi mila."
                    );

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
                    fontSize: 14,
                    fontStyle: "bold",
                    wrapWords: 5,      // 👈 8 se 5 kiya — jaldi wrap hoga
                    lineHeight: 2.5,   // 👈 same as address
                    fontFamily: "Arial",
                },

                    address: {
                        text: result.address || "",
                        x: 18,
                        y: 49.8,
                        align: "left",
                        maxWidth: 100,
                        fontSize: 14,
                        fontStyle: "bold",
                        fontFamily: "Arial",
                        wrapWords: 7,     // 👈 5 words per line
                        lineHeight: 2,  // 👈 mm gap (adjust karo)
                    },
                    centreName: {
                        text: result.centreName || "",
                        x: 18,
                        y: 58,
                        align: "left",
                        maxWidth: 100,
                        fontSize: 14,
                        fontStyle: "bold",
                        fontFamily: "Arial",
                        wrapWords: 7,     // 👈 5 words per line
                        lineHeight: 2,  // 👈 mm gap (adjust karo)
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
                        y: 40,
                        align: "center",
                        maxWidth: 100,
                        fontSize: 30,
                        fontStyle: "bold",
                        fontFamily: "Arial",
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
                        y: 22.4,
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
                const backgroundImage =
                    await loadImage(
                        "/assets/Documents/AuthorityLetter.jpeg"
                    );

                // ==========================================
                // CREATE PDF
                // ==========================================
                const pdf =
                    new jsPDF({
                        orientation: "portrait",
                        unit: "mm",
                        format: "a4",
                        compress: false,
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
                    "NONE"
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
                // TEXT
                // ==========================================
                [
                    FIELDS.name,
                    FIELDS.fatherName,
                    FIELDS.address,
                    FIELDS.centreName,
                    FIELDS.endDate,
                    FIELDS.enrollmentNo,
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
                    pdf.output("blob");

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
                            if (newTab.closed) {
                                clearInterval(
                                    checkPdfClosed
                                );

                                URL.revokeObjectURL(
                                    pdfUrl
                                );

                                // Previous page
                                navigate(-1);
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

export default AuthorityLetterPrint1;