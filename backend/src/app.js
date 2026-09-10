import express from "express";
import cors from "cors";

import profsRoutes from "./routes/profs.routes.js";
import elevesRoutes from "./routes/eleves.routes.js";
import classesRoutes from "./routes/classes.routes.js";
import usersRoutes from "./routes/users.routes.js";
import enseignantsRoutes from "./routes/enseignants.rotutes.js";
import noteRoutes from "./routes/note.routes.js";
import matiereRoutes from "./routes/matiere.route.js"

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/profs", profsRoutes);
app.use("/api/eleves", elevesRoutes);
app.use("/api/classes", classesRoutes);
app.use("/api/user", usersRoutes);
app.use("/api/enseignants" , enseignantsRoutes);
app.use("/api/note", noteRoutes);
app.use("/api/matiere", matiereRoutes);

export default app;
