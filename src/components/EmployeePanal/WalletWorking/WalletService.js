import api from "../../api";

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

export const getWalletBalance1 = async () => {
  const token = localStorage.getItem("token") || localStorage.getItem("Token");

  const response = await api.get(
    "/Wallet/emp-wallet-getall",
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );

  return response.data;
};

export const getWalletShowBalance = async () => {
  const token = localStorage.getItem("token") || localStorage.getItem("Token");

  const response = await api.get(
    "/DropDownEmployee/dropdown-emp-wallet-balance",
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );

  return response.data;
};