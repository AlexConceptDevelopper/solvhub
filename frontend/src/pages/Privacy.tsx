import { Helmet } from "react-helmet-async";
import BackButton from "../components/BackButton";

export default function PrivacyPolicy() {
  return (
    <>
      <Helmet>
        <title>Politique de Confidentialité | SolvHub</title>
        <meta name="description" content="Découvrez comment SolvHub collecte, utilise et protège vos données personnelles." />
      </Helmet>

      <div className="max-w-4xl mx-auto px-4 py-12 space-y-6">
        <BackButton to="/" label="Retour à l'accueil" />
        
        <h1 className="text-3xl font-bold text-slate-900">Politique de Confidentialité</h1>
        <p className="text-xs text-slate-400">Dernière mise à jour : Juillet 2026</p>

        <div className="prose prose-slate text-slate-600 space-y-6">
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-slate-800">1. Collecte des données</h2>
            <p>
              Dans le cadre de l'utilisation de SolvHub, nous sommes amenés à collecter certaines informations personnelles vous concernant (nom d'utilisateur, adresse email, mot de passe crypté) lorsque vous créez un compte ou interagissez avec la plateforme.
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-slate-800">2. Utilisation des données</h2>
            <p>Les données collectées sur SolvHub sont exclusivement utilisées pour :</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Gérer votre compte et sécuriser votre accès.</li>
              <li>Permettre la publication et le suivi de vos problèmes et solutions.</li>
              <li>Vous envoyer des notifications (si activées dans vos paramètres).</li>
            </ul>
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-slate-800">3. Protection des données</h2>
            <p>
              Nous mettons en œuvre toutes les mesures de sécurité techniques et organisationnelles nécessaires pour protéger vos données personnelles contre la perte, l'accès non autorisé, la divulgation ou la modification (mots de passe hachés, connexions sécurisées).
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-slate-800">4. Vos droits (RGPD)</h2>
            <p>
              Conformément à la réglementation européenne en vigueur, vous disposez d'un droit d'accès, de rectification et de suppression de vos données personnelles. Vous pouvez exercer ces droits en nous contactant directement à l'adresse : <a href="mailto:contact@solvhub.com" className="text-blue-600 hover:underline">contact@solvhub.com</a>.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}