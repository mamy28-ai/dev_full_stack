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
        const passwordCorrect = await bcrypt.compare(
            mot_de_passe,
            user.mot_de_passe
        );

        if (!passwordCorrect) {
            return res.status(401).json({
                message: "Email ou mot de passe incorrect"
            });
        }
        const token = jwt.sign(
            {
                id: user.id_utilisateur,
                role: user.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1d"
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

export async function signup(req, res) {

    try {
        const pool = createPool();
        const { nom, prenom, email, password, role } = req.body;
        if (!nom || !prenom || !email || !password || !role) {
            return res.status(400).json({
                message: "Tous les champs sont obligatoires"
            });
        }
        const userExist = await pool.query(
            "SELECT * FROM utilisateurs WHERE email = $1",
            [email]
        );
        if (userExist.rows.length > 0) {
            return res.status(409).json({
                message: "Cet email est déjà utilisé"
            });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const result = await pool.query(
            `INSERT INTO utilisateurs
            (nom, prenom, email, mot_de_passe, role, actif)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING id_utilisateur, nom, prenom, email, role, actif`,
            [
                nom,
                prenom,
                email,
                hashedPassword,
                role,
                false
            ]
        );


        return res.status(201).json({
            message: "Compte créé avec succès. En attente de validation par l'administrateur.",
            user: result.rows[0]
        });


    } catch (error) {

        console.error("Erreur signup :", error);

        return res.status(500).json({
            message: "Erreur serveur"
        });
    }
}
