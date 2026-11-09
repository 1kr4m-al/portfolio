
import { useEffect, useState, useRef, type TouchEvent } from "react";
import "./App.css";

const TEXTE = "Portfolio de\nIkram Alouli";


type Page =
  | "accueil"
  | "competences"
  | "experience"
  | "projets"
  | "formation";

type Section = {
  id: Exclude<Page, "accueil">;
  numero: string;
  titre: string;
  description: string;
};

type Formation = {
  periode: string;
  titre: string;
  etablissement: string;
  lieu: string;
  description: string;
};


const sections: Section[] = [
  {
    id: "competences",
    numero: "01",
    titre: "Compétences",
    description: "Mes compétences techniques et linguistiques.",
  },

  {
    id: "experience",
    numero: "02",
    titre: "Expérience professionnelle",
    description: "Mes expériences professionnelles.",
  },
  {
    id: "projets",
    numero: "03",
    titre: "Projets",
    description: "Découvrez les projets que j'ai réalisés.",
  },
  {
    id: "formation",
    numero: "04",
    titre: "Formation",
    description: "Découvrez mon parcours académique.",
  },
];


const competences = [
  {
    titre: "Langages de programmation",
    elements: ["Java", "Python", "C", "PHP", "SQL"],
  },
  {
    titre: "Développement web",
    elements: ["HTML", "CSS", "JavaScript", "React", "Spring Boot"],
  },
  {
    titre: "Outils et environnements",
    elements: ["Git", "GitLab", "VS Code", "Linux"],
  },
  {
    titre: "Concepts informatiques",
    elements: [
      "Programmation orientée objet",
      "Structures de données",
      "Algorithmique",
      "Bases de données",
    ],
  },
];

const langues = [
  { nom: "Français", niveau: "" },
  { nom: "Anglais", niveau: "C1" },
  { nom: "Arabe", niveau: "" },
];


const projets = [
  {
    nom: "FractaLens",
    categorie: "Application Java",
    description:
      "Développement d'une application de génération de fractales, utilisant des algorithmes mathématiques et des tests unitaires.",
    technologies: ["Java", "Gradle", "JUnit", "GitLab"],
  },
  {
    nom: "Gestion d'un cabinet médical",
    categorie: "Application de bureau",
    description:
      "Conception d'une application permettant de gérer les patients, les rendez-vous et les ordonnances médicales.",
    technologies: ["Java", "JavaFX", "POO"],
  },
  {
    nom: "SeaClean",
    categorie: "Développement web",
    description:
      "Création d'un site web dédié à la protection des océans, avec présentation des activités et réservation de sorties en mer.",
    technologies: ["HTML", "CSS"],
  },
  {
    nom: "Pac-Man",
    categorie: "Jeu vidéo",
    description:
      "Développement d'un jeu Pac-Man avec une interface graphique, gestion des déplacements, collisions et score.",
    technologies: ["Java", "JavaFX"],
  },

  {
    nom: "Space Invaders",
    categorie: "Jeu vidéo",
    description:
      "Développement en équipe d'un jeu Space Invaders, avec gestion des déplacements des aliens, des collisions et des conditions de défaite.",
    technologies: ["Java", "JavaFX", "Gradle", "GitLab"],
  },

];


const formations: Formation[] = [
  {
    periode: "2025 – 2028",
    titre: "BUT Informatique",
    etablissement: "IUT de Lens – Université d'Artois",
    lieu: "Lens, France",
    description:
      "Formation en informatique axée sur le développement d'applications, l'algorithmique, les bases de données, les réseaux et la gestion de projets.",
  },
  {
    periode: "2023 – 2025",
    titre: "Formation en ingénierie informatique et industrielle",
    etablissement: "IG2I – École d'ingénieurs",
    lieu: "Lens, France",
    description:
      "Formation scientifique et technique qui m'a permis d'acquérir des bases solides en informatique, en mathématiques et en ingénierie.",
  },
  {
    periode: "2023",
    titre: "Baccalauréat scientifique",
    etablissement: "Casablanca, Maroc",
    lieu: "",
    description:
      "Parcours scientifique qui m'a permis de développer mon raisonnement logique, ma rigueur et mon intérêt pour les sciences.",
  },
];


function FormationDynamique({ formations }: { formations: Formation[] }) {
  const [etapeActive, setEtapeActive] = useState(0);
  const [aInteragi, setAInteragi] = useState(false);

  
  const zoneRef = useRef<HTMLDivElement | null>(null);
  const dernierScroll = useRef<number>(0);
  const accumulation = useRef<number>(0);
  const dernierEvenement = useRef<number>(0);
  const debutTouch = useRef<number | null>(null);


  // Passer à la formation suivante ou précédente
  function changerEtape(direction: number) {
    setEtapeActive((actuelle) =>
      Math.max(0, Math.min(formations.length - 1, actuelle + direction))
    );
    setAInteragi(true);
  }

  // Navigation avec la molette ou le trackpad
  
  

useEffect(() => {
  const panneau = zoneRef.current?.closest(".panneau");

  if (!panneau) return;

  function gererScroll(event: Event) {
    if (!panneau || !panneau.classList.contains("panneau--active")) return;

    const wheelEvent = event as WheelEvent;

    event.preventDefault();

    const maintenant = Date.now();

    if (maintenant - dernierScroll.current < 850) return;

    if (maintenant - dernierEvenement.current > 180) {
      accumulation.current = 0;
    }

    dernierEvenement.current = maintenant;
    accumulation.current += wheelEvent.deltaY;

    if (Math.abs(accumulation.current) < 40) return;

    const direction = accumulation.current > 0 ? 1 : -1;

    accumulation.current = 0;
    dernierScroll.current = maintenant;

    changerEtape(direction);
  }

  panneau.addEventListener("wheel", gererScroll, { passive: false });

  return () => {
    panneau.removeEventListener("wheel", gererScroll);
  };
}, [formations.length]);




  // Navigation tactile
  function commencerTouch(event: TouchEvent<HTMLDivElement>) {
    debutTouch.current = event.touches[0].clientY;
  }

  function terminerTouch(event: TouchEvent<HTMLDivElement>) {
    if (debutTouch.current === null) return;

    const distance = debutTouch.current - event.changedTouches[0].clientY;

    if (Math.abs(distance) > 50) {
      changerEtape(distance > 0 ? 1 : -1);
    }

    debutTouch.current = null;
  }

  return (
    <div className="formation" ref={zoneRef}>

      <p className="formation__intro">
        Mon parcours académique m'a permis de construire
        progressivement mes compétences en informatique.
        Découvrez les différentes étapes de ma formation.
      </p>

      {/* Fenêtre montrant une seule formation */}
      <div
        className="formation__fenetre"
        tabIndex={0}
        onTouchStart={commencerTouch}
        onTouchEnd={terminerTouch}
        onKeyDown={(event) => {
          if (event.key === "ArrowDown") {
            event.preventDefault();
            changerEtape(1);
          } else if (event.key === "ArrowUp") {
            event.preventDefault();
            changerEtape(-1);
          }
        }}
      >

        <div
          className={`formation__piste ${
            !aInteragi && etapeActive === 0
              ? "formation__piste--indice"
              : ""
          }`}
          style={{
            transform: `translateY(-${etapeActive * 100}%)`,
          }}
        >

          {formations.map((formation, index) => (

            <article className="formation__etape" key={index}>
              <div className="formation__carte">

                <span className="formation__periode">
                  {formation.periode}
                </span>

                <div className="formation__details">
                  <span className="formation__etape-numero">
                    ÉTAPE {String(index + 1).padStart(2, "0")}
                  </span>

                  <h3>{formation.titre}</h3>

                  <h4>{formation.etablissement}</h4>

                  {formation.lieu && (
                    <p className="formation__lieu">
                      {formation.lieu}
                    </p>
                  )}

                  <p className="formation__description">
                    {formation.description}
                  </p>
                </div>

              </div>
            </article>

          ))}

        </div>
      </div>

      {/* Indications de navigation */}
      <div className="formation__navigation">

        <span className="formation__compteur">
          {String(etapeActive + 1).padStart(2, "0")}
          {" / "}
          {String(formations.length).padStart(2, "0")}
        </span>

        <span className="formation__indication">
          {etapeActive < formations.length - 1
            ? "Scrolle ou glisse pour découvrir la suite ↓"
            : "Remonte pour revoir les étapes ↑"}
        </span>

        <div className="formation__fleches">

          <button
            onClick={() => changerEtape(-1)}
            disabled={etapeActive === 0}
            aria-label="Formation précédente"
          >
            ↑
          </button>

          <button
            onClick={() => changerEtape(1)}
            disabled={etapeActive === formations.length - 1}
            aria-label="Formation suivante"
          >
            ↓
          </button>

        </div>

      </div>

    </div>
  );
}




function App() {
  const [nombreLettres, setNombreLettres] = useState(0);
  const [presentationVisible, setPresentationVisible] = useState(false);
  const [pageActive, setPageActive] = useState<Page>("accueil");
  const [pageSortante, setPageSortante] = useState<Page | null>(null);
  const [menuOuvert, setMenuOuvert] = useState(false);

  // Animation du texte au clavier
  useEffect(() => {
    if (nombreLettres < TEXTE.length) {
      const minuterie = setTimeout(() => {
        setNombreLettres((ancienNombre) => ancienNombre + 1);
      }, nombreLettres === 0 ? 450 : 85);

      return () => clearTimeout(minuterie);
    }

    const minuterie = setTimeout(() => {
      setPresentationVisible(true);
    }, 650);

    return () => clearTimeout(minuterie);
  }, [nombreLettres]);

  const texteAffiche = TEXTE.slice(0, nombreLettres);
  const [premiereLigne, deuxiemeLigne] = texteAffiche.split("\n");
  const deuxiemeLigneCommencee = texteAffiche.includes("\n");

  
  function changerPage(page: Page) {
    if (page === pageActive) {
      setMenuOuvert(false);
      return;
    }

    setPageSortante(pageActive);
    setPageActive(page);
    setMenuOuvert(false);
  }


  return (
    
  <main
    className="portfolio"
    onTransitionEnd={(event) => {
      const cible = event.target as HTMLElement;

      if (
        event.propertyName === "transform" &&
        (cible.classList.contains("panneau--active") ||
          cible.classList.contains("hero--active"))
      ) {
        setPageSortante(null);
      }
    }}
  >


      {/* LIEN DE CONTACT */}
      {/*
      <a
        href="COLLE_ICI_TON_LIEN_LINKEDIN"
        target="_blank"
        rel="noopener noreferrer"
        className="contact-link"
      >
        <span className="contact-link__logo">in</span>
        <span>LinkedIn · Contact ↗</span>
      </a>
      
      */}


      {/* PAGE D'ACCUEIL */}
      
      <section
        className={`hero ${presentationVisible ? "hero--visible" : ""} ${
          pageActive === "accueil" ? "hero--active" : ""
        } ${
          pageSortante === "accueil" ? "hero--sortant" : ""
        }`}
        inert={pageActive !== "accueil"}
      >



        
      <header className="hero__entete">
        <span>STAGE · AVRIL 2027</span>
      </header>


        <div className="hero__contenu">
          <p className="hero__sur-titre">
            BUT 2 INFORMATIQUE · IUT DE LENS
          </p>

          <h1 className="hero__titre">
            <span className="hero__ligne">
              {premiereLigne}
              {!deuxiemeLigneCommencee && (
                <span className="curseur" />
              )}
            </span>

            {deuxiemeLigneCommencee && (
              <span className="hero__nom">
                {deuxiemeLigne}
                <span
                  className={`curseur ${
                    presentationVisible ? "curseur--cache" : ""
                  }`}
                />
              </span>
            )}
          </h1>

          <div className="hero__apparition">
            <div className="hero__apparition-interieur">
              <p className="hero__introduction">
                Étudiante en deuxième année de BUT Informatique
                à l'IUT de Lens, je recherche un{" "}
                <strong>
                  stage de 8 à 10 semaines à partir d'avril 2027.
                </strong>{" "}
                J'aime donner vie à des idées, construire des
                applications et apprendre à travers des projets
                concrets.
              </p>

              
              
              <nav className="hero__boutons">
                <button
                  className="bouton bouton--accueil"
                  onClick={() => changerPage("competences")}
                >
                  Compétences
                </button>

                <button
                  className="bouton bouton--accueil"
                  onClick={() => changerPage("experience")}
                >
                  Expérience pro
                </button>

                <button
                  className="bouton bouton--accueil"
                  onClick={() => changerPage("projets")}
                >
                  Projets
                </button>

                <button
                  className="bouton bouton--accueil"
                  onClick={() => changerPage("formation")}
                >
                  Formation
                </button>
              </nav>


            </div>
          </div>
        </div>

        <p className="hero__bas">
          CRÉATIVITÉ ✦ CODE ✦ CURIOSITÉ
        </p>
      </section>

      {/* SECTIONS COULISSANTES */}
      {sections.map((section) => (
        
        <section
          key={section.id}
          className={`section section--pleine panneau panneau--${section.id} ${
            pageActive === section.id ? "panneau--active" : ""
          } ${
            pageSortante === section.id ? "panneau--sortant" : ""
          }`}
          inert={pageActive !== section.id}
        >

          <div className={`menu-navigation ${menuOuvert ? "menu-navigation--ouvert" : ""}`}>

              <button
                className="menu-navigation__bouton"
                onClick={() => setMenuOuvert(!menuOuvert)}
                aria-expanded={menuOuvert}
              >
                <span>☰ Menu</span>
                <span className="menu-navigation__fleche">⌄</span>
              </button>

              
              <nav className="menu-navigation__liste" inert={!menuOuvert}>

                <button onClick={() => changerPage("accueil")}>
                  Accueil
                </button>

                {sections.map((sectionMenu) => (
                  <button
                    key={sectionMenu.id}
                    onClick={() => changerPage(sectionMenu.id)}
                    className={
                      pageActive === sectionMenu.id
                        ? "menu-navigation__actif"
                        : ""
                    }
                    aria-current={
                      pageActive === sectionMenu.id ? "page" : undefined
                    }
                  >
                    {sectionMenu.id === "experience"
                      ? "Expérience pro"
                      : sectionMenu.titre}
                  </button>
                ))}

              </nav>


            </div>
          <div className="section__contenu">
            <span className="section__numero">
              / {section.numero}
            </span>

            <h2>{section.titre}</h2>
            
            {section.id === "experience" ? (
              <div className="experience">

                <p className="experience__intro">
                  Mes expériences professionnelles m'ont permis de découvrir
                  différents environnements de travail, de développer mes
                  compétences techniques et de renforcer mon esprit d'équipe.
                  Découvrez les deux stages qui ont marqué mon parcours.
                </p>

                <div className="experience__cartes">

                  {/* STAGE 1 : PCA */}
                  <article className="experience__carte">

                    <div className="experience__carte-haut">
                      <span className="experience__annee">2025</span>
                    </div>

                    <h3>Stagiaire développeuse web</h3>

                    <h4>Payment Center for Africa (PCA)</h4>

                    <p className="experience__lieu">
                      Casablanca, Maroc
                    </p>

                    <div className="experience__separateur"></div>

                    <p className="experience__description">
                      Au sein d'une entreprise spécialisée dans les solutions
                      de paiement électronique, j'ai participé au développement
                      d'une application web de gestion de tickets.
                    </p>

                    <ul>
                      <li>Développement d'une interface utilisateur avec React.</li>
                      <li>Collaboration avec un ingénieur chef de projet.</li>
                      <li>Participation à un projet utilisant React et Spring Boot.</li>
                    </ul>

                    <div className="experience__technologies">
                      <span>React</span>
                      <span>Spring Boot</span>
                      <span>Développement web</span>
                    </div>

                  </article>

                  {/* STAGE 2 : APEX */}
                  <article className="experience__carte">

                    <div className="experience__carte-haut">
                      <span className="experience__annee">2024</span>
                    </div>

                    <h3>Stagiaire en comptabilité</h3>

                    <h4>APEX Consulting</h4>

                    <p className="experience__lieu">
                      Casablanca, Maroc
                    </p>

                    <div className="experience__separateur"></div>

                    <p className="experience__description">
                      Cette première expérience professionnelle m'a permis
                      de découvrir le fonctionnement d'une entreprise
                      et de développer ma rigueur ainsi que mon sens
                      de l'organisation.
                    </p>

                    <ul>
                      <li>Participation aux tâches administratives.</li>
                      <li>Suivi des opérations comptables.</li>
                      <li>Collaboration avec l'équipe comptable.</li>
                    </ul>

                    <div className="experience__technologies">
                      <span>Organisation</span>
                      <span>Travail d'équipe</span>
                      <span>Rigueur</span>
                    </div>

                  </article>

                </div>
              </div>
            
              ) : section.id === "projets" ? (

                <div className="projets">

                  <p className="projets__intro">
                    Au fil de ma formation, j'ai eu l'occasion de travailler
                    sur différents projets, allant du développement web
                    à la création d'applications et de jeux.
                    Voici quelques réalisations qui illustrent
                    mes compétences et ma créativité.
                  </p>

                  <div className="projets__grille">

                    {projets.map((projet) => (

                      <article className="projets__carte" key={projet.nom}>

                        <div className="projets__carte-haut">

                          <span className="projets__categorie">
                            {projet.categorie}
                          </span>
                        </div>

                        <h3>{projet.nom}</h3>

                        <p className="projets__description">
                          {projet.description}
                        </p>

                        <div className="projets__technologies">
                          {projet.technologies.map((technologie) => (
                            <span key={technologie}>
                              {technologie}
                            </span>
                          ))}
                        </div>

                      </article>

                    ))}

                  </div>

                </div>

              
              
              
              ) : section.id === "formation" ? (

                <FormationDynamique formations={formations} />

              ) : section.id === "competences" ? (

                <div className="competences">

                  <p className="competences__intro">
                    Au cours de ma formation et de mes projets, j'ai développé
                    des compétences en programmation, en développement web
                    et dans l'utilisation de différents outils informatiques.
                    Voici les technologies et les connaissances que j'ai
                    eu l'occasion de mettre en pratique.
                  </p>

                  {/* COMPETENCES TECHNIQUES */}
                  <div className="competences__grille">

                    {competences.map((categorie) => (

                      <article className="competences__carte" key={categorie.titre}>

                        <h3>{categorie.titre}</h3>

                        <div className="competences__elements">
                          {categorie.elements.map((element) => (
                            <span key={element}>{element}</span>
                          ))}
                        </div>

                      </article>

                    ))}

                  </div>

                  {/* LANGUES */}
                  <div className="competences__langues">

                    <h3>Langues</h3>

                    <div className="competences__langues-liste">
                      {langues.map((langue) => (

                        <div className="competences__langue" key={langue.nom}>

                          <span>{langue.nom}</span>

                          {langue.niveau && (
                            <span className="competences__niveau">
                              {langue.niveau}
                            </span>
                          )}

                        </div>

                      ))}
                    </div>

                  </div>

                </div>

              ) : (
                <p>{section.description}</p>
              )}






            

            

          </div>
        </section>
      ))}
    </main>
  );
}

export default App;
