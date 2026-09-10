import createPool from "../config/datasource.js";

export async function getAllMatiere(req, res) {
    try {
        const pool = createPool();
        const result = await pool.query(
            "SELECT * FROM classe ORDER BY id_matiere"
        );

        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export async function getMatiereById(req, res) {
    try {
        const pool = createPool();
        const { id } = req.params;

        const result = await pool.query(
            "SELECT * FROM classe WHERE id_matiere = $1",
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "matiere introuvable"
            });
        }

        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export async function createMatiere(req, res) {
    try {
        const pool = createPool();
        const { nom_matiere, id_prof } = req.body;

        const result = await pool.query(
            `INSERT INTO matiere (nom_matiere, id_prof)
             VALUES ($1, $2)
             RETURNING *`,
            [nom_matiere, id_prof]
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}