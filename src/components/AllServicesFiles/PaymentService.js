import api from "../api";

 // ✅ 2. Create Razorpay Order
export const createRazorpayOrder = async (userId, oId) => {
    const response = await api.post("/GetWay/paymentDo-razorPay", {
        userId: parseInt(userId),
        oId: parseInt(oId),
    });
    return response.data;
};

// ✅ 3. Verify Payment
// src/AllServicesFiles/StudentService.js
export const verifyPayment = async ({
    R_orderId,
    paymentId,
    signature,
    paymentstatus,
    userId,
    oId,
}) => {
    const formData = new FormData();
    formData.append("R_orderId", R_orderId);
    formData.append("PaymentId", paymentId);           // ✅ Capital
    formData.append("Signature", signature);            // ✅ Capital
    formData.append("PaymentStatus", paymentstatus);    // ✅ Capital
    formData.append("UserId", userId);
    formData.append("OId", oId);

    const response = await api.post("/GetWay/after-payment", formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
};


 // ✅ Offline Payments List
export const getOfflinePayments = async (status) => {
    const response = await api.get(`/Payment/get-payment-detail?status=${status}`);
    return response.data;
};
export const getBooksPayments = async (status) => {
    const response = await api.get(`/Payment/get-books-payment-detail?status=${status}`);
    return response.data;
};

 

export const getStudentFeeDetails = async (id) => {
    const res = await api.get("/Payment/student-payment-detail", {
        params: { Id: id },  
    });
    return res.data;
};

export const createOfflinePayment = async (formData) => {
    const data = new FormData();

    data.append("UserId", formData.userId);
    data.append("Amount", formData.amount);
    data.append("remark", formData.remark || "");
    data.append("PaidDate", formData.paidDate);
    data.append("courseid", formData.courseid);

    const response = await api.post("/Payment/student-payment-add", data, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });

    return response.data;
};