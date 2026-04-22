import { Router } from "express";
import labelsRouter from "./labels.routes";
import companiesRouter from "./companies.routes";
import criteriaRouter from "./criteria.routes";
import newsRouter from "./news.routes";
import companyCriteriaRouter from "./companyCriteria.routes";
import authRoutes from "./auth.routes";
import uploadRoutes from "./upload.routes";
import searchRouter from "./search.routes";
import breakingNewsRouter from "./breakingNews.routes";
import reviewRoutes from "./review.routes";
import newsletterRoutes from "./newsletter.routes";
import userRoutes from "./user.routes";
import multimediaRoutes from "./multimedia.routes";
import adRouter from "./ad.routes";
import applicationRouter from "./application.routes";
import messageRouter from "./message.routes";
import commentRouter from "./comment.routes";
import notificationRouter from "./notification.routes";
import certificateRouter from "./certificate.routes";
import renewalRouter from "./renewal.routes";
import categoryRouter from "./category.routes";
import subCategoryRouter from "./subCategory.routes";
import eventRouter from "./event.routes";

const router = Router();

router.get("/health", (_req, res) => {
  res.json({
    success: true,
    message: "API is running - VERIFIED",
    timestamp: new Date().toISOString(),
  });
});

router.use("/labels", labelsRouter);
router.use("/applications", applicationRouter);
router.use("/companies", companiesRouter);
router.use("/criteria", criteriaRouter);
router.use("/news", newsRouter);
router.use("/company-criteria", companyCriteriaRouter);
router.use("/auth", authRoutes);
router.use("/upload", uploadRoutes);
router.use("/search", searchRouter);
router.use("/breaking-news", breakingNewsRouter);
router.use("/reviews", reviewRoutes);
router.use("/newsletter", newsletterRoutes);
router.use("/users", userRoutes);
router.use("/multimedia", multimediaRoutes);
router.use("/ads", adRouter);
router.use("/messages", messageRouter);
router.use("/comments", commentRouter);
router.use("/notifications", notificationRouter);
router.use("/certificates", certificateRouter);
router.use("/renewals", renewalRouter);
router.use("/categories", categoryRouter);
router.use("/subcategories", subCategoryRouter);
router.use("/events", eventRouter);

export default router;
