import jwt from "jsonwebtoken";

export function verifyToken(req: Request) {
  const authorization = req.headers.get("authorization");
  if (!authorization) {
    return { error: "Token mavjud emas" };
  }

  const token = authorization.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    return (typeof decoded === "object" && "userId" in decoded)
      ? { userId: decoded?.userId }
      : { error: "Noto'gri token" };
  } catch (error) {
    return { error: "Noto'gri token" };
  }
}
