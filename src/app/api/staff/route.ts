import connectMongoDb from "../../../../lib/mongodb";
import { User } from "../../../../models";
export async function GET(req: Request) {
  await connectMongoDb();

  const staff = await User.find({});

  if (staff) {
    return new Response(JSON.stringify({ staff, success: true }), {
      status: 200,
    });
  }

  return new Response(
    JSON.stringify({ error: "Xatolik yuz berdi!", success: false }),
    {
      status: 400,
    }
  );
}
