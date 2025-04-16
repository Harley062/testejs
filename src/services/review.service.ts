import { PrismaClient, ReviewStatus } from "@prisma/client";
import { notifyAdmins } from "../utils/notification";

const prisma = new PrismaClient();

interface CreateReviewDTO {
    userId: number;
    propertyId: number;
    rating: number;
    comment: string;
}

interface ListReviewsArgs {
    propertyId: number;
    status?: string;
    page: number;
    perPage: number;
    sort: "asc" | "desc";
}

interface UpdateReviewArgs {
    userId: number;
    propertyId: number;
    reviewId: number;
    rating: number;
    comment: string;
}

interface DeleteReviewArgs {
    userId: number;
    propertyId: number;
    reviewId: number;
}

interface UpdateStatusArgs {
    propertyId: number;
    reviewId: number;
    status: ReviewStatus;
}

export default class ReviewService {
    static async createReview(dto: CreateReviewDTO) {
        const { userId, propertyId, rating, comment } = dto;

        if (rating < 1 || rating > 5) {
            throw new Error("A avaliação deve ser entre 1 e 5 estrelas.");
        }

        const view = await prisma.view.findFirst({
            where: { userId, propertyId },
        });
        if (!view) {
            throw new Error("Você só pode avaliar propriedades que visualizou.");
        }

        const review = await prisma.review.create({
            data: {
                rating,
                comment,
                authorId: userId,
                propertyId,
            },
        });

        await notifyAdmins(
            `Nova avaliação pendente: usuário ${userId} avaliou propriedade ${propertyId}`
        );

        return review;
    }

    static async listReviews(args: ListReviewsArgs) {
        const { propertyId, status, page, perPage, sort } = args;
        const where: any = { propertyId };
        if (status) where.status = status;

        const [data, total] = await Promise.all([
            prisma.review.findMany({
                where,
                orderBy: { createdAt: sort },
                skip: (page - 1) * perPage,
                take: perPage,
                include: { author: true },
            }),
            prisma.review.count({ where }),
        ]);

        return { data, total, page, perPage };
    }

    static async updateReview(args: UpdateReviewArgs) {
        const { userId, propertyId, reviewId, rating, comment } = args;

        const exist = await prisma.review.findUnique({ where: { id: reviewId } });
        if (!exist || exist.authorId !== userId || exist.propertyId !== propertyId) {
            throw new Error("Sem permissão.");
        }

        return prisma.review.update({
            where: { id: reviewId },
            data: { rating, comment },
        });
    }

    static async deleteReview(args: DeleteReviewArgs) {
        const { userId, propertyId, reviewId } = args;

        const exist = await prisma.review.findUnique({ where: { id: reviewId } });
        if (!exist || exist.authorId !== userId || exist.propertyId !== propertyId) {
            throw new Error("Sem permissão.");
        }

        return prisma.review.delete({ where: { id: reviewId } });
    }

    static async updateStatus(args: UpdateStatusArgs) {
        const { propertyId, reviewId, status } = args;

        const updated = await prisma.review.update({
            where: { id: reviewId },
            data: { status },
        });

        if (status === ReviewStatus.APPROVED) {
            const agg = await prisma.review.aggregate({
                _avg: { rating: true },
                where: { propertyId, status: ReviewStatus.APPROVED },
            });
            await prisma.property.update({
                where: { id: propertyId },
                data: { averageRating: agg._avg.rating || 0 },
            });
        }

        return updated;
    }
}
