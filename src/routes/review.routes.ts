import { Router } from "express";
import ReviewController from "../controllers/review.controller";
import { authenticate } from "../middleware/auth.middleware";
import { authorize } from "../middleware/role.middleware";

const router = Router({ mergeParams: true });

router.post("/", authenticate, ReviewController.createReview);
router.get("/", authenticate, ReviewController.listReviews);
router.put("/:reviewId", authenticate, ReviewController.updateReview);
router.delete("/:reviewId", authenticate, ReviewController.deleteReview);
router.patch(
    "/:reviewId/status",
    authenticate,
    authorize("ADMIN"),
    ReviewController.updateStatus
);

export default router;
