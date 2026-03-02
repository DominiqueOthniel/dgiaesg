import { Router } from "express";
import { toggleSaveArticle, getSavedArticles } from "../controllers/user.controller";
import { protect } from "../middleware/authMiddleware";

const router = Router();

router.use(protect);

router.post("/save-article", toggleSaveArticle);
router.get("/saved-articles", getSavedArticles);

export default router;
