import connectMongoDb from "../../../../lib/mongodb";
import Visit from "../../../../models/Visit";

function addOneDay(dateString: string) {
  // Преобразуем строку в объект Date
  const date = new Date(dateString);

  // Увеличиваем дату на один день
  date.setDate(date.getDate() + 1);

  // Форматируем дату обратно в строку "YYYY-MM-DD"
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // месяцы идут с 0 по 11
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export async function GET(req: Request) {
  await connectMongoDb();

  const { searchParams } = new URL(req.url);
  const date = searchParams.get("date") as string;
  const endDate = addOneDay(date);

  try {
    const visits = await Visit.find({
      timestamp: { $gte: date, $lte: endDate }, // фильтр по диапазону дат
    })
      .populate({
        path: "userId",
        select: "name lastname photo sectionId", // выбираем нужные поля из User
        populate: {
          path: "sectionId",
          model: "Section",
          select: "name", // выбираем только имя отдела
        },
      })
      .select("timestamp photo status"); // выбираем только нужные поля из Visit

    const result = visits.map((visit) => {
      const visitDate = new Date(visit.timestamp);

      // Форматирование даты с учетом часового пояса +5 GMT
      const options: Intl.DateTimeFormatOptions = {
        timeZone: "Asia/Tashkent", // Часовой пояс Ташкент
        year: "numeric",
        month: "numeric",
        day: "numeric",
        hour12: false,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      };

      // Преобразуем дату в строку с учетом часового пояса
      const localDateString = visitDate.toLocaleString("ru-RU", options);
      return {
        _id: visit._id,
        userName: `${visit.userId.lastname} ${visit.userId.name}`,
        sectionName: visit.userId.sectionId?.name || "Отдел не найден",
        timestamp: localDateString,
        userPhoto: visit.userId.photo,
        visitPhoto: visit.photo,
        status: visit.status,
      };
    });

    return new Response(JSON.stringify({ visits: result, success: true }), {
      status: 200,
    });
  } catch (error) {
    console.error("Ошибка при получении данных о посещениях:", error);
  }

  return new Response(JSON.stringify({ error: "Xatolik yuz berdi!" }), {
    status: 400,
  });
}
