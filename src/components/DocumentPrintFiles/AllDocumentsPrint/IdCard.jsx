 import React, { useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import { printDiplomaApi } from "../../AllServicesFiles/AdminStudentService";

const IdCard = () => {

    const { id } = useParams();
    const navigate = useNavigate();

    // React StrictMode ki wajah se double API/PDF call rokne ke liye
    const printedId = useRef(null);


    // =========================================================
    // ID CARD PAGE SIZE
    // =========================================================

    const PAGE_WIDTH = 250;
    const PAGE_HEIGHT = 100;


    // =========================================================
    // COMMON TEXT SETTINGS
    // =========================================================

    const FONT_SIZE = 14;
    const FONT_FAMILY = "Arial";
    const FONT_WEIGHT = "normal";
    const FONT_STYLE = "normal";
    const FONT_COLOR = "#000000";

    const MIN_FONT_SIZE = 7;


    // =========================================================
    // ✅ WAPAS JANE KE LIYE — Browser History Back
    // =========================================================

    const goBack = () => {
        // Agar browser history mein peeche page hai
        if (window.history.length > 1) {
            navigate(-1);
        } else {
            // Fallback — direct URL case
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

        if (printedId.current === id) {
            return;
        }

        printedId.current = id;

        printIdCard(id);

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

            image.onload = () => {
                resolve(image);
            };

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
                height
            );

            console.log(`${imageName} PDF mein add ho gayi.`);

        }
        catch (error) {

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


        let currentFontSize = FONT_SIZE * scale;

        const fontFamily = FONT_FAMILY;
        const fontWeight = FONT_WEIGHT;
        const fontStyle = FONT_STYLE;


        const maxWidthMm = field.maxWidth || 100;
        const maxWidthPx = maxWidthMm * 3.78 * scale;


        let textWidth = 0;

        while (true) {

            ctx.font = `${fontStyle} ${fontWeight} ${currentFontSize}px "${fontFamily}"`;

            textWidth = ctx.measureText(text).width;

            if (textWidth <= maxWidthPx) {
                break;
            }

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
        }
        else if (field.align === "right") {
            drawX = canvas.width - horizontalPadding / 2;
        }
        else {
            drawX = canvas.width / 2;
        }


        ctx.fillText(text, drawX, canvas.height / 2);


        return {
            image: canvas.toDataURL("image/png"),
            width: canvas.width,
            height: canvas.height,
            scale: scale
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


        const imageWidth = (textData.width / textData.scale) / 3.78;
        const imageHeight = (textData.height / textData.scale) / 3.78;


        let drawX = x;

        if (field.align === "center") {
            drawX = x - imageWidth / 2;
        }
        else if (field.align === "right") {
            drawX = x - imageWidth;
        }


        pdf.addImage(
            textData.image,
            "PNG",
            drawX,
            y - imageHeight / 2,
            imageWidth,
            imageHeight
        );

    };


    // =========================================================
    // PRINT ID CARD
    // =========================================================

    const printIdCard = async (studentId) => {

        try {

            console.log("ID Card Print ID:", studentId);


            const result = await printDiplomaApi(studentId);


            if (!result) {

                alert("Student data nahi mila.");

                // ✅ Wapas usi page pe
                goBack();

                return;
            }


            console.log("ID Card Data:", result);


            const FIELDS = {

                enrollmentNo: {
                    text: result.enrollmentNo || "",
                    x: 11,
                    y: 30,
                    fontSize: FONT_SIZE,
                    fontFamily: FONT_FAMILY,
                    fontWeight: FONT_WEIGHT,
                    fontStyle: FONT_STYLE,
                    color: FONT_COLOR,
                    align: "left",
                    maxWidth: 50
                },

                firstName: {
                    text: result.firstName || "",
                    x: 11,
                    y: 36.5,
                    fontSize: FONT_SIZE,
                    fontFamily: FONT_FAMILY,
                    fontWeight: FONT_WEIGHT,
                    fontStyle: FONT_STYLE,
                    color: FONT_COLOR,
                    align: "left",
                    maxWidth: 50
                },

                fatherName: {
                    text: result.fatherName || "",
                    x: 11,
                    y: 42.8,
                    fontSize: FONT_SIZE,
                    fontFamily: FONT_FAMILY,
                    fontWeight: FONT_WEIGHT,
                    fontStyle: FONT_STYLE,
                    color: FONT_COLOR,
                    align: "left",
                    maxWidth: 50
                },

                motherName: {
                    text: result.motherName || "",
                    x: 11,
                    y: 49.5,
                    fontSize: FONT_SIZE,
                    fontFamily: FONT_FAMILY,
                    fontWeight: FONT_WEIGHT,
                    fontStyle: FONT_STYLE,
                    color: FONT_COLOR,
                    align: "left",
                    maxWidth: 50
                },

                dOB1: {
                    text: result.dOB1 || "",
                    x: 11,
                    y: 56,
                    fontSize: FONT_SIZE,
                    fontFamily: FONT_FAMILY,
                    fontWeight: FONT_WEIGHT,
                    fontStyle: FONT_STYLE,
                    color: FONT_COLOR,
                    align: "left",
                    maxWidth: 50
                },

                courseName: {
                    text: result.courseName || "",
                    x: 11,
                    y: 62.5,
                    fontSize: FONT_SIZE,
                    fontFamily: FONT_FAMILY,
                    fontWeight: FONT_WEIGHT,
                    fontStyle: FONT_STYLE,
                    color: FONT_COLOR,
                    align: "left",
                    maxWidth: 75
                },

                address: {
                    text: result.address || "",
                    x: 11,
                    y: 69,
                    fontSize: FONT_SIZE,
                    fontFamily: FONT_FAMILY,
                    fontWeight: FONT_WEIGHT,
                    fontStyle: FONT_STYLE,
                    color: FONT_COLOR,
                    align: "left",
                    maxWidth: 100
                },

                centreName: {
                    text: result.centreName || "",
                    x: 12.3,
                    y: 90,
                    fontSize: FONT_SIZE,
                    fontFamily: FONT_FAMILY,
                    fontWeight: FONT_WEIGHT,
                    fontStyle: FONT_STYLE,
                    color: "white",
                    align: "left",
                    maxWidth: 90
                },

                branchAddress: {
                    text: result.branchAddress || "",
                    x: 8.5,
                    y: 97,
                    fontSize: FONT_SIZE,
                    fontFamily: FONT_FAMILY,
                    fontWeight: FONT_WEIGHT,
                    fontStyle: FONT_STYLE,
                    color: "white",
                    align: "left",
                    maxWidth: 100
                },

                selfImage: {
                    image: result.selfImage || "",
                    x: 43.8,
                    y: 45,
                    width: 25,
                    height: 30
                },

                stempImage: {
                    image: result.stempImage || "",
                    x: 45,
                    y: 65,
                    width: 20,
                    height: 20
                },

                singhImage: {
                    image: result.singhImage || "",
                    x: 45,
                    y: 65,
                    width: 18,
                    height: 18
                }

            };


            const backgroundImage = await loadImage(
                "/assets/Documents/IdCard.jpeg"
            );


            const pdf = new jsPDF({
                orientation: "landscape",
                unit: "mm",
                format: [PAGE_WIDTH, PAGE_HEIGHT],
                compress: true
            });


            pdf.addImage(
                backgroundImage,
                "JPEG",
                0,
                0,
                PAGE_WIDTH,
                PAGE_HEIGHT
            );


            await drawImage(pdf, FIELDS.selfImage, "Student Image");
            await drawImage(pdf, FIELDS.singhImage, "Student singhImage");
            await drawImage(pdf, FIELDS.stempImage, "Student stempImage");


            const textFields = [
                FIELDS.enrollmentNo,
                FIELDS.firstName,
                FIELDS.fatherName,
                FIELDS.motherName,
                FIELDS.dOB1,
                FIELDS.courseName,
                FIELDS.address,
                FIELDS.centreName,
                FIELDS.branchAddress
            ];


            textFields.forEach(field => {
                drawText(pdf, field);
            });


            const pdfBlob = pdf.output("blob");
            const pdfUrl = URL.createObjectURL(pdfBlob);

            const newTab = window.open(pdfUrl, "_blank");


            if (!newTab) {

                URL.revokeObjectURL(pdfUrl);

                alert("Popup blocked hai. Browser mein popup allow karo.");

                // ✅ Wapas usi page pe
                goBack();

                return;
            }


            // =====================================================
            // PDF TAB CLOSE CHECK — wapas usi page pe jao
            // =====================================================

            const checkPdfClosed = setInterval(() => {

                if (newTab.closed) {

                    clearInterval(checkPdfClosed);

                    URL.revokeObjectURL(pdfUrl);

                    // ✅ Wapas usi page pe (jahan se aaye the)
                    goBack();

                }

            }, 500);


            setTimeout(() => {

                clearInterval(checkPdfClosed);
                URL.revokeObjectURL(pdfUrl);

            }, 60 * 60 * 1000);


        }
        catch (error) {

            console.error("ID Card PDF Error:", error);

            alert(
                error?.message ||
                "ID Card PDF banane mein error aa gaya."
            );

            // ✅ Error case mein bhi wapas usi page pe
            goBack();

        }

    };


    // =========================================================
    // UI — kuch bhi render nahi hoga
    // =========================================================

    return null;

};

export default IdCard;