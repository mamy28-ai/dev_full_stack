import express from "express";
import createPool from "./datasource.js";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());


//endpoint profs

app.get("/api/profs", async (req, res) => {
    try {
        const pool = createPool();
        const result = await pool.query(
            "SELECT * FROM profs ORDER BY id_prof"
        );

        res.json(result.rows);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Erreur serveur",
            error: error.message
        });
    }
});

app.get("/api/profs/:id", async (req, res) => {
    try {
        const pool = createPool();
        const { id } = req.params;

        const result = await pool.query(
            "SELECT * FROM profs WHERE id_prof = $1",
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Professeur introuvable"
            });
        }

        res.json(result.rows[0]);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Erreur serveur",
            error: error.message
        });
    }
});

app.post("/api/profs", async (req, res) => {
    try {
        const pool = createPool();
        const {
            Nom,
            prénom,
            matière
        } = req.body;

        const result = await pool.query(
            `INSERT INTO profs
            ( Nom, prénom, matière)
            VALUES ($1, $2, $3)
            RETURNING *`,
            [
                Nom,
                prénom,
                matière
            ]
        );

        res.status(201).json(result.rows[0]);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Erreur lors de l'ajout",
            error: error.message
        });
    }
});

app.put("/api/profs/:id", async (req, res) => {
    try {
        const pool = createPool();
        const { id } = req.params;

        const {
            Nom,
            prénom,
            matière
        } = req.body;

        const result = await pool.query(
            `UPDATE profs
            SET Nom = $1,
                prénom = $2,
                matière = $3
            WHERE id_prof = $4
            RETURNING *`,
            [
                Nom,
                prénom,
                matière,
                id
            ]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Professeur introuvable"
            });
        }

        res.json(result.rows[0]);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Erreur lors de la modification",
            error: error.message
        });
    }
});

app.delete("/api/profs/:id", async (req, res) => {
    try {
        const pool = createPool();
        const { id } = req.params;

        const result = await pool.query(
            `DELETE FROM profs
             WHERE id_prof = $1
             RETURNING *`,
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Professeur introuvable"
            });
        }

        res.json({
            message: "Professeur supprimé avec succès",
            professeur: result.rows[0]
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Erreur lors de la suppression",
            error: error.message
        });
    }
});

//endpoint élèves
app.get("/api/eleves", async (req, res) => {
    try {
        const pool = createPool();
        const result = await pool.query(
            `SELECT e.*, c.nom_classe, c.niveau
             FROM élèves e
             LEFT JOIN classe c
             ON e.id_classe = c.id_classe
             ORDER BY e.id_eleve`
        );

        res.json(result.rows);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get("/api/eleves/:id", async (req, res) => {
    try {
        const pool = createPool();
        const { id } = req.params;

        const result = await pool.query(
            `SELECT e.*, c.nom_classe, c.niveau
             FROM élèves e
             LEFT JOIN classe c
             ON e.id_classe = c.id_classe
             WHERE e.id_eleve = $1`,
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Élève introuvable"
            });
        }

        res.json(result.rows[0]);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post("/api/eleves", async (req, res) => {
    try {
        const pool = createPool();
        const {
            id_eleve,
            nom,
            prenom,
            date_naissance,
            id_classe
        } = req.body;

        const result = await pool.query(
            `INSERT INTO élèves
             (id_eleve, nom, prenom, date_naissance, id_classe)
             VALUES ($1, $2, $3, $4, $5)
             RETURNING *`,
            [
                id_eleve,
                nom,
                prenom,
                date_naissance,
                id_classe
            ]
        );

        res.status(201).json(result.rows[0]);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.put("/api/eleves/:id", async (req, res) => {
    try {
        const pool = createPool();
        const { id } = req.params;

        const {
            nom,
            prenom,
            date_naissance,
            id_classe
        } = req.body;

        const result = await pool.query(
            `UPDATE élèves
             SET nom = $1,
                 prenom = $2,
                 date_naissance = $3,
                 id_classe = $4
             WHERE id_eleve = $5
             RETURNING *`,
            [
                nom,
                prenom,
                date_naissance,
                id_classe,
                id
            ]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Élève introuvable"
            });
        }

        res.json(result.rows[0]);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.delete("/api/eleves/:id", async (req, res) => {
    try {
        const pool = createPool();
        const { id } = req.params;

        const result = await pool.query(
            "DELETE FROM élèves WHERE id_eleve = $1 RETURNING *",
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Élève introuvable"
            });
        }

        res.json({
            message: "Élève supprimé",
            eleve: result.rows[0]
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

//endpoint classes
app.get("/api/classes", async (req, res) => {
    try {
        const pool = createPool();
        const result = await pool.query(
            "SELECT * FROM classe ORDER BY id_classe"
        );

        res.json(result.rows);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get("/api/classes/:id", async (req, res) => {
    try {
        const pool = createPool();
        const { id } = req.params;

        const result = await pool.query(
            "SELECT * FROM classe WHERE id_classe = $1",
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Classe introuvable"
            });
        }

        res.json(result.rows[0]);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post("/api/classes", async (req, res) => {
    try {
        const pool = createPool();
        const { id_classe, nom_classe, niveau } = req.body;

        const result = await pool.query(
            `INSERT INTO classe (id_classe, nom_classe, niveau)
             VALUES ($1, $2, $3)
             RETURNING *`,
            [id_classe, nom_classe, niveau]
        );

        res.status(201).json(result.rows[0]);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


app.put("/api/classes/:id", async (req, res) => {
    try {
        const pool = createPool();
        const { id } = req.params;
        const { nom_classe, niveau } = req.body;

        const result = await pool.query(
            `UPDATE classe
             SET nom_classe = $1,
                 niveau = $2
             WHERE id_classe = $3
             RETURNING *`,
            [nom_classe, niveau, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Classe introuvable"
            });
        }

        res.json(result.rows[0]);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.delete("/api/classes/:id", async (req, res) => {
    try {
        const pool = createPool();
        const { id } = req.params;

        const result = await pool.query(
            "DELETE FROM classe WHERE id_classe = $1 RETURNING *",
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Classe introuvable"
            });
        }

        res.json({
            message: "Classe supprimée",
            classe: result.rows[0]
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


app.listen(PORT, () => {
    console.log("server is running on port " + PORT);
});