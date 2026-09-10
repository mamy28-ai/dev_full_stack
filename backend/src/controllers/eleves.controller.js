import createPool from "../config/datasource.js";

export async function getAllEleves(req, res) {
    try {
        const pool = createPool();
        const result = await pool.query(
           "SELECT * FROM élèves ORDER BY id_eleve"
        );

        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export async function getEleveById(req, res) {
    try {
        const pool = createPool();
        const { id } = req.params;

        const result = await pool.query(
            "SELECT * FROM élèves WHERE id_eleve = $1",
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
}

export async function createEleve(req, res) {
    try {
        const pool = createPool();
        const { nom, prenom, date_naissance, id_classe } = req.body;

        const result = await pool.query(
            `INSERT INTO élèves
             (nom, prenom, date_naissance, id_classe)
             VALUES ($1, $2, $3, $4)
             RETURNING *`,
            [ nom, prenom, date_naissance, id_classe]
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export async function updateEleve(req, res) {
    try {
        const pool = createPool();
        const { id } = req.params;
        const { nom, prenom, date_naissance, id_classe } = req.body;

        const result = await pool.query(
            `UPDATE élèves
             SET nom = $1,
                 prenom = $2,
                 date_naissance = $3,
                 id_classe = $4
             WHERE id_eleve = $5
             RETURNING *`,
            [nom, prenom, date_naissance, id_classe, id]
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
}

export async function deleteEleve(req, res) {
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
}
