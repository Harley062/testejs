import { Request as ExRequest, Response } from "express";
import ReviewService from "../services/review.service";

interface AuthRequest extends ExRequest {
    user: { id: number; role: "USER" | "ADMIN" };
}

export default class ReviewController {
    static async createReview(req: AuthRequest, res: Response): Promise<void> {
        const propertyId = Number(req.params.propertyId);
        const userId = req.user.id;
        const { rating, comment } = req.body;

        const review = await ReviewService.createReview({
            userId,
            propertyId,
            rating,
            comment,
        });
        res.status(201).json(review);
    }

    static async listReviews(req: AuthRequest, res: Response): Promise<void> {
        const propertyId = Number(req.params.propertyId);
        const { status, page = "1", perPage = "10", sort = "desc" } = req.query;
        const data = await ReviewService.listReviews({
            propertyId,
            status: status as string,
            page: Number(page),
            perPage: Number(perPage),
            sort: sort as "asc" | "desc",
        });
        res.json(data);
    }

    static async updateReview(req: AuthRequest, res: Response): Promise<void> {
        const propertyId = Number(req.params.propertyId);
        const reviewId = Number(req.params.reviewId);
        const userId = req.user.id;
        const { rating, comment } = req.body;

        const updated = await ReviewService.updateReview({
            userId,
            propertyId,
            reviewId,
            rating,
            comment,
        });
        res.json(updated);
    }

    static async deleteReview(req: AuthRequest, res: Response): Promise<void> {
        const propertyId = Number(req.params.propertyId);
        const reviewId = Number(req.params.reviewId);
        const userId = req.user.id;

        await ReviewService.deleteReview({ userId, propertyId, reviewId });
        res.status(204).send();
    }

    static async updateStatus(req: AuthRequest, res: Response): Promise<void> {
        const propertyId = Number(req.params.propertyId);
        const reviewId = Number(req.params.reviewId);
        const status = req.body.status as "APPROVED" | "REJECTED";

        const updated = await ReviewService.updateStatus({
            propertyId,
            reviewId,
            status,
        });
        res.json(updated);
    }
}
