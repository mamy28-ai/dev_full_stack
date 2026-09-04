import createPool from "../config/datasource.js";

export async function getAllUsers(req, res) {
    try {
        const pool = createPool();
        const result = await pool.query(
            "SELECT * FROM utilisateurs ORDER BY id_utilisateur"
        );

        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export async function createUser(req, res) {
    try {
        const pool = createPool();
        const { nom, prenom, email, mot_de_passe, role } = req.body;

        const result = await pool.query(
            `INSERT INTO utilisateurs (nom, prenom, email, mot_de_passe, role)
             VALUES ($1, $2, $3, $4, $5)
             RETURNING *`,
            [nom, prenom, email, mot_de_passe, role]
        );

        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
