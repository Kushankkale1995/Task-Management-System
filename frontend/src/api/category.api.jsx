import axios from "./axios";

export const getCategories = async () => {
  try {
    const res = await axios.get("/categories");
    return res.data;
  } catch (err) {
    console.error("Category fetch error:", err.response?.data || err.message);
    throw err;
  }
};

export const createCategory = (data) => axios.post("/categories", data);

export const updateCategory = (id, data) => axios.put(`/categories/${id}`, data);

export const deleteCategory = (id) => axios.delete(`/categories/${id}`);
