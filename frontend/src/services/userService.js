import API from "./api";

export const getUsers = async () => {
  const response = await API.get("/users");
  return response.data;
};

export const createUser = async (userData) => {
  const response = await API.post("/users", userData);
  return response.data;
};
export const deleteUser = async (userId) => {
  const response = await API.delete(`/users/${userId}`);
  return response.data;
};
