import connectMongoDb from "../../../../lib/mongodb";
import User from "../../../../models/User";

export async function GET(req: Request) {
  await connectMongoDb();

  const staff = await User.find({});

  if (staff) {
    return new Response(JSON.stringify({ staff, success: true }), {
      status: 200,
    });
  }

  return new Response(JSON.stringify({ error: "Xatolik yuz berdi!" }), {
    status: 400,
  });
}
