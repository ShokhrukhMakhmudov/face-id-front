import connectMongoDb from "../../../../../lib/mongodb";
import { User } from "../../../../../models";

export async function GET(req: Request) {
  await connectMongoDb();

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  const user = await User.findById(id);

  if (user) {
    return new Response(JSON.stringify({ user, success: true }), {
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
