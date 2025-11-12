import axios from "axios";

const ORDER_BASE_URL = import.meta.env.VITE_ORDER_BASE_URL;

const getAuthHeader = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  return user?.token ? { Authorization: `Bearer ${user.token}` } : {};
};

// ✅ User creates a pending order → needs JWT
export const createPendingOrder = async (orderData) => {
  return await axios.post(`${ORDER_BASE_URL}`, orderData, {
    headers: {
      ...getAuthHeader(),
      "Content-Type": "application/json",
    },
  });
};


// ✅ Get orders by email → public (no JWT)
export const getOrdersByEmail = async (email) => {
  // console.log(...getAuthHeader())
  return await axios.get(`${ORDER_BASE_URL}/${email}`, {
    headers: {
      ...getAuthHeader(),
      "Content-Type": "application/json",
    },
  });
};

// ✅ Cancel order → authenticated user (needs JWT)
export const cancelOrder = async (data) => {
  return axios.post(
    `${ORDER_BASE_URL}/status`,
    data,
    {
      headers: {
        ...getAuthHeader(),
        "Content-Type": "application/json"
      },
    }
  );
};


// ✅ Admin: get all orders → needs JWT
export const getAllOrders = () => {
  return axios.get(`${ORDER_BASE_URL}/admin/all-orders`, {
    headers: {
      ...getAuthHeader(),
    },
  });

  // return axios.get(`http://localhost:8082/orders/admin/all-orders`, {
  //   headers: {
  //     ...getAuthHeader(),
  //   },
  // });
};
