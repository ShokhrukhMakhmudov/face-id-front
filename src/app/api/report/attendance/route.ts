import ExcelJS from "exceljs";
import fs from "fs";
import path from "path";
import Section from "../../../../../models/Section";
import User from "../../../../../models/User";
import Visit from "../../../../../models/Visit";
import connectMongoDb from "../../../../../lib/mongodb";
import { ReportData, User as UserType, Visit as VisitType } from "@/types";

const getVisitsByDate = async (targetDate: string) => {
  const startOfDay = new Date(targetDate);
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date(targetDate);
  endOfDay.setHours(23, 59, 59, 999);

  const sections = await Section.find();

  const sectionMap = sections.reduce((acc, section) => {
    acc[section._id.toString()] = section.name;
    return acc;
  }, {} as { [key: string]: string });

  const users = await User.find();

  const usersMap = users.reduce((acc: any, user: UserType) => {
    acc[user._id.toString()] = user;
    return acc;
  }, {} as { [key: string]: UserType });

  const visits = await Visit.aggregate([
    // Фильтруем по дате
    {
      $match: {
        timestamp: { $gte: startOfDay, $lt: endOfDay },
      },
    },
    // Сортируем по времени входа
    {
      $sort: { timestamp: 1 },
    },
  ]);
  const visitsMap: { [key: string]: VisitType } = {};

  visits.forEach((visit) => {
    visitsMap[visit.userId] = visit;
  });

  const reportData: ReportData = {};

  sections.forEach((section) => {
    const sectionId = section._id.toString();
    reportData[sectionId] = {
      sectionName: section.name,
      users: [],
    };
  });

  visits.forEach((visit) => {
    const userId = visit.userId;
    const user = usersMap[userId];
    const date = new Date(visit.timestamp as string);

    // Получение времени в формате HH:mm
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const time = `${hours}:${minutes}`;

    reportData[user.sectionId].users.push({
      userId,
      userName: user.lastname + " " + user.name,
      enterTimestamp: time,
      status: visit.status,
    });
  });
  return reportData;
};

async function generateExcelReport(visits: ReportData, date: string) {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Davomat - " + date.split("T")[0]);

  worksheet.columns = [
    { header: "FIO", key: "name", width: 30 },
    { header: "Kirish/Chiqish vaqti", key: "timestamp", width: 20 },
    { header: "Holati", key: "status", width: 15 },
  ];
  console.log(visits);

  for (const sectionId in visits) {
    worksheet.addRow({
      name: visits[sectionId].sectionName,
      timestamp: "-",
      status: "-",
    });

    visits[sectionId].users.forEach((user) => {
      worksheet
        .addRow({
          name: user.userName,
          timestamp: user.enterTimestamp,
          status:
            user.status === "checkin"
              ? "Kirish"
              : user.status === "checkout"
              ? "Chiqish"
              : "-",
        })
        .eachCell((cell) => {
          cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: user.status === "checkout" ? "FF7171" : "79B1FB" },
          };
        });
    });
  }

  const filePath = path.join(process.cwd(), "public", "attendance_report.xlsx");
  await workbook.xlsx.writeFile(filePath);
  return filePath;
}

export async function GET(req: Request) {
  await connectMongoDb();

  const { searchParams } = new URL(req.url);
  let date = searchParams.get("date") as Date | string;

  if (!date) {
    return new Response("Date is required", { status: 400 });
  }

  date = new Date(date);
  date.setHours(0, 0, 0, 0);

  const visits = await getVisitsByDate(date.toISOString());

  try {
    const filePath = await generateExcelReport(visits, date.toISOString());

    // Устанавливаем заголовки для скачивания файла
    const fileBuffer = fs.readFileSync(filePath);
    return new Response(fileBuffer, {
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename=Davomat-${date.toISOString()}.xlsx`,
      },
    });
  } catch (error) {
    console.error("Ошибка при создании отчета:", error);
    return new Response("Ошибка при создании отчета", { status: 500 });
  } finally {
    // Очищаем временный файл
    fs.unlinkSync(path.join(process.cwd(), "public", "attendance_report.xlsx"));
  }
}
