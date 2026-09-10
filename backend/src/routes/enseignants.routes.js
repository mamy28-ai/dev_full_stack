import { Router } from "express";
import { 
    enregistrerNote, 
    validerPresence, 
    ajouterDevoir, 
    envoyerMessageParent 
} from "../controllers/enseignants.controller.js";

const router = Router();

router.post("/notes", enregistrerNote);
router.post("/presences", validerPresence);
router.post("/cahier-texte", ajouterDevoir);
router.post("/messages", envoyerMessageParent);

export default router;