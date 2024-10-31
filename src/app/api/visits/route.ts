import connectMongoDb from "../../../../lib/mongodb";
import Visit from "../../../../models/Visit";

export async function GET(req: Request) {
  await connectMongoDb();

  try {
    const visits = await Visit.find()
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
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      };

      // Преобразуем дату в строку с учетом часового пояса
      const localDateString = visitDate.toLocaleString("en-US", options);
      return {
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
