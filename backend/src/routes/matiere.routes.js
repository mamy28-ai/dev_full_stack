import { Router } from "express";
import {
    getAllMatiere,
    createMatiere
} from "../controllers/matiere.controller.js";

const router = Router();

router.get("/", getAllMatiere);
router.post("/", createMatiere);

export default router;