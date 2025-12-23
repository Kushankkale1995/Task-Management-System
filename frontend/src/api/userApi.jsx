import API from "./axios";

export const getAllUsers = async () => {
  const res = await API.get("/users");
  return res;
};

export const getMyProfile = async () => {
  const res = await API.get("/users/profile");
  return res;
};


export const updateMyProfile = async(data) => {
    const res = await API.put("/users/profile", data);
    return res
}