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

    // Sabhi text ke liye same default font
    const FONT_SIZE = 14;
    const FONT_FAMILY = "Arial";
    const FONT_WEIGHT = "normal";
    const FONT_STYLE = "normal";
    const FONT_COLOR = "#000000";

    // Long text ke liye minimum font size
    const MIN_FONT_SIZE = 7;


    // =========================================================
    // ✅ ROLE-BASED REDIRECT PATH
    // =========================================================

    const getRedirectPath = () => {
        const roleId = String(
            localStorage.getItem("RoleId") || ""
        ).trim();

        // Admin (5) → confirm-addmissions
        if (roleId === "5") {
            return "/confirm-addmissions";
        }

        // Franchise (33) → student-print-list
        if (roleId === "33") {
            return "/student-print-list";
        }

        // Fallback
        return "/";
    };


    // =========================================================
    // PAGE LOAD
    // =========================================================

    useEffect(() => {

        if (!id) return;

        // Same ID dobara print nahi hogi
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

    const drawImage = async (
        pdf,
        field,
        imageName = "Image"
    ) => {

        if (!field?.image) {
            console.log(`${imageName} nahi mili.`);
            return;
        }

        try {

            const image = await loadImage(field.image);

            // x/y percentage ke according
            const x =
                (field.x / 100) * PAGE_WIDTH;

            const y =
                (field.y / 100) * PAGE_HEIGHT;

            const width = field.width || 25;
            const height = field.height || 25;

            const format =
                getImageFormat(field.image);

            pdf.addImage(
                image,
                format,
                x - width / 2,
                y - height / 2,
                width,
                height
            );

            console.log(
                `${imageName} PDF mein add ho gayi.`
            );

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
    //
    // IMPORTANT:
    // Text ko maxWidth ke according stretch nahi kiya jayega.
    //
    // Short text:
    //     Font size 9px rahega.
    //
    // Long text:
    //     Sirf zarurat padne par font size automatically
    //     chhota hoga.
    //
    // Isse sabhi names/data visually proper rahenge.
    // =========================================================

    const createTextImage = (field) => {

        const text = String(field?.text || "").trim();

        if (!text) return null;

        const scale = 4;

        const canvas =
            document.createElement("canvas");

        const ctx =
            canvas.getContext("2d");

        if (!ctx) return null;


        // ---------------------------------------------------------
        // COMMON FONT
        // ---------------------------------------------------------

        let currentFontSize =
            FONT_SIZE * scale;


        const fontFamily =
            FONT_FAMILY;

        const fontWeight =
            FONT_WEIGHT;

        const fontStyle =
            FONT_STYLE;


        // ---------------------------------------------------------
        // MAX WIDTH
        // ---------------------------------------------------------

        const maxWidthMm =
            field.maxWidth || 100;

        const maxWidthPx =
            maxWidthMm *
            3.78 *
            scale;


        // ---------------------------------------------------------
        // FONT SIZE AUTO FIT
        // ---------------------------------------------------------

        let textWidth = 0;

        while (true) {

            ctx.font =
                `${fontStyle} ${fontWeight} ${currentFontSize}px "${fontFamily}"`;

            textWidth =
                ctx.measureText(text).width;


            // Text already fit ho raha hai
            if (textWidth <= maxWidthPx) {
                break;
            }


            // Font size thoda reduce karo
            currentFontSize -=
                0.25 * scale;


            // Minimum font size
            if (
                currentFontSize <=
                MIN_FONT_SIZE * scale
            ) {

                currentFontSize =
                    MIN_FONT_SIZE * scale;

                // Final measurement
                ctx.font =
                    `${fontStyle} ${fontWeight} ${currentFontSize}px "${fontFamily}"`;

                textWidth =
                    ctx.measureText(text).width;

                break;
            }

        }


        // ---------------------------------------------------------
        // PADDING
        // ---------------------------------------------------------

        const horizontalPadding =
            8 * scale;

        const verticalPadding =
            5 * scale;


        // ---------------------------------------------------------
        // ACTUAL TEXT WIDTH
        // ---------------------------------------------------------

        // Text ki actual width use hogi.
        // maxWidth ke according stretch nahi hoga.

        const finalWidth =
            Math.min(
                textWidth + horizontalPadding,
                maxWidthPx + horizontalPadding
            );


        const finalHeight =
            currentFontSize * 1.8 +
            verticalPadding;


        canvas.width =
            Math.ceil(finalWidth);

        canvas.height =
            Math.ceil(finalHeight);


        // ---------------------------------------------------------
        // CANVAS RESIZE KE BAAD FONT DOBARA SET
        // ---------------------------------------------------------

        ctx.font =
            `${fontStyle} ${fontWeight} ${currentFontSize}px "${fontFamily}"`;

        ctx.fillStyle =
            field.color || FONT_COLOR;

        ctx.textBaseline =
            "middle";

        ctx.textAlign =
            field.align || "center";


        // ---------------------------------------------------------
        // TEXT X POSITION
        // ---------------------------------------------------------

        let drawX;


        if (field.align === "left") {

            drawX =
                horizontalPadding / 2;

        }
        else if (field.align === "right") {

            drawX =
                canvas.width -
                horizontalPadding / 2;

        }
        else {

            drawX =
                canvas.width / 2;

        }


        // ---------------------------------------------------------
        // DRAW TEXT
        // ---------------------------------------------------------

        ctx.fillText(
            text,
            drawX,
            canvas.height / 2
        );


        return {
            image: canvas.toDataURL("image/png"),

            // Actual canvas size
            width: canvas.width,

            height: canvas.height,

            // Scale information
            scale: scale
        };

    };


    // =========================================================
    // DRAW TEXT
    // =========================================================

    const drawText = (pdf, field) => {

        if (!field?.text) return;


        const textData =
            createTextImage(field);

        if (!textData) return;


        // ---------------------------------------------------------
        // x/y percentage ke according
        // ---------------------------------------------------------

        const x =
            (field.x / 100) *
            PAGE_WIDTH;

        const y =
            (field.y / 100) *
            PAGE_HEIGHT;


        // ---------------------------------------------------------
        // ACTUAL IMAGE SIZE
        // ---------------------------------------------------------
        //
        // Canvas ko stretch nahi karenge.
        // Actual rendered text ki width hi use hogi.
        // ---------------------------------------------------------

        const imageWidth =
            (
                textData.width /
                textData.scale
            ) / 3.78;

        const imageHeight =
            (
                textData.height /
                textData.scale
            ) / 3.78;


        // ---------------------------------------------------------
        // DRAW X
        // ---------------------------------------------------------

        let drawX = x;


        if (field.align === "center") {

            drawX =
                x -
                imageWidth / 2;

        }
        else if (field.align === "right") {

            drawX =
                x -
                imageWidth;

        }


        // ---------------------------------------------------------
        // ADD TEXT IMAGE
        // ---------------------------------------------------------

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

            console.log(
                "ID Card Print ID:",
                studentId
            );


            // =====================================================
            // API DATA
            // =====================================================

            const result =
                await printDiplomaApi(studentId);


            if (!result) {

                alert(
                    "Student data nahi mila."
                );

                // ✅ Role-based redirect
                navigate(getRedirectPath());

                return;
            }


            console.log(
                "ID Card Data:",
                result
            );


            // =====================================================
            // ID CARD FIELDS
            // =====================================================

            const FIELDS = {

                // -------------------------------------------------
                // ENROLLMENT NO
                // -------------------------------------------------

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


                // -------------------------------------------------
                // STUDENT NAME
                // -------------------------------------------------

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


                // -------------------------------------------------
                // FATHER NAME
                // -------------------------------------------------

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


                // -------------------------------------------------
                // MOTHER NAME
                // -------------------------------------------------

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


                // -------------------------------------------------
                // DOB
                // -------------------------------------------------

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


                // -------------------------------------------------
                // COURSE
                // -------------------------------------------------

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


                // -------------------------------------------------
                // ADDRESS
                // -------------------------------------------------

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


                // -------------------------------------------------
                // CENTRE / ADDRESS
                // -------------------------------------------------

             centreName: {
    text: result.centreName || "",
    x: 12.3,
    y: 90,
    fontSize: FONT_SIZE, // sirf centreName ke liye
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


                // -------------------------------------------------
                // STUDENT PHOTO
                // -------------------------------------------------

                selfImage: {
                    image: result.selfImage || "",
                    x: 43.8,
                    y: 45,
                    width: 25,
                    height: 30
                },
                 stempImage: {
                    image:
                        result.stempImage ||
                        "",
                    x: 45,
                    y: 65,
                    width: 20,
                    height: 20
                },
                singhImage: {
                    image:
                        result.singhImage ||
                        "",
                     x: 45,
                    y: 65,
                    width: 18,
                    height: 18
                }

            };


            // =====================================================
            // BACKGROUND IMAGE
            // =====================================================

            const backgroundImage =
                await loadImage(
                    "/assets/Documents/IdCard.jpeg"
                );


            // =====================================================
            // CREATE PDF
            // =====================================================

            const pdf =
                new jsPDF({
                    orientation: "landscape",
                    unit: "mm",
                    format: [
                        PAGE_WIDTH,
                        PAGE_HEIGHT
                    ],
                    compress: true
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
                PAGE_HEIGHT
            );


            // =====================================================
            // STUDENT PHOTO
            // =====================================================

            await drawImage(
                pdf,
                FIELDS.selfImage,
                "Student Image"
            );

             await drawImage(
                pdf,
                FIELDS.singhImage,
                "Student singhImage"
            );
            await drawImage(
                pdf,
                FIELDS.stempImage,
                "Student stempImage"
            );

            // =====================================================
            // TEXT FIELDS
            // =====================================================

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


            // =====================================================
            // DRAW ALL TEXT
            // =====================================================

            textFields.forEach(field => {

                drawText(
                    pdf,
                    field
                );

            });


            // =====================================================
            // OPEN PDF
            // =====================================================

            const pdfBlob =
                pdf.output("blob");


            const pdfUrl =
                URL.createObjectURL(pdfBlob);


            const newTab =
                window.open(
                    pdfUrl,
                    "_blank"
                );


            // =====================================================
            // POPUP BLOCK CHECK
            // =====================================================

            if (!newTab) {

                URL.revokeObjectURL(
                    pdfUrl
                );

                alert(
                    "Popup blocked hai. Browser mein popup allow karo."
                );

                return;
            }


            // =====================================================
            // PDF TAB CLOSE CHECK
            // =====================================================

            const checkPdfClosed =
                setInterval(() => {

                    if (newTab.closed) {

                        clearInterval(
                            checkPdfClosed
                        );

                        URL.revokeObjectURL(
                            pdfUrl
                        );

                        // ✅ Role-based redirect
                        navigate(getRedirectPath());

                    }

                }, 500);


            // =====================================================
            // SAFETY CLEANUP
            // =====================================================

            setTimeout(() => {

                clearInterval(
                    checkPdfClosed
                );

                URL.revokeObjectURL(
                    pdfUrl
                );

            }, 60 * 60 * 1000);


        }
        catch (error) {

            console.error(
                "ID Card PDF Error:",
                error
            );

            alert(
                error?.message ||
                "ID Card PDF banane mein error aa gaya."
            );

        }

    };


    // =========================================================
    // UI
    // =========================================================

    return (

        <div
            style={{
                textAlign: "center",
                padding: "30px"
            }}
        >

            <p>
                ID Card PDF open ho rahi hai...
            </p>


            <button
                onClick={() =>
                    navigate(
                        getRedirectPath()
                    )
                }
                style={{
                    padding: "10px 20px",
                    cursor: "pointer",
                    background: "#007bff",
                    color: "#fff",
                    border: "none",
                    borderRadius: "5px"
                }}
            >
                ← Back
            </button>

        </div>

    );

};

export default IdCard;