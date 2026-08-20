import API from "./api";

export const getAllStudents = async () => {
  const response = await API.get("/students");
  return response.data;
};

export const createStudent = async (studentData) => {
  const response = await API.post("/students", {
    ...studentData,
    classId: parseInt(studentData.classId),
  });
  return response.data;
};

export const getTeacherClassDetails = async (teacherId) => {
  const response = await API.get(`/classes`);
  return response.data.find((c) => c.teacherId === teacherId);
};

export const getClassStudents = async (classId) => {
  const response = await API.get(`/classes/${classId}`);
  return response.data.students || [];
};
export const submitAttendance = async (classId, date, attendanceRecords) => {
  const response = await API.post(`/attendance`, {
    classId,
    date,
    records: attendanceRecords,
  });
  return response.data;
};

export const getAttendanceLogs = async (date, classId) => {
  const params = {};
  if (date) params.date = date;
  if (classId) params.classId = classId;

  const response = await API.get("/attendance", { params });
  return response.data;
};
