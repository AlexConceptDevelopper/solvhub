import { Helmet } from "react-helmet-async";
import BackButton from "../components/BackButton";

export default function Privacy() {
  return (
    <>
      <Helmet>
        <title>Politique de Confidentialité | SolvHub</title>
        <meta name="description" content="Découvrez comment SolvHub protège vos données personnelles et respecte votre vie privée." />
      </Helmet>

      <div className="max-w-4xl mx-auto px-4 md:px-8 py-12 space-y-8 text-slate-700">
        <BackButton to="/" label="Retour à l'accueil" />
        <div className="space-y-2 border-b border-slate-200 pb-6">
          <h1 className="text-3xl font-bold text-slate-900">
            Politique de Confidentialité
          </h1>
          <p className="text-sm text-slate-500">
            Dernière mise à jour : Juillet 2026
          </p>
        </div>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-slate-900">
            1. Collecte des données
          </h2>
          <p className="text-sm leading-relaxed">
            Dans le cadre de l'utilisation de SolvHub, nous sommes amenés à
            collecter certaines informations personnelles vous concernant (nom
            d'utilisateur, adresse email, mot de passe crypté) lorsque vous créez
            un compte ou interagissez avec la plateforme.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-slate-900">
            2. Utilisation des données
          </h2>
          <p className="text-sm leading-relaxed">
            Les données collectées sur SolvHub sont exclusivement utilisées pour :
          </p>
          <ul className="list-disc list-inside text-sm space-y-1 pl-4">
            <li>Gérer votre compte et sécuriser votre accès.</li>
            <li>
              Permettre la publication et le suivi de vos problèmes et solutions.
            </li>
            <li>
              Vous envoyer des notifications (si activées dans vos paramètres).
            </li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-slate-900">
            3. Protection des données
          </h2>
          <p className="text-sm leading-relaxed">
            Nous mettons en œuvre toutes les mesures de sécurité techniques et
            organisationnelles nécessaires pour protéger vos données personnelles
            contre la perte, l'accès non autorisé, la divulgation ou la
            modification (mots de passe hachés, connexions sécurisées).
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-slate-900">
            4. Vos droits (RGPD)
          </h2>
          <p className="text-sm leading-relaxed">
            Conformément à la réglementation européenne en vigueur, vous disposez
            d'un droit d'accès, de rectification et de suppression de vos données
            personnelles. Vous pouvez exercer ces droits en nous contactant
            directement à l'adresse :{" "}
            <a
              href="mailto:contact@solvhub.com"
              className="text-blue-600 hover:underline"
            >
              contact@solvhub.com
            </a>
            .
          </p>
        </section>
      </div>
    </>
  );
}