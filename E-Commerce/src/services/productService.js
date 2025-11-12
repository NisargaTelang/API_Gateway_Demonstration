import axios from "axios";

const PRODUCT_BASE_URL = import.meta.env.VITE_PRODUCT_BASE_URL;

// send token also (admin only operation)
const getAuthHeader = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  return user?.token ? { Authorization: `Bearer ${user?.token}` } : {};
};

export const addProduct = async (formData) => {
  return await axios.post(`${PRODUCT_BASE_URL}`, formData, {
    headers: {
      ...getAuthHeader(),
      "Content-Type": "multipart/form-data",
    },
  });
};

export const getProducts = async () => {
  return await axios.get(`${PRODUCT_BASE_URL}`);
};

export const deleteProduct = async (id) => {
  return await axios.delete(`${PRODUCT_BASE_URL}/${id}`, {
    headers: {
      ...getAuthHeader(),
    },
  });
};

export const updateProduct = async (id, formData) => {
  return await axios.put(`${PRODUCT_BASE_URL}/${id}`, formData, {
    headers: {
      ...getAuthHeader(),
      "Content-Type": "multipart/form-data",
    },
  });
};
