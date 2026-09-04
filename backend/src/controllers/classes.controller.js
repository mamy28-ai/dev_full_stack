import createPool from "../config/datasource.js";

export async function getAllClasses(req, res) {
    try {
        const pool = createPool();
        const result = await pool.query(
            "SELECT * FROM classe ORDER BY id_classe"
        );

        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export async function getClasseById(req, res) {
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
}

export async function createClasse(req, res) {
    try {
        const pool = createPool();
        const { nom_classe, niveau, nbr_eleve } = req.body;

        const result = await pool.query(
            `INSERT INTO classe (nom_classe, niveau, nbr_eleve)
             VALUES ($1, $2, $3)
             RETURNING *`,
            [nom_classe, niveau, nbr_eleve]
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export async function updateClasse(req, res) {
    try {
        const pool = createPool();
        const { id } = req.params;
        const { nom_classe, niveau, nbr_eleve } = req.body;

        const result = await pool.query(
            `UPDATE classe
             SET nom_classe = $1,
                 niveau = $2,
                 nbr_eleve = $3
             WHERE id_classe = $4
             RETURNING *`,
            [nom_classe, niveau, nbr_eleve, id]
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
}

export async function deleteClasse(req, res) {
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
}
