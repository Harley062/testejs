import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import ReviewService from "../services/review.service";

const prisma = new PrismaClient();

describe("ReviewService", () => {
  beforeAll(async () => {
    await prisma.$executeRaw`
      TRUNCATE TABLE "Review", "View", "Property", "User" RESTART IDENTITY CASCADE;
    `;
    await prisma.user.create({ data: { name: "A", email: "a@b.com" } });
    await prisma.property.create({ data: { name: "P", address: "X" } });
    await prisma.view.create({ data: { userId: 1, propertyId: 1 } });
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it("deve criar review pendente", async () => {
    const rev = await ReviewService.createReview({
      userId: 1,
      propertyId: 1,
      rating: 5,
      comment: "Ótimo",
    });
    expect(rev.status).toBe("PENDING");
    expect(rev.rating).toBe(5);
    expect(rev.comment).toBe("Ótimo");
  });
});
