import axios from "axios";

const PAYMENT_BASE_URL = import.meta.env.VITE_PAYMENT_BASE_URL;

const getAuthHeader = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    return user?.token ? { Authorization: `Bearer ${user.token}` } : {};
};

// ✅ POST (needs JWT)
export const processPayment = async (paymentData) => {
    return await axios.post(`${PAYMENT_BASE_URL}`, paymentData, {
        headers: {
            ...getAuthHeader(),
            "Content-Type": "application/json"
        },
    });
};

// ✅ GET (invoice PDF also needs JWT)
export const getInvoicePdf = async (orderId) => {
    return await axios.get(`${PAYMENT_BASE_URL}/pdf/${orderId}`, {
        headers: {
            ...getAuthHeader(),
        },
        responseType: "blob", // ✅ recommended for PDF download
    });
};
