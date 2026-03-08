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

const router = Router();

router.get("/health", (_req, res) => {
  res.json({
    success: true,
    message: "API is running - VERIFIED",
    timestamp: new Date().toISOString(),
  });
});

router.use("/labels", labelsRouter);
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

export default router;
