import { Router } from "express";
import { getAllUsers, 
         createUser,
         getUserAttent, 
         putUserValide,
         deleteUser} from "../controllers/users.controller.js";

const router = Router();

router.get("/", getAllUsers);
router.get("/attente", getUserAttent);
router.post("/", createUser);
router.put("/valide/:id", putUserValide);
router.delete("/:id", deleteUser)

export default router;
