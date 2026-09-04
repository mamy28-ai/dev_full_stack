import createPool from "../config/datasource.js";

export async function getAllProfs(req, res) {
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
}

export async function getProfById(req, res) {
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
}

export async function createProf(req, res) {
    try {
        const pool = createPool();
        const { Nom, prénom, matière } = req.body;

        const result = await pool.query(
            `INSERT INTO profs
            (Nom, prénom, matière)
            VALUES ($1, $2, $3)
            RETURNING *`,
            [Nom, prénom, matière]
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Erreur lors de l'ajout",
            error: error.message
        });
    }
}

export async function updateProf(req, res) {
    try {
        const pool = createPool();
        const { id } = req.params;
        const { Nom, prénom, matière } = req.body;

        const result = await pool.query(
            `UPDATE profs
            SET Nom = $1,
                prénom = $2,
                matière = $3
            WHERE id_prof = $4
            RETURNING *`,
            [Nom, prénom, matière, id]
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
}

export async function deleteProf(req, res) {
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
}
