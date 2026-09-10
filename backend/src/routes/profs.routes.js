import { Router } from "express";
import {
    getAllProfs,
    getProfById,
    createProf,
    updateProf,
    deleteProf
} from "../controllers/profs.controller.js";
import { verifyToken } from "../middleware/authmiddleware.js";
const router = Router();

router.get("/",getAllProfs);
router.get("/:id", verifyToken, getProfById);
router.post("/", verifyToken,createProf);
router.put("/:id",verifyToken, updateProf);
router.delete("/:id",verifyToken, deleteProf);

export default router;
