import { Helmet } from "react-helmet-async";
import BackButton from "../components/BackButton";

export default function PrivacyPolicy() {
  return (
    <>
      <Helmet>
        <title>Politique de Confidentialité & Cookies | SolvHub</title>
        <meta name="description" content="Découvrez comment SolvHub collecte, utilise et protège vos données personnelles ainsi que notre gestion des cookies." />
      </Helmet>

      <div className="max-w-4xl mx-auto px-4 py-12 space-y-6">
        <BackButton to="/" label="Retour à l'accueil" />
        
        <h1 className="text-3xl font-bold text-slate-900">Politique de Confidentialité & Cookies</h1>
        <p className="text-xs text-slate-400">Dernière mise à jour : Novembre 2026</p>

        <div className="prose prose-slate text-slate-600 space-y-6">
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-slate-800">1. Collecte des données</h2>
            <p>
              Dans le cadre de l'utilisation de SolvHub, nous collectons uniquement les informations nécessaires au fonctionnement de votre compte (adresse email, nom d'utilisateur, mot de passe chiffré) ainsi que les contenus et images que vous publiez volontairement sur la plateforme.
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-slate-800">2. Utilisation des données</h2>
            <p>Les données collectées sur SolvHub sont exclusivement utilisées pour :</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Gérer votre compte et sécuriser votre accès.</li>
              <li>Permettre la publication et le suivi de vos problèmes et solutions techniques.</li>
              <li>Vous envoyer des notifications transactionnelles liées à votre compte.</li>
            </ul>
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-slate-800">3. Cookies et Publicité (Google AdSense)</h2>
            <p>
              Pour financer gratuitement l'hébergement et le développement de la plateforme, SolvHub utilise <strong>Google AdSense</strong> pour diffuser des annonces publicitaires :
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                Des fournisseurs tiers, y compris <strong>Google</strong>, utilisent des cookies pour diffuser des annonces en fonction des visites antérieures des utilisateurs sur ce site web ou sur d'autres sites web.
              </li>
              <li>
                Grâce aux cookies publicitaires, Google et ses partenaires adaptent les annonces diffusées auprès de nos utilisateurs en fonction de leur navigation sur SolvHub et/ou d'autres sites Internet.
              </li>
              <li>
                Vous pouvez à tout moment modifier vos préférences de consentement via notre bandeau de gestion des cookies ou désactiver la publicité personnalisée en consultant les{" "}
                <a href="https://myadcenter.google.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  Paramètres des annonces Google
                </a>{" "}
                ou le site{" "}
                <a href="https://www.aboutads.info/choices/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  www.aboutads.info
                </a>.
              </li>
            </ul>
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-slate-800">4. Sous-traitants et hébergement des données</h2>
            <p>
              Pour assurer le bon fonctionnement de SolvHub, nous faisons appel à des prestataires techniques conformes au RGPD :
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                <strong>Cloudinary</strong> : stockage et optimisation des images jointes aux solutions. Ces fichiers sont supprimés lorsque vous retirez une image ou supprimez votre compte. Consultez la{" "}
                <a href="https://cloudinary.com/privacy" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  politique de confidentialité de Cloudinary
                </a>.
              </li>
              <li>
                <strong>Resend</strong> : acheminement des emails transactionnels (validation d'inscription, notifications).
              </li>
              <li>
                <strong>Google Ireland Limited</strong> : diffusion publicitaire via Google AdSense (sous réserve de votre consentement CMP).
              </li>
            </ul>
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-slate-800">5. Protection des données et vos droits (RGPD)</h2>
            <p>
              Conformément au Règlement Général sur la Protection des Données (RGPD), vous disposez d'un droit d'accès, de rectification, de portabilité et de suppression de vos données personnelles (notamment via la suppression directe depuis votre espace profil). Vous pouvez également nous contacter à l'adresse :{" "}
              <a href="mailto:contact@solvhub.fr" className="text-blue-600 hover:underline">
                contact@solvhub.fr
              </a>.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}