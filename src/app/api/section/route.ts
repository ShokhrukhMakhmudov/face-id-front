import connectMongoDb from "../../../../lib/mongodb";
import Section from "../../../../models/Section";

export async function GET(req: Request) {
  await connectMongoDb();

  const sections = await Section.find({});

  if (sections) {
    return new Response(JSON.stringify({ sections, success: true }), {
      status: 200,
    });
  }

  return new Response(JSON.stringify({ error: "Xatolik yuz berdi!" }), {
    status: 400,
  });
}
