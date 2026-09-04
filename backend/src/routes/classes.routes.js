import { Router } from "express";
import {
    getAllClasses,
    getClasseById,
    createClasse,
    updateClasse,
    deleteClasse
} from "../controllers/classes.controller.js";

const router = Router();

router.get("/", getAllClasses);
router.get("/:id", getClasseById);
router.post("/", createClasse);
router.put("/:id", updateClasse);
router.delete("/:id", deleteClasse);

export default router;
