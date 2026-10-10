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