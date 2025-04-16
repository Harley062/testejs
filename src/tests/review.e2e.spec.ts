import "dotenv/config";
import request from "supertest";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import app from "../app";

const prisma = new PrismaClient();

describe("Reviews E2E", () => {
  beforeAll(async () => {
    
    await prisma.$executeRaw`
      TRUNCATE TABLE "Review", "View", "Property", "User" RESTART IDENTITY CASCADE;
    `;
    await prisma.user.create({ data: { name: "U", email: "u@x" } });
    await prisma.user.create({
      data: { name: "Adm", email: "adm@x", role: "ADMIN" },
    });
    await prisma.property.create({
      data: { name: "P", address: "A" },
    });
    await prisma.view.create({
      data: { userId: 1, propertyId: 1 },
    });
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it("POST /api/properties/:propertyId/reviews", async () => {
    const tokenUser = jwt.sign(
      { id: 1, role: "USER" },
      process.env.JWT_SECRET!
    );

    const res = await request(app)
      .post("/api/properties/1/reviews")
      .set("Authorization", `Bearer ${tokenUser}`)
      .send({ rating: 4, comment: "Bom" });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("id");
    expect(res.body.rating).toBe(4);
    expect(res.body.comment).toBe("Bom");
  });
});
