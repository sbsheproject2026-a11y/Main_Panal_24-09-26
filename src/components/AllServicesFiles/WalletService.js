import api from "../api";

export const getFrenchisesAssign1 = async (id) => {
  const response = await api.get(`/DropDown/dropdown-entityuser/${id}`);

  return response.data;
};

export const getPayMode = async (id) => {
  const response = await api.get(`/DropDown/dropdown-getmastertypes/${id}`);

  return response.data;
};

export const createWallet = async (formData) => {
  const data = new FormData();

  data.append("totalAmount", formData.totalAmount);
  data.append("remark", formData.remark);
  data.append("entryDate", formData.entryDate);
  data.append("franchiseId", formData.franchiseId);
  data.append("payMode", formData.payMode);
  data.append("accountId", formData.accountId);
  data.append("paymentType", formData.paymentType);

  // Image
  if (formData.slipUpload) {
    data.append("slipUpload1", formData.slipUpload);
  }
  data.append("bankNameid", formData.bankName);
  data.append("bankConfirmDate", formData.bankConfirmDate || "");
  data.append("transactionNo", formData.transactionNo);

  const response = await api.post("/AdminWallet/wallet-create", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

export const employeecreateWallet = async (formData) => {
  const data = new FormData();

  data.append("totalAmount", formData.totalAmount);
  data.append("remark", formData.remark);
  data.append("entryDate", formData.entryDate);
  data.append("franchiseId", formData.franchiseId);
  data.append("payMode", formData.payMode);
  data.append("accountId", formData.accountId);
  data.append("paymentType", formData.paymentType);

  // Image
  if (formData.slipUpload) {
    data.append("slipUpload1", formData.slipUpload);
  }
  data.append("bankNameid", formData.bankName);
  data.append("bankConfirmDate", formData.bankConfirmDate || "");
  data.append("transactionNo", formData.transactionNo);

  const response = await api.post("/Wallet/emp-wallet-create", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

export const getWalletBalance = async () => {
  const response = await api.get("/AdminWallet/wallet-getall");

  return response.data;
};
export const getPendingWalletBalance = async () => {
  const response = await api.get("/AdminWallet/penfing-wallet-getall");

  return response.data;
};

// ✅ Multiple Ids confirm
export const getWalletRequestConfirm = async (ids) => {
  try {
    const formData = new FormData();

    // same key "Ids" ko repeat karke bhejo
    ids.forEach((id) => formData.append("Ids", id));

    const response = await api.post(
      `/AdminWallet/PaymentConfirm`, // 👈 apna route
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      },
    );
    return response.data;
  } catch (error) {
    console.log("Confirm API error:", error);
    throw error;
  }
};



// ✅ Franchise or wallet 

 

export const getfranchiswallet = (pageNo, pageSize, search) => {
    const token = localStorage.getItem("token");

    return api.get(
        `/DropDownEmployee/dropdown-emp-wallet-balance`,
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );
};

export const getWalletBalance1 = async (userId) => {
    const token = localStorage.getItem("token") || localStorage.getItem("Token");

    const response = await api.get(
        "/Wallet/emp-wallet-getall",
        {
            params: { userId: Number(userId) || 0 },   // ⬅️ ?userId=123
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    return response.data;
};

export const getWalletShowBalance = async (userId) => {
    const token = localStorage.getItem("token") || localStorage.getItem("Token");

    const response = await api.get(
        "/DropDownEmployee/dropdown-emp-wallet-balance",
        {
            params: { userId: Number(userId) || 0 },   // ⬅️ ?userId=123
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    return response.data;
};