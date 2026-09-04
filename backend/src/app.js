import express from "express";
import cors from "cors";

import profsRoutes from "./routes/profs.routes.js";
import elevesRoutes from "./routes/eleves.routes.js";
import classesRoutes from "./routes/classes.routes.js";
import usersRoutes from "./routes/users.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/profs", profsRoutes);
app.use("/api/eleves", elevesRoutes);
app.use("/api/classes", classesRoutes);
app.use("/api/user", usersRoutes);

export default app;
