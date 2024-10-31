import connectMongoDb from "../../../../../lib/mongodb";
import Section from "../../../../../models/Section";
import User from "../../../../../models/User";
export async function POST(req: Request) {
  await connectMongoDb();

  const { id } = await req.json();

  try {
    const sectionCheck = await User.find({ section: id });
    if (!sectionCheck.length) {
      const section = await Section.findByIdAndDelete(id);
      if (section) {
        return new Response(JSON.stringify({ section, success: true }), {
          status: 200,
        });
      } else {
        return new Response(JSON.stringify({ error: "Bo'lim mavjud emas!" }), {
          status: 400,
        });
      }
    }

    return new Response(
      JSON.stringify({ error: "Bo'limga tegishli xodimlar mavjud!" }),
      {
        status: 400,
      }
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: "Xatolik yuz berdi!" }), {
      status: 400,
    });
  }
}
