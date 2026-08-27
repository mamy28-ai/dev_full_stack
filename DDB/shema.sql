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