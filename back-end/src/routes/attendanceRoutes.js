router.post("/", async (req, res) => {
  const { studentId, present, status, date, records } = req.body;
  const attendanceDate = parseAttendanceDate(date);
  const rawUserId = req.user?.id ? parseInt(req.user.id, 10) : null;
  const userId = !isNaN(rawUserId) ? rawUserId : undefined;

  try {
    if (Array.isArray(records)) {
      const results = await Promise.all(
        records.map(async (item) => {
          const isPresent = item.status === "PRESENT" || item.present === true;
          const statusValue = item.status || (isPresent ? "PRESENT" : "ABSENT");
          const parsedStudentId = parseInt(item.studentId, 10);

          if (isNaN(parsedStudentId)) {
            throw new Error(`Invalid studentId: ${item.studentId}`);
          }
          const updateData = {
            present: isPresent,
            status: statusValue,
          };
          if (userId !== undefined) updateData.markedById = userId;

          const createData = {
            studentId: parsedStudentId,
            present: isPresent,
            status: statusValue,
            date: attendanceDate,
          };
          if (userId !== undefined) createData.markedById = userId;

          return prisma.attendance.upsert({
            where: {
              studentId_date: {
                studentId: parsedStudentId,
                date: attendanceDate,
              },
            },
            update: updateData,
            create: createData,
          });
        }),
      );
      return res.json({
        message: "Attendance saved successfully",
        count: results.length,
      });
    }
    const isPresent = status === "PRESENT" || present === true;
    const statusValue = status || (isPresent ? "PRESENT" : "ABSENT");
    const parsedStudentId = parseInt(studentId, 10);

    if (isNaN(parsedStudentId)) {
      return res.status(400).json({ error: "Invalid studentId provided" });
    }

    const updateData = {
      present: isPresent,
      status: statusValue,
    };
    if (userId !== undefined) updateData.markedById = userId;

    const createData = {
      studentId: parsedStudentId,
      present: isPresent,
      status: statusValue,
      date: attendanceDate,
    };
    if (userId !== undefined) createData.markedById = userId;

    const record = await prisma.attendance.upsert({
      where: {
        studentId_date: {
          studentId: parsedStudentId,
          date: attendanceDate,
        },
      },
      update: updateData,
      create: createData,
    });

    res.json(record);
  } catch (error) {
    console.error("POST /attendance error:", error);
    res.status(500).json({ error: error.message });
  }
});
