import { Router } from "express";
import {
    getAllNote,
    createNote,
    updateNote,
    deleteNote
}from "../controllers/note.controller.js";

const router = Router();

router.get("/" , getAllNote);
router.post("/" , createNote);
router.put("/" , updateNote);
router.delete("/:id" , deleteNote);

export default router;