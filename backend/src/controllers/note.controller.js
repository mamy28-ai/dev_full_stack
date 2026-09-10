import createPool from "../config/datasource.js";

export async function getAllNote(req, res) {
  try {
    const pool = createPool(); 
    const result = await pool.query("SELECT * FROM note");
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function createNote(req, res) {
  try {
    const pool = createPool();
    const { note, date_note, id_eleve, id_matiere } = req.body;

    console.log("Données à insérer :", { note, date_note, id_eleve, id_matiere });

    const result = await pool.query(
      `INSERT INTO note (note, date_note, id_eleve, id_matiere)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [parseFloat(note), date_note, parseInt(id_eleve), parseInt(id_matiere)]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Erreur SQL dans createNote :", error.message);
    res.status(500).json({ error: error.message });
  }
}

export async function updateNote(req, res) {
  try {
    const { id } = req.params;
    const { note, date_note, id_eleve, id_matiere } = req.body;

    const result = await pool.query(
      `UPDATE note
       SET note = $1,
           date_note = $2,
           id_eleve = $3,
           id_matiere = $4
       WHERE id_note = $5 
       RETURNING *`,
      [note, date_note, id_eleve, id_matiere, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Note introuvable" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function deleteNote(req, res) {
  try {
    const { id } = req.params;

    const result = await pool.query(
      "DELETE FROM note WHERE id_note = $1 RETURNING *",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Note introuvable" });
    }

    res.json({
      message: "Note supprimée avec succès",
      note: result.rows[0]
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}