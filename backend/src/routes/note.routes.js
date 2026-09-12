import { Router } from "express";
import {
    getAllNote,
    createNote,
    updateNote,
    deleteNote,
    getGraphNote
}from "../controllers/note.controller.js";

const router = Router();

router.get("/" , getAllNote);
router.post("/" , createNote);
router.put("/" , updateNote);
router.delete("/:id" , deleteNote);
router.get("/", getGraphNote);

export default router;