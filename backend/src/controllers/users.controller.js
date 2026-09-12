import createPool from "../config/datasource.js";
import bcrypt from "bcrypt";

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

export async function getUserAttent(req, res) {
    try{
        const pool= createPool();
        const result = await pool.query(
            `SELECT * FROM utilisateurs WHERE actif = false ORDER BY date_creation DESC`
        );
        res.json(result.rows);
    }catch(error){
        res.status(500).json({error: error.message})
    }
    
}

export async function putUserValide(req, res) {
    try{
        const pool = createPool();
        const {id} = req.params;
        const result= await pool.query(
            `UPDATE utilisateurs SET actif = TRUE WHERE id_utilisateur = $1 RETURNING *`,
            [id]
        );
        res.status(201).json(result.rows[0]);

    }catch(error){
        console.error(error);
        res.status(500).json({
            message: "Erreur lors de l'ajout",
            error: error.message});
    }
}

export async function createUser(req, res) {
    try {
        const pool = createPool();
       
        const { nom, prenom, email, mot_de_passe, role } = req.body;

        const passwordHash = await bcrypt.hash(mot_de_passe, 10);

        const result = await pool.query(
            `INSERT INTO utilisateurs (nom, prenom, email, mot_de_passe, role)
             VALUES ($1, $2, $3, $4, $5)
             RETURNING *`,
            [nom, prenom, email, passwordHash, role]
        );

        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export async function deleteUser(req, res) {
    try {
        const pool = createPool();
        const { id } = req.params;

        const result = await pool.query(
            `DELETE FROM utilisateurs
             WHERE id_utilisateur = $1
             RETURNING *`,
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "utilisateur introuvable"
            });
        }

        res.json({
            message: "utilisateur supprimé avec succès",
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