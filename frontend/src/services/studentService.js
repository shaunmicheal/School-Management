import API from "./api";

export const getAllStudents = async () => {
  const response = await API.get("/students");
  return response.data;
};

export const createStudent = async (studentData) => {
  let firstName = studentData.firstName || "";
  let lastName = studentData.lastName || "";

  if (!firstName && studentData.name) {
    const nameParts = studentData.name.trim().split(" ");
    firstName = nameParts[0];
    lastName = nameParts.slice(1).join(" ") || "N/A";
  }

  const payload = {
    ...studentData,
    firstName: firstName || "Learner",
    lastName: lastName || "N/A",
    classId: parseInt(studentData.classId, 10),
  };

  const response = await API.post("/students", payload);
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
  const promises = attendanceRecords.map((record) =>
    API.post("/attendance", {
      studentId: parseInt(record.studentId, 10),
      present: record.present,
      date,
    }),
  );

  const results = await Promise.all(promises);
  return results.map((res) => res.data);
};

export const getAttendanceLogs = async (date, classId) => {
  const params = {};
  if (date) params.date = date;
  if (classId) params.classId = classId;

  const response = await API.get("/attendance", { params });
  return response.data;
};
