// api/categoryApi.js
import API from "./axios";

export const getCategories = async () => {
  const res = await API.get("/categories");
  return res.data;
};
