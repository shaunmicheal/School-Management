import API from "./api";

export const getClasses = async () => {
  const response = await API.get("/classes");
  return response.data;
};

export const assignTeacherToClass = async (classId, teacherId) => {
  const response = await API.put(`/classes/${classId}/assign-teacher`, {
    teacherId: teacherId ? parseInt(teacherId) : null,
  });
  return response.data;
};

export const getTeachers = async () => {
  const response = await API.get("/users");
  return response.data.filter((user) => user.role === "TEACHER");
};
