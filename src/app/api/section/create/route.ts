import connectMongoDb from "../../../../../lib/mongodb";
import { Section } from "../../../../../models";

export async function POST(req: Request) {
  await connectMongoDb();

  const { name } = await req.json();

  const sectionCheck = await Section.findOne({ name: name.trim() });
  if (!sectionCheck) {
    const section = await Section.create({
      name: name.trim(),
    });

    if (section) {
      return new Response(JSON.stringify({ section, success: true }), {
        status: 200,
      });
    }
  } else {
    return new Response(JSON.stringify({ error: "Bo'lim mavjud!" }), {
      status: 400,
    });
  }

  return new Response(JSON.stringify({ error: "Xatolik yuz berdi!" }), {
    status: 400,
  });
}
