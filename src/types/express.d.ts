import { JwtPayload } from "jsonwebtoken";

declare global {
    namespace Express {
        interface Request {
            user: { id: number; role: "USER" | "ADMIN" } & JwtPayload;
        }
    }
}

export { };
