-- Active: 1783406251958@@localhost@5432
create table profs(
    id_prof SERIAL PRIMARY key,
    Nom varchar (50),
    prénom varchar (50),
    matière varchar (50)  
);

create table classe(
    id_classe SERIAL primary key,
    nom_classe VARCHAR (50) not null,
    niveau VARCHAR (50)
);


create table élèves(
    id_eleve SERIAL primary key,
    nom varchar (100) not null,
    prenom varchar (100) not null,
    date_naissance date,
    id_classe int,
    Foreign Key (id_classe) REFERENCES classe(id_classe)
);

create table matiere(
    id_matiere SERIAL primary key,
    nom_matiere varchar (100) not null,
    id_prof int,
    Foreign Key (id_prof) REFERENCES profs(id_prof)
);

create table note(
    id_note SERIAL primary key,
    id_eleve int not null,
    id_matiere int not null,
    note decimal (5,2),
    date_note date default CURRENT_DATE,
    Foreign Key (id_eleve) REFERENCES élèves (id_eleve),
    Foreign Key (id_matiere) REFERENCES matiere (id_matiere)
);


ALTER TABLE classe
ADD COLUMN nbr_eleve VARCHAR (20);

ALTER TABLE élèves
ADD COLUMN sexe VARCHAR(20);

ALTER TABLE élèves
ADD COLUMN lieu_naissance VARCHAR(150);

ALTER TABLE élèves
ADD COLUMN adresse TEXT;

ALTER TABLE élèves
ADD COLUMN telephone VARCHAR(30);

ALTER TABLE élèves
ADD COLUMN email VARCHAR(150);

ALTER TABLE élèves
ADD COLUMN photo VARCHAR(255);

ALTER TABLE élèves
ADD COLUMN nationalite VARCHAR(100);

ALTER TABLE élèves
ADD COLUMN groupe_sanguin VARCHAR(10);

ALTER TABLE élèves
ADD COLUMN allergies TEXT;

ALTER TABLE élèves
ADD COLUMN informations_medicales TEXT;

ALTER TABLE élèves
ADD COLUMN date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

CREATE TABLE annees_scolaires (
    id_annee SERIAL PRIMARY KEY,
    libelle VARCHAR(20) NOT NULL UNIQUE,
    date_debut DATE NOT NULL,
    date_fin DATE NOT NULL,
    active BOOLEAN DEFAULT FALSE
);

CREATE TABLE parents (
    id_parent SERIAL PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    prenom VARCHAR(100) NOT NULL,
    telephone VARCHAR(30),
    email VARCHAR(150),
    adresse TEXT,
    profession VARCHAR(100),
    date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE eleves_parents (
    id_eleve INT NOT NULL,
    id_parent INT NOT NULL,
    lien VARCHAR(50),
    responsable_principal BOOLEAN DEFAULT FALSE,
    PRIMARY KEY (id_eleve, id_parent),
    FOREIGN KEY (id_eleve)REFERENCES élèves(id_eleve)ON DELETE CASCADE,
    FOREIGN KEY (id_parent)REFERENCES parents(id_parent) ON DELETE CASCADE
);

CREATE TABLE inscriptions (
    id_inscription SERIAL PRIMARY KEY,
    id_eleve INT NOT NULL,
    id_classe INT NOT NULL,
    id_annee INT NOT NULL,
    date_inscription DATE DEFAULT CURRENT_DATE,
    type_inscription VARCHAR(30) NOT NULL
        CHECK (
            type_inscription IN (
                'INSCRIPTION',
                'REINSCRIPTION'
            )
        ),
        statut VARCHAR(30) DEFAULT 'EN_ATTENTE'
        CHECK (
            statut IN (
                'EN_ATTENTE',
                'VALIDEE',
                'REFUSEE'
            )
        ),

    observation TEXT,
    FOREIGN KEY (id_eleve)REFERENCES élèves(id_eleve)ON DELETE CASCADE,
    FOREIGN KEY (id_classe)REFERENCES classe(id_classe)ON DELETE RESTRICT,
    FOREIGN KEY (id_annee)REFERENCES annees_scolaires(id_annee)ON DELETE RESTRICT,
    UNIQUE (id_eleve, id_annee)
);

CREATE TABLE pieces_justificatives (
    id_piece SERIAL PRIMARY KEY,
    id_eleve INT NOT NULL,
    type_piece VARCHAR(100) NOT NULL,
    nom_fichier VARCHAR(255),
    chemin_fichier VARCHAR(500),
    statut VARCHAR(30) DEFAULT 'EN_ATTENTE'
        CHECK (
            statut IN (
                'EN_ATTENTE',
                'VALIDE',
                'REFUSE'
            )
        ),

    date_depot TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_eleve)REFERENCES élèves(id_eleve)ON DELETE CASCADE
);

CREATE TABLE historique_scolaire (
    id_historique SERIAL PRIMARY KEY,
    id_eleve INT NOT NULL,
    id_classe INT NOT NULL,
    id_annee INT NOT NULL,
    resultat VARCHAR(50),
    decision VARCHAR(100),
    type_mouvement VARCHAR(50)
        CHECK (
            type_mouvement IN (
                'NORMAL',
                'REDOUBLEMENT',
                'TRANSFERT',
                'ABANDON'
            )
        ),

    observation TEXT
    FOREIGN KEY (id_eleve) REFERENCES élèves (id_eleve) ON DELETE CASCADE,
    FOREIGN KEY (id_classe) REFERENCES classe (id_classe) ON DELETE RESTRICT,
    FOREIGN KEY (id_annee) REFERENCES annees_scolaires (id_annee) ON DELETE RESTRICT
);

CREATE TABLE personnel_administratif (
    id_personnel SERIAL PRIMARY KEY,
    matricule VARCHAR(50) UNIQUE,
    nom VARCHAR(100) NOT NULL,
    prenom VARCHAR(100) NOT NULL,
    poste VARCHAR(100),
    telephone VARCHAR(30),
    email VARCHAR(150),
    adresse TEXT,
    date_naissance DATE,
    date_embauche DATE,
    statut VARCHAR(50) DEFAULT 'ACTIF'
);

CREATE TABLE contrats_profs (
    id_contrat SERIAL PRIMARY KEY,
    id_prof INT NOT NULL,
    type_contrat VARCHAR(100),
    date_debut DATE NOT NULL,
    date_fin DATE,
    salaire DECIMAL(12,2),
    statut VARCHAR(50) DEFAULT 'ACTIF',
    FOREIGN KEY (id_prof)REFERENCES profs(id_prof)ON DELETE CASCADE
);

CREATE TABLE diplomes_profs (
    id_diplome SERIAL PRIMARY KEY,
    id_prof INT NOT NULL,
    nom_diplome VARCHAR(150) NOT NULL,
    institution VARCHAR(150),
    annee_obtention INT,
    document VARCHAR(255),
    FOREIGN KEY (id_prof)REFERENCES profs(id_prof)ON DELETE CASCADE
);

CREATE TABLE affectations (
    id_affectation SERIAL PRIMARY KEY,
    id_prof INT NOT NULL,
    id_classe INT NOT NULL,
    id_matiere INT NOT NULL,
    id_annee INT NOT NULL,
    FOREIGN KEY (id_prof)REFERENCES profs(id_prof)ON DELETE CASCADE,
    FOREIGN KEY (id_classe)REFERENCES classe(id_classe)ON DELETE CASCADE,
    FOREIGN KEY (id_matiere)REFERENCES matiere(id_matiere)ON DELETE CASCADE,
    FOREIGN KEY (id_annee)REFERENCES annees_scolaires(id_annee)ON DELETE CASCADE,
    UNIQUE (
        id_prof,
        id_classe,
        id_matiere,
        id_annee
    )
);

CREATE TABLE salles (
    id_salle SERIAL PRIMARY KEY,
    nom_salle VARCHAR(100) NOT NULL UNIQUE,
    capacite INT,
    type_salle VARCHAR(100),
    ressources TEXT,
    CHECK (capacite IS NULL OR capacite > 0)
);

CREATE TABLE emploi_du_temps (
    id_edt SERIAL PRIMARY KEY,
    id_classe INT NOT NULL,
    id_prof INT NOT NULL,
    id_matiere INT NOT NULL,
    id_salle INT,
    id_annee INT NOT NULL,
    jour VARCHAR(20) NOT NULL,
    heure_debut TIME NOT NULL,
    heure_fin TIME NOT NULL,
    FOREIGN KEY (id_classe) REFERENCES classe(id_classe) ON DELETE CASCADE,
    FOREIGN KEY (id_prof)REFERENCES profs(id_prof)ON DELETE CASCADE,
    FOREIGN KEY (id_matiere)REFERENCES matiere(id_matiere)ON DELETE CASCADE,
    FOREIGN KEY (id_salle)REFERENCES salles(id_salle)ON DELETE SET NULL,
    FOREIGN KEY (id_annee)REFERENCES annees_scolaires(id_annee)ON DELETE CASCADE,
    CHECK (heure_fin > heure_debut)
);

CREATE TABLE evaluations (
    id_evaluation SERIAL PRIMARY KEY,
    nom_evaluation VARCHAR(150) NOT NULL,
    type_evaluation VARCHAR(50),
    id_matiere INT NOT NULL,
    id_classe INT NOT NULL,
    id_annee INT NOT NULL,
    coefficient DECIMAL(5,2) DEFAULT 1,
    date_evaluation DATE,
    FOREIGN KEY (id_matiere) REFERENCES matiere(id_matiere) ON DELETE CASCADE,
    FOREIGN KEY (id_classe) REFERENCES classe(id_classe) ON DELETE CASCADE,
    FOREIGN KEY (id_annee) REFERENCES annees_scolaires(id_annee) ON DELETE CASCADE,
    CHECK (coefficient > 0)
);

ALTER TABLE note
ADD COLUMN id_evaluation INT;

CREATE TABLE absences (
    id_absence SERIAL PRIMARY KEY,
    id_eleve INT NOT NULL,
    id_edt INT,
    id_matiere INT,
    date_absence DATE NOT NULL,
    heure_debut TIME,
    heure_fin TIME,
    motif TEXT,
    justifiee BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (id_eleve) REFERENCES élèves(id_eleve) ON DELETE CASCADE,
    FOREIGN KEY (id_edt) REFERENCES emploi_du_temps(id_edt) ON DELETE SET NULL,
    FOREIGN KEY (id_matiere) REFERENCES matiere(id_matiere) ON DELETE SET NULL
);

CREATE TABLE conges_profs (
    id_conge SERIAL PRIMARY KEY,
    id_prof INT NOT NULL,
    type_conge VARCHAR(100),
    date_debut DATE NOT NULL,
    date_fin DATE NOT NULL,
    motif TEXT,
    statut VARCHAR(30) DEFAULT 'EN_ATTENTE'
        CHECK (
            statut IN (
                'EN_ATTENTE',
                'ACCEPTE',
                'REFUSE'
            )
        ),
    FOREIGN KEY (id_prof) REFERENCES profs(id_prof) ON DELETE CASCADE,
    CHECK (date_fin >= date_debut)
);

CREATE TABLE remplacements (
    id_remplacement SERIAL PRIMARY KEY,
    id_prof_absent INT NOT NULL,
    id_prof_remplacant INT NOT NULL,
    id_edt INT,
    date_remplacement DATE NOT NULL,
    motif TEXT,
    FOREIGN KEY (id_prof_absent) REFERENCES profs(id_prof) ON DELETE CASCADE,
    FOREIGN KEY (id_prof_remplacant) REFERENCES profs(id_prof) ON DELETE CASCADE,
    FOREIGN KEY (id_edt) REFERENCES emploi_du_temps(id_edt) ON DELETE SET NULL
);

CREATE TABLE  heures_cours (
    id_heure SERIAL PRIMARY KEY,
    id_prof INT NOT NULL,
    id_edt INT,
    date_cours DATE NOT NULL,
    heures_effectuees DECIMAL(5,2) NOT NULL,
    FOREIGN KEY (id_prof) REFERENCES profs(id_prof) ON DELETE CASCADE,
    FOREIGN KEY (id_edt) REFERENCES emploi_du_temps(id_edt) ON DELETE SET NULL,
    CHECK (heures_effectuees >= 0)
);

CREATE TABLE evaluations_profs (
    id_evaluation SERIAL PRIMARY KEY,
    id_prof INT NOT NULL,
    date_evaluation DATE NOT NULL,
    note DECIMAL(5,2),
    commentaire TEXT,
    FOREIGN KEY (id_prof) REFERENCES profs(id_prof) ON DELETE CASCADE,
    CHECK (
        note IS NULL
        OR (note >= 0 AND note <= 20)
    )
);

CREATE TABLE frais_scolarite (
    id_frais SERIAL PRIMARY KEY,
    id_annee INT NOT NULL,
    id_classe INT,
    libelle VARCHAR(150) NOT NULL,
    montant DECIMAL(12,2) NOT NULL,
    date_echeance DATE,
    description TEXT,
    FOREIGN KEY (id_annee) REFERENCES annees_scolaires(id_annee) ON DELETE CASCADE,
    FOREIGN KEY (id_classe) REFERENCES classe(id_classe) ON DELETE SET NULL,
    CHECK (montant >= 0)
);

CREATE TABLE paiements (
    id_paiement SERIAL PRIMARY KEY,
    id_eleve INT NOT NULL,
    id_frais INT NOT NULL,
    montant DECIMAL(12,2) NOT NULL,
    date_paiement DATE DEFAULT CURRENT_DATE,
    mode_paiement VARCHAR(50),
    reference_paiement VARCHAR(100),
    statut VARCHAR(30) DEFAULT 'PAYE'
        CHECK (
            statut IN (
                'PAYE',
                'PARTIEL',
                'ANNULE'
            )
        ),
    FOREIGN KEY (id_eleve) REFERENCES élèves(id_eleve) ON DELETE CASCADE,
    FOREIGN KEY (id_frais) REFERENCES frais_scolarite(id_frais) ON DELETE RESTRICT,
    CHECK (montant > 0)
);

CREATE TABLE devoirs (
    id_devoir SERIAL PRIMARY KEY,
    id_prof INT NOT NULL,
    id_classe INT NOT NULL,
    id_matiere INT NOT NULL,
    titre VARCHAR(200) NOT NULL,
    description TEXT,
    date_publication TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    date_limite DATE,
    document VARCHAR(255),
    FOREIGN KEY (id_prof) REFERENCES profs(id_prof) ON DELETE CASCADE,
    FOREIGN KEY (id_classe) REFERENCES classe(id_classe) ON DELETE CASCADE,
    FOREIGN KEY (id_matiere) REFERENCES matiere(id_matiere) ON DELETE CASCADE
);

CREATE TABLE ressources_pedagogiques (
    id_ressource SERIAL PRIMARY KEY,
    id_prof INT,
    id_matiere INT,
    id_classe INT,
    titre VARCHAR(200) NOT NULL,
    description TEXT,
    fichier VARCHAR(255),
    date_publication TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_prof) REFERENCES profs(id_prof) ON DELETE SET NULL,
    FOREIGN KEY (id_matiere) REFERENCES matiere(id_matiere) ON DELETE SET NULL,
    FOREIGN KEY (id_classe) REFERENCES classe(id_classe) ON DELETE SET NULL
);

CREATE TABLE cahier_texte (
    id_cahier SERIAL PRIMARY KEY,
    id_prof INT NOT NULL,
    id_classe INT NOT NULL,
    id_matiere INT NOT NULL,
    date_cours DATE NOT NULL,
    contenu TEXT NOT NULL,
    devoirs TEXT,
    FOREIGN KEY (id_prof)REFERENCES profs(id_prof) ON DELETE CASCADE,
    FOREIGN KEY (id_classe)REFERENCES classe(id_classe) ON DELETE CASCADE,
    FOREIGN KEY (id_matiere)REFERENCES matiere(id_matiere) ON DELETE CASCADE
);

CREATE utilisateurs (
    id_utilisateur SERIAL PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    prenom VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    mot_de_passe VARCHAR(255) NOT NULL,
    role VARCHAR(30) NOT NULL
        CHECK (
            role IN (
                'ADMIN',
                'PROF',
                'ELEVE',
                'PARENT'
            )
        ),
    actif BOOLEAN DEFAULT TRUE,
    date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE utilisateurs_eleves (
    id_utilisateur INT PRIMARY KEY,
    id_eleve INT UNIQUE NOT NULL,
    FOREIGN KEY (id_utilisateur)REFERENCES utilisateurs(id_utilisateur)ON DELETE CASCADE,
    FOREIGN KEY (id_eleve)REFERENCES élèves(id_eleve)ON DELETE CASCADE
);

CREATE TABLE utilisateurs_parents (
    id_utilisateur INT PRIMARY KEY,
    id_parent INT UNIQUE NOT NULL,
    FOREIGN KEY (id_utilisateur)REFERENCES utilisateurs(id_utilisateur)ON DELETE CASCADE,
    FOREIGN KEY (id_parent)REFERENCES parents(id_parent)ON DELETE CASCADE
);

CREATE TABLE messages (
    id_message SERIAL PRIMARY KEY,
    id_expediteur INT NOT NULL,
    id_destinataire INT NOT NULL,
    sujet VARCHAR(200),
    contenu TEXT NOT NULL,
    date_envoi TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    lu BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (id_expediteur)REFERENCES utilisateurs(id_utilisateur)ON DELETE CASCADE,
    FOREIGN KEY (id_destinataire)REFERENCES utilisateurs(id_utilisateur)ON DELETE CASCADE
);

CREATE TABLE notifications (
    id_notification SERIAL PRIMARY KEY,
    id_utilisateur INT NOT NULL,
    titre VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    type_notification VARCHAR(50),
    lu BOOLEAN DEFAULT FALSE,
    date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    FOREIGN KEY (id_utilisateur)REFERENCES utilisateurs(id_utilisateur)ON DELETE CASCADE
);

