import createPool from "../config/datasource.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export async function login(req, res) {
    try {
        const pool = createPool();
        const { email, mot_de_passe } = req.body;

        if (!email || !mot_de_passe) {
            return res.status(400).json({
                message: "Email et mot de passe obligatoires"
            });
        }

        const result = await pool.query(
            "SELECT * FROM utilisateurs WHERE email = $1",
            [email]
        );

        if (result.rows.length === 0) {
            return res.status(401).json({
                message: "Email ou mot de passe incorrect"
            });
        }

        const user = result.rows[0];

        // Comparer le mot de passe
        const passwordCorrect = await bcrypt.compare(
            mot_de_passe,
            user.mot_de_passe
        );

        if (!passwordCorrect) {
            return res.status(401).json({
                message: "Email ou mot de passe incorrect"
            });
        }

        // Créer le token
        const token = jwt.sign(
            {
                id: user.id_utilisateur,
                role: user.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1h"
            }
        );

        res.json({
            message: "Connexion réussie",
            token: token,
            user: {
                id: user.id_utilisateur,
                nom: user.nom,
                prenom: user.prenom,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Erreur serveur"
        });
    }
}