import { Helmet } from "react-helmet-async";
import BackButton from "../components/BackButton";

export default function CGU() {
  return (
    <>
      <Helmet>
        <title>Conditions Générales d'Utilisation (CGU) | SolvHub</title>
        <meta name="description" content="Consultez les Conditions Générales d'Utilisation de la plateforme SolvHub." />
      </Helmet>

      <main className="max-w-4xl mx-auto px-4 md:px-8 py-12 space-y-8 text-slate-700">
        <BackButton to="/" label="Retour à l'accueil" />
        <header className="space-y-2 border-b border-slate-200 pb-6">
          <h1 className="text-3xl font-bold text-slate-900">
            Conditions Générales d'Utilisation (CGU)
          </h1>
          <p className="text-sm text-slate-500">
            Dernière mise à jour : Novembre 2026
          </p>
        </header>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-slate-900">1. Objet</h2>
          <p className="text-sm leading-relaxed">
            Les présentes Conditions Générales d'Utilisation (CGU) ont pour objet
            de définir les modalités de mise à disposition des services de la
            plateforme <strong>SolvHub</strong> (éditée par CubTaik) et les conditions d'utilisation du
            service par l'Utilisateur.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-slate-900">
            2. Accès au site et financement
          </h2>
          <p className="text-sm leading-relaxed">
            Le site SolvHub est accessible gratuitement à tout utilisateur
            disposant d'un accès à Internet. Tous les coûts afférents à l'accès au
            service (matériel, logiciels, connexion Internet) sont à la charge de l'utilisateur. 
            Afin de maintenir la gratuité de la consultation des solutions, la plateforme est financée par l'affichage d'encarts publicitaires non intrusifs.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-slate-900">
            3. Inscription et Compte Utilisateur
          </h2>
          <p className="text-sm leading-relaxed">
            Pour accéder aux fonctionnalités contributives (publication de pannes,
            ajout de solutions), l'utilisateur doit créer un compte avec une adresse email valide. 
            L'utilisateur est responsable de la confidentialité de ses identifiants et des contenus qu'il publie, 
            lesquels doivent respecter la législation en vigueur et ne pas porter atteinte aux droits de tiers.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-slate-900">
            4. Propriété intellectuelle
          </h2>
          <p className="text-sm leading-relaxed">
            Les éléments structurels de SolvHub (interface, code, graphismes, logos) sont la propriété exclusive de CubTaik. 
            En publiant une solution ou un guide sur la plateforme, l'utilisateur accorde à SolvHub une licence non exclusive d'affichage, 
            d'indexation et de diffusion sur le site.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-slate-900">
            5. Responsabilité
          </h2>
          <p className="text-sm leading-relaxed">
            Les procédures de diagnostic et de réparation partagées sur SolvHub sont fournies à titre purement informatif. 
            La plateforme ne saurait être tenue responsable des dommages matériels, logiciels ou corporels résultant d'une intervention 
            effectuée sur la base des informations publiées sur le site.
          </p>
        </section>
      </main>
    </>
  );
}