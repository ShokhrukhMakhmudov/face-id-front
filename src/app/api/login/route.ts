import connectMongoDb from "../../../../lib/mongodb";
import { Admin } from "../../../../models";
import jwt from "jsonwebtoken";

export async function POST(req: Request) {
  await connectMongoDb();

  const { email, password } = await req.json();

  const user = await Admin.findOne({ email });
  if (!user) {
    return new Response(JSON.stringify({ error: "Noto'g'ri ma'lumot" }), {
      status: 400,
    });
  }

  // Проверка пароля
  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    return new Response(JSON.stringify({ error: "Noto'g'ri ma'lumot" }), {
      status: 400,
    });
  }

  // Генерация JWT-токена
  const token = jwt.sign(
    { userId: user._id },
    process.env.JWT_SECRET as string,
    {
      expiresIn: "1h",
    }
  );

  return new Response(JSON.stringify({ token }), { status: 200 });
}
