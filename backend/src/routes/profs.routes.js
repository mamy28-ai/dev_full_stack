import { Router } from "express";
import {
    getAllProfs,
    getProfById,
    createProf,
    updateProf,
    deleteProf
} from "../controllers/profs.controller.js";

const router = Router();

router.get("/", getAllProfs);
router.get("/:id", getProfById);
router.post("/", createProf);
router.put("/:id", updateProf);
router.delete("/:id", deleteProf);

export default router;
