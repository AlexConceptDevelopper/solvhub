import { Helmet } from "react-helmet-async";
import BackButton from "../components/BackButton";

export default function LegalNotice() {
  return (
    <>
      <Helmet>
        <title>Mentions Légales | SolvHub</title>
        <meta name="description" content="Consultez les mentions légales de la plateforme SolvHub." />
      </Helmet>

      <div className="max-w-4xl mx-auto px-4 py-12 space-y-6">
        <BackButton to="/" label="Retour à l'accueil" />
        <h1 className="text-3xl font-bold text-slate-900">Mentions Légales</h1>
        <div className="prose prose-slate text-slate-600 space-y-4">
          <p>
            Conformément aux dispositions de la loi n° 2004-575 du 21 juin 2004
            pour la confiance dans l'économie numérique, il est précisé aux
            utilisateurs du site SolvHub l'identité des différents intervenants
            dans le cadre de sa réalisation et de son suivi.
          </p>

          <h2 className="text-xl font-semibold text-slate-800">
            Édition du site
          </h2>
          <p>
            Le présent site, accessible à l'URL solvhub.fr, est édité à titre non
            professionnel par un particulier.
          </p>
          <p>
            Conformément à la législation en vigueur, les coordonnées de l'éditeur
            (nom, prénom, adresse et téléphone) ont été communiquées à l'hébergeur
            du site. Pour toute question ou réclamation, vous pouvez nous
            contacter par email à : contact@solvhub.fr
          </p>

          <h2 className="text-xl font-semibold text-slate-800">Hébergement</h2>
          <p>
            Le site est hébergé par : <strong>Railway</strong> (railway.com).
          </p>
        </div>
      </div>
    </>
  );
}