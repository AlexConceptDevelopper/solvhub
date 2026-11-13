import { Helmet } from "react-helmet-async";
import BackButton from "../components/BackButton";

export default function LegalNotice() {
  return (
    <>
      <Helmet>
        <title>Mentions Légales | SolvHub</title>
        <meta name="description" content="Consultez les mentions légales et informations officielles de la plateforme SolvHub." />
      </Helmet>

      <div className="max-w-4xl mx-auto px-4 py-12 space-y-6">
        <BackButton to="/" label="Retour à l'accueil" />
        <h1 className="text-3xl font-bold text-slate-900">Mentions Légales</h1>
        <div className="prose prose-slate text-slate-600 space-y-6">
          <p>
            Conformément aux dispositions de la loi n° 2004-575 du 21 juin 2004
            pour la confiance dans l'économie numérique (LCEN), il est précisé aux
            utilisateurs du site <strong>solvhub.fr</strong> l'identité des différents intervenants
            dans le cadre de sa réalisation et de son suivi.
          </p>

          <section className="space-y-2">
            <h2 className="text-xl font-semibold text-slate-800">
              1. Édition du site
            </h2>
            <p>
              Le présent site est édité par l'entreprise individuelle <strong>CubTaik</strong> :
            </p>
            <ul className="list-disc pl-5 space-y-1 text-sm">
              <li><strong>Entrepreneur individuel :</strong> Alexandre Cubizolle</li>
              <li><strong>Nom commercial :</strong> CubTaik</li>
              <li><strong>SIREN :</strong> 109 752 832</li>
              <li><strong>Siège social :</strong> 3 Chem des Brandes, 17600 Sablonceaux, France</li>
              <li><strong>TVA :</strong> TVA non applicable, art. 293 B du CGI</li>
              <li><strong>Directeur de la publication :</strong> Alexandre Cubizolle</li>
              <li>
                <strong>Contact :</strong>{" "}
                <a href="mailto:contact@solvhub.fr" className="text-blue-600 hover:underline">
                  contact@solvhub.fr
                </a>
              </li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-xl font-semibold text-slate-800">
              2. Hébergement et Infrastructure
            </h2>
            <ul className="list-disc pl-5 space-y-1 text-sm">
              <li>
                <strong>Hébergement de la plateforme :</strong> Railway Corp. — 548 Market St PMB 68956, San Francisco, CA 94104, États-Unis (railway.com).
              </li>
              <li>
                <strong>Sécurité & CDN :</strong> Cloudflare, Inc. — 101 Townsend St, San Francisco, CA 94107, États-Unis.
              </li>
            </ul>
          </section>
        </div>
      </div>
    </>
  );
}