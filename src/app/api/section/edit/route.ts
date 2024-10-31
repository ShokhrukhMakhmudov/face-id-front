import connectMongoDb from "../../../../../lib/mongodb";
import Section from "../../../../../models/Section";

export async function POST(req: Request) {
  await connectMongoDb();

  const { id, name } = await req.json();

  try {
    const section = await Section.findByIdAndUpdate(id, {
      name,
    });

    if (section) {
      return new Response(JSON.stringify({ section, success: true }), {
        status: 200,
      });
    }

    return new Response(
      JSON.stringify({ error: "O'zgartirishda xatolik yuz berdi!" }),
      {
        status: 400,
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "O'zgartirishda xatolik yuz berdi!" }),
      {
        status: 400,
      }
    );
  }
}
