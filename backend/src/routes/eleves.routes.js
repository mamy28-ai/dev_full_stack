import { Router } from "express";
import {
    getAllEleves,
    getEleveById,
    createEleve,
    updateEleve,
    deleteEleve
} from "../controllers/eleves.controller.js";

const router = Router();

router.get("/", getAllEleves);
router.get("/:id", getEleveById);
router.post("/", createEleve);
router.put("/:id", updateEleve);
router.delete("/:id", deleteEleve);

export default router;
