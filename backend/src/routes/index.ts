import { Router } from "express";
import labelsRouter from "./labels.routes";
import companiesRouter from "./companies.routes";
import criteriaRouter from "./criteria.routes";
import newsRouter from "./news.routes";
import companyCriteriaRouter from "./companyCriteria.routes";
import authRoutes from "./auth.routes";
import uploadRoutes from "./upload.routes";
import searchRouter from "./search.routes";

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

export default router;
