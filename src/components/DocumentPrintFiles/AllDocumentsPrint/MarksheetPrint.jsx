 import React, { useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import { printMarksheetApi } from "../../AllServicesFiles/AdminStudentService";

const MarksheetPrint = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const printedId = useRef(null);

    // ✅ BADA size — A3 (297 x 420 mm)
    const PAGE_WIDTH = 297;
    const PAGE_HEIGHT = 420;

    const PRINT_MARGIN = 5;

    const CONTENT_WIDTH = PAGE_WIDTH - PRINT_MARGIN * 2;   // 287
    const CONTENT_HEIGHT = PAGE_HEIGHT - PRINT_MARGIN * 2; // 410

    // =========================================================
    // COMMON TEXT SETTINGS
    // =========================================================
    const FONT_SIZE = 14;
    const FONT_FAMILY = "Times New Roman";
    const FONT_WEIGHT = "bold";
    const FONT_STYLE = "normal";
    const FONT_COLOR = "#000000";
    const MIN_FONT_SIZE = 7;

    // =========================================================
    // ✅ SUBJECT ROW SETTINGS
    // =========================================================
    const SUBJECT_START_Y = 57.5;
    const SUBJECT_ROW_HEIGHT = 2.4;           // normal row height
    const SUBJECT_LINE_HEIGHT = 1.2;          // ⬅️ 1.8 → 1.2 (lines paas aa gayi)
    const SUBJECT_FONT_SIZE = 12;
    const SUBJECT_MAX_WIDTH = 150;
    const SUBJECT_MAX_CHARS_PER_LINE = 55;    // ⬅️ 55 (aapne bola)
    const SUBJECT_MAX_LINES = 2;

    // ✅ Line 1 ko thoda upar shift karo (taaki row ke andar center rahe)
    const SUBJECT_LINE1_OFFSET = -0.6;        // ⬅️ line 1 ko upar shift

    // =========================================================
    // ✅ GO BACK TO PREVIOUS PAGE
    // =========================================================
    const goBackToPreviousPage = () => {
        if (window.history.length > 1) {
            navigate(-1);
        } else {
            const roleId = String(
                localStorage.getItem("RoleId") || ""
            ).trim();

            if (roleId === "5") {
                navigate("/confirm-addmissions", { replace: true });
            } else if (roleId === "33") {
                navigate("/student-print-list", { replace: true });
            } else {
                navigate("/", { replace: true });
            }
        }
    };

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

            const x = PRINT_MARGIN + (field.x / 100) * CONTENT_WIDTH;
            const y = PRINT_MARGIN + (field.y / 100) * CONTENT_HEIGHT;

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

        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        if (!ctx) return null;

        let currentFontSize = field.fontSize
            ? field.fontSize * scale
            : FONT_SIZE * scale;

        const fontFamily = field.fontFamily || FONT_FAMILY;
        const fontWeight = field.fontWeight || FONT_WEIGHT;
        const fontStyle = field.fontStyle || FONT_STYLE;

        const maxWidthMm = field.maxWidth || 100;
        const maxWidthPx = maxWidthMm * 3.78 * scale;

        let textWidth = 0;

        if (field.noShrink) {
            ctx.font = `${fontStyle} ${fontWeight} ${currentFontSize}px "${fontFamily}"`;
            textWidth = ctx.measureText(text).width;
        } else {
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
        }

        const horizontalPadding = 8 * scale;
        const verticalPadding = 5 * scale;

        const finalWidth = Math.min(
            textWidth + horizontalPadding,
            maxWidthPx + horizontalPadding
        );

        const finalHeight = currentFontSize * 1.8 + verticalPadding;

        canvas.width = Math.ceil(finalWidth);
        canvas.height = Math.ceil(finalHeight);

        ctx.font = `${fontStyle} ${fontWeight} ${currentFontSize}px "${fontFamily}"`;
        ctx.fillStyle = field.color || FONT_COLOR;
        ctx.textBaseline = "middle";
        ctx.textAlign = field.align || "center";

        let drawX;

        if (field.align === "left") {
            drawX = horizontalPadding / 2;
        } else if (field.align === "right") {
            drawX = canvas.width - horizontalPadding / 2;
        } else {
            drawX = canvas.width / 2;
        }

        ctx.fillText(text, drawX, canvas.height / 2);

        return {
            image: canvas.toDataURL("image/png"),
            width: canvas.width,
            height: canvas.height,
            scale,
        };
    };

    // =========================================================
    // DRAW TEXT
    // =========================================================
    const drawText = (pdf, field) => {
        if (!field?.text) return;

        const textData = createTextImage(field);
        if (!textData) return;

        const x = PRINT_MARGIN + (field.x / 100) * CONTENT_WIDTH;
        const y = PRINT_MARGIN + (field.y / 100) * CONTENT_HEIGHT;

        const imageWidth = (textData.width / textData.scale) / 3.78;
        const imageHeight = (textData.height / textData.scale) / 3.78;

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
    // ✅ DRAW WRAPPED TEXT (character-based)
    // =========================================================
    const drawWrappedText = (pdf, field, options = {}) => {
        if (!field?.text) return 0;

        const text = String(field.text).trim();
        if (!text) return 0;

        const {
            maxCharsPerLine = SUBJECT_MAX_CHARS_PER_LINE,
            lineHeightPercent = SUBJECT_LINE_HEIGHT,
            maxLines = SUBJECT_MAX_LINES,
        } = options;

        const words = text.split(/\s+/).filter(Boolean);

        const lines = [];
        let currentLine = "";
        let currentLength = 0;

        words.forEach((word) => {
            const wordLength = word.length;
            const spaceNeeded = currentLine ? 1 : 0;

            if (
                currentLength + wordLength + spaceNeeded <=
                maxCharsPerLine
            ) {
                currentLine += (currentLine ? " " : "") + word;
                currentLength += wordLength + spaceNeeded;
            } else {
                if (currentLine) {
                    lines.push(currentLine);
                }
                currentLine = word;
                currentLength = wordLength;
            }
        });

        if (currentLine) {
            lines.push(currentLine);
        }

        const finalLines = lines.slice(0, maxLines);

        // ✅ Har line draw karo — 2 lines ho toh row ke andar center karo
        const totalLines = finalLines.length;

        finalLines.forEach((lineText, index) => {
            // ✅ Line 1 thoda upar, Line 2 thoda neeche (same row me fit)
            // 2 lines ke liye: line1 = y + offset, line2 = y + offset + lineHeight
            let lineY = field.y + index * lineHeightPercent;

            // Agar 2 lines hain toh dono ko thoda upar shift karo
            // taaki row ke andar center rahen
            if (totalLines === 2) {
                lineY += SUBJECT_LINE1_OFFSET;
            }

            drawText(pdf, {
                ...field,
                text: lineText,
                y: lineY,
                noShrink: true,
            });
        });

        return finalLines.length;
    };

    // =========================================================
    // ✅ DRAW SUBJECTS
    // =========================================================
    const drawSubjects = (pdf, subjects) => {
        if (!Array.isArray(subjects)) return;

        const validSubjects = subjects.filter(
            (item) => item?.code && item?.name
        );

        let cumulativeY = SUBJECT_START_Y;

        validSubjects.forEach((subject, index) => {
            const y = cumulativeY;

            // ✅ Subject Name — WRAPPED
            const linesUsed = drawWrappedText(
                pdf,
                {
                    text: subject.name,
                    x: 15,
                    y,
                    fontSize: SUBJECT_FONT_SIZE,
                    fontFamily: "Arial",
                    fontWeight: "normal",
                    fontStyle: FONT_STYLE,
                    color: FONT_COLOR,
                    align: "left",
                    maxWidth: SUBJECT_MAX_WIDTH,
                },
                {
                    maxCharsPerLine: SUBJECT_MAX_CHARS_PER_LINE,
                    lineHeightPercent: SUBJECT_LINE_HEIGHT,
                    maxLines: SUBJECT_MAX_LINES,
                }
            );

            // ✅ Baaki columns — sab `y` pe hi rahenge (line 1 ke saath)
            drawText(pdf, {
                text: subject.code,
                x: 11,
                y,
                fontSize: 12,
                fontFamily: "Arial",
                fontWeight: "normal",
                fontStyle: FONT_STYLE,
                color: FONT_COLOR,
                align: "center",
                maxWidth: 30,
            });

            drawText(pdf, {
                text: subject.maxMarks || "",
                x: 49,
                y,
                fontSize: 12,
                fontFamily: "Arial",
                fontWeight: "normal",
                fontStyle: FONT_STYLE,
                color: FONT_COLOR,
                align: "center",
                maxWidth: 30,
            });

            drawText(pdf, {
                text: subject.theoryMarks || "",
                x: 56,
                y,
                fontSize: 12,
                fontFamily: "Arial",
                fontWeight: "normal",
                fontStyle: FONT_STYLE,
                color: FONT_COLOR,
                align: "center",
                maxWidth: 30,
            });

            drawText(pdf, {
                text: subject.practicalMarks || "",
                x: 63,
                y,
                fontSize: 12,
                fontFamily: "Arial",
                fontWeight: "normal",
                fontStyle: FONT_STYLE,
                color: FONT_COLOR,
                align: "center",
                maxWidth: 30,
            });

            drawText(pdf, {
                text: subject.assignmentMarks || "",
                x: 71,
                y,
                fontSize: 12,
                fontFamily: "Arial",
                fontWeight: "normal",
                fontStyle: FONT_STYLE,
                color: FONT_COLOR,
                align: "center",
                maxWidth: 30,
            });

            drawText(pdf, {
                text: subject.totalMarks || "",
                x: 78,
                y,
                fontSize: 12,
                fontFamily: "Arial",
                fontWeight: "normal",
                fontStyle: FONT_STYLE,
                color: FONT_COLOR,
                align: "center",
                maxWidth: 30,
            });

            drawText(pdf, {
                text: subject.grade?.trim() || "",
                x: 87,
                y,
                fontSize: 12,
                fontFamily: "Arial",
                fontWeight: "normal",
                fontStyle: FONT_STYLE,
                color: FONT_COLOR,
                align: "center",
                maxWidth: 40,
            });

            // ✅ Agli row ke liye y calculate karo (dynamic)
            const extraLines = linesUsed - 1;
            const rowHeight =
                extraLines > 0
                    ? SUBJECT_ROW_HEIGHT +
                      extraLines * SUBJECT_LINE_HEIGHT
                    : SUBJECT_ROW_HEIGHT;

            cumulativeY += rowHeight;
        });
    };

    // =========================================================
    // PRINT MARKSHEET
    // =========================================================
    const printDiploma = async (studentId) => {
        try {
            console.log("Marksheet Print ID:", studentId);

            const result = await printMarksheetApi(studentId);

            if (!result) {
                alert("Marksheet data nahi mila.");
                goBackToPreviousPage();
                return;
            }

            console.log("Marksheet Data:", result);

            const FIELDS = {
                name: {
                    text: result.name || "",
                    x: 14,
                    y: 33.9,
                    fontSize: FONT_SIZE,
                    fontFamily: FONT_FAMILY,
                    fontWeight: FONT_WEIGHT,
                    fontStyle: FONT_STYLE,
                    color: FONT_COLOR,
                    align: "left",
                    maxWidth: 100,
                },
                session: {
                    text: result.session || "",
                    x: 66,
                    y: 33.9,
                    fontSize: FONT_SIZE,
                    fontFamily: FONT_FAMILY,
                    fontWeight: FONT_WEIGHT,
                    fontStyle: FONT_STYLE,
                    color: FONT_COLOR,
                    align: "left",
                    maxWidth: 50,
                },
                fatherName: {
                    text: result.fatherName || "",
                    x: 21,
                    y: 36.3,
                    fontSize: FONT_SIZE,
                    fontFamily: FONT_FAMILY,
                    fontWeight: FONT_WEIGHT,
                    fontStyle: FONT_STYLE,
                    color: FONT_COLOR,
                    align: "left",
                    maxWidth: 100,
                },
                studentYear: {
                    text: result.studentYear || "",
                    x: 67,
                    y: 36.3,
                    fontSize: FONT_SIZE,
                    fontFamily: FONT_FAMILY,
                    fontWeight: FONT_WEIGHT,
                    fontStyle: FONT_STYLE,
                    color: FONT_COLOR,
                    align: "left",
                    maxWidth: 50,
                },
                motherName: {
                    text: result.motherName || "",
                    x: 22,
                    y: 38.7,
                    fontSize: FONT_SIZE,
                    fontFamily: FONT_FAMILY,
                    fontWeight: FONT_WEIGHT,
                    fontStyle: FONT_STYLE,
                    color: FONT_COLOR,
                    align: "left",
                    maxWidth: 100,
                },
                dob: {
                    text: result.dob || "",
                    x: 20,
                    y: 41.1,
                    fontSize: FONT_SIZE,
                    fontFamily: FONT_FAMILY,
                    fontWeight: FONT_WEIGHT,
                    fontStyle: FONT_STYLE,
                    color: FONT_COLOR,
                    align: "left",
                    maxWidth: 50,
                },
                centreName: {
                    text: result.centreName || "",
                    x: 26.5,
                    y: 43.7,
                    fontSize: FONT_SIZE,
                    fontFamily: FONT_FAMILY,
                    fontWeight: FONT_WEIGHT,
                    fontStyle: FONT_STYLE,
                    color: FONT_COLOR,
                    align: "left",
                    maxWidth: 100,
                },
                courseName: {
                    text: result.courseName || "",
                    x: 20,
                    y: 46.3,
                    fontSize: FONT_SIZE,
                    fontFamily: FONT_FAMILY,
                    fontWeight: FONT_WEIGHT,
                    fontStyle: FONT_STYLE,
                    color: FONT_COLOR,
                    align: "left",
                    maxWidth: 75,
                },
                selfImage: {
                    image: result.selfImage || "",
                    x: 85,
                    y: 10,
                    width: 25,
                    height: 30,
                },
                qrImage: {
                    image: result.qrimage || "",
                    x: 50,
                    y: 90,
                    width: 25,
                    height: 25,
                },
                enrollmentNo: {
                    text: result.enrollmentNo || "",
                    x: 72,
                    y: 41,
                    fontSize: FONT_SIZE,
                    fontFamily: FONT_FAMILY,
                    fontWeight: FONT_WEIGHT,
                    fontStyle: FONT_STYLE,
                    color: FONT_COLOR,
                    align: "left",
                    maxWidth: 50,
                },
                rollNo: {
                    text: result.rollno || "",
                    x: 66,
                    y: 38.7,
                    fontSize: FONT_SIZE,
                    fontFamily: FONT_FAMILY,
                    fontWeight: FONT_WEIGHT,
                    fontStyle: FONT_STYLE,
                    color: FONT_COLOR,
                    align: "left",
                    maxWidth: 50,
                },
                srnoDiploma: {
                    text: result.srnoDiploma || "",
                    x: 24,
                    y: 7,
                    fontSize: FONT_SIZE,
                    fontFamily: FONT_FAMILY,
                    fontWeight: FONT_WEIGHT,
                    fontStyle: FONT_STYLE,
                    color: FONT_COLOR,
                    align: "left",
                    maxWidth: 40,
                },
                issueDate: {
                    text: result.issueDate || "",
                    x: 14,
                    y: 94.3,
                    fontSize: FONT_SIZE,
                    fontFamily: FONT_FAMILY,
                    fontWeight: FONT_WEIGHT,
                    fontStyle: FONT_STYLE,
                    color: FONT_COLOR,
                    align: "left",
                    maxWidth: 100,
                },
                maxMarks: {
                    text: result.maxMarks || "",
                    x: 48,
                    y: 79.5,
                    fontSize: FONT_SIZE,
                    fontFamily: FONT_FAMILY,
                    fontWeight: FONT_WEIGHT,
                    fontStyle: FONT_STYLE,
                    color: FONT_COLOR,
                    align: "left",
                    maxWidth: 40,
                },
                totalMarks: {
                    text: result.totalMarks || "",
                    x: 77,
                    y: 79.5,
                    fontSize: FONT_SIZE,
                    fontFamily: FONT_FAMILY,
                    fontWeight: FONT_WEIGHT,
                    fontStyle: FONT_STYLE,
                    color: FONT_COLOR,
                    align: "left",
                    maxWidth: 40,
                },
                result: {
                    text: result.result || "",
                    x: 60,
                    y: 82,
                    fontSize: FONT_SIZE,
                    fontFamily: FONT_FAMILY,
                    fontWeight: FONT_WEIGHT,
                    fontStyle: FONT_STYLE,
                    color: FONT_COLOR,
                    align: "left",
                    maxWidth: 40,
                },
            };

            const backgroundImage = await loadImage(
                "/assets/Documents/marksheet.jpeg"
            );

            const pdf = new jsPDF({
                orientation: "portrait",
                unit: "mm",
                format: [PAGE_WIDTH, PAGE_HEIGHT],
                compress: true,
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

            const textFields = [
                FIELDS.name,
                FIELDS.fatherName,
                FIELDS.motherName,
                FIELDS.dob,
                FIELDS.centreName,
                FIELDS.session,
                FIELDS.studentYear,
                FIELDS.courseName,
                FIELDS.enrollmentNo,
                FIELDS.rollNo,
                FIELDS.srnoDiploma,
                FIELDS.issueDate,
                FIELDS.maxMarks,
                FIELDS.totalMarks,
                FIELDS.result,
            ];

            textFields.forEach((field) => {
                drawText(pdf, field);
            });

            drawSubjects(pdf, result.subjects);

            const pdfBlob = pdf.output("blob");
            const pdfUrl = URL.createObjectURL(pdfBlob);

            const newTab = window.open(pdfUrl, "_blank");

            if (!newTab) {
                URL.revokeObjectURL(pdfUrl);
                alert(
                    "Popup blocked hai. Browser mein popup allow karo."
                );
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
            console.error("Marksheet PDF Error:", error);

            alert(
                error?.message ||
                "Marksheet PDF banane mein error aa gaya."
            );

            goBackToPreviousPage();
        }
    };

    return null;
};

export default MarksheetPrint;