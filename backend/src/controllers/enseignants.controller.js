import createPool from "../config/datasource.js";

export async function enregistrerNote(req, res) {
    try {
        const pool = createPool();
        const { id_eleve, id_matiere, note, id_evaluation, date_note } = req.body;

        const result = await pool.query(
            `INSERT INTO note (id_eleve, id_matiere, note, id_evaluation, date_note)
             VALUES ($1, $2, $3, $4, $5)
             RETURNING *`,
            [
                id_eleve, 
                id_matiere, 
                note, 
                id_evaluation || null, 
                date_note || new Date()
            ]
        );

        res.status(201).json({
            message: "Note enregistrée avec succès.",
            data: result.rows[0]
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export async function validerPresence(req, res) {
    try {
        const pool = createPool();
        const { id_eleve, id_matiere, id_edt, date_absence, heure_debut, heure_fin, motif, justifiee } = req.body;

        const result = await pool.query(
            `INSERT INTO absences (id_eleve, id_matiere, id_edt, date_absence, heure_debut, heure_fin, motif, justifiee)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
             RETURNING *`,
            [
                id_eleve,
                id_matiere || null,
                id_edt || null,
                date_absence,
                heure_debut || null,
                heure_fin || null,
                motif || null,
                justifiee || false
            ]
        );

        res.status(201).json({
            message: "Absence consignée avec succès.",
            data: result.rows[0]
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export async function ajouterDevoir(req, res) {
    try {
        const pool = createPool();
        const { id_prof, id_classe, id_matiere, date_cours, contenu, devoirs } = req.body;

        const result = await pool.query(
            `INSERT INTO cahier_texte (id_prof, id_classe, id_matiere, date_cours, contenu, devoirs)
             VALUES ($1, $2, $3, $4, $5, $6)
             RETURNING *`,
            [id_prof, id_classe, id_matiere, date_cours, contenu, devoirs || null]
        );

        res.status(201).json({
            message: "Cahier de texte mis à jour.",
            data: result.rows[0]
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export async function envoyerMessageParent(req, res) {
    try {
        const pool = createPool();
        const { id_expediteur, id_destinataire, sujet, contenu } = req.body;

        const result = await pool.query(
            `INSERT INTO messages (id_expediteur, id_destinataire, sujet, contenu)
             VALUES ($1, $2, $3, $4)
             RETURNING *`,
            [id_expediteur, id_destinataire, sujet, contenu]
        );

        res.status(201).json({
            message: "Message envoyé avec succès.",
            data: result.rows[0]
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}