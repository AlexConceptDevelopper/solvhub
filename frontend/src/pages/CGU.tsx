import BackButton from "../components/BackButton";

export default function CGU() {
  return (
    <div className="max-w-4xl mx-auto px-4 md:px-8 py-12 space-y-8 text-slate-700">
      <BackButton to="/" label="Retour à l'accueil" />
      <div className="space-y-2 border-b border-slate-200 pb-6">
        <h1 className="text-3xl font-bold text-slate-900">
          Conditions Générales d'Utilisation (CGU)
        </h1>
        <p className="text-sm text-slate-500">
          Dernière mise à jour : Juillet 2026
        </p>
      </div>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-slate-900">1. Objet</h2>
        <p className="text-sm leading-relaxed">
          Les présentes Conditions Générales d'Utilisation (CGU) ont pour objet
          de définir les modalités de mise à disposition des services de la
          plateforme <strong>SolvHub</strong> et les conditions d'utilisation du
          service par l'Utilisateur.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-slate-900">
          2. Accès au site
        </h2>
        <p className="text-sm leading-relaxed">
          Le site SolvHub est accessible gratuitement à tout utilisateur
          disposant d'un accès à Internet. Tous les coûts afférents à l'accès au
          service, qu'il s'agisse des frais matériels, logiciels ou d'accès à
          Internet, sont exclusivement à la charge de l'utilisateur.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-slate-900">
          3. Inscription et Compte Utilisateur
        </h2>
        <p className="text-sm leading-relaxed">
          Pour accéder à certaines fonctionnalités (publication de problèmes,
          ajout de solutions), l'utilisateur doit créer un compte en fournissant
          des informations exactes. L'utilisateur est responsable de la
          confidentialité de son mot de passe et de l'ensemble des actions
          effectuées depuis son compte.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-slate-900">
          4. Propriété intellectuelle
        </h2>
        <p className="text-sm leading-relaxed">
          Les contenus publiés sur SolvHub (textes, graphismes, logos, codes,
          icônes) sont la propriété exclusive de la plateforme ou de leurs
          auteurs respectifs. Toute reproduction, représentation, modification
          ou adaptation de tout ou partie des éléments du site est strictement
          interdite sans autorisation préalable.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-slate-900">
          5. Responsabilité
        </h2>
        <p className="text-sm leading-relaxed">
          Les solutions techniques partagées sur SolvHub le sont à titre
          indicatif. La plateforme ne saurait être tenue responsable des
          dommages matériels ou logiciels causés suite à l'application d'une
          solution ou d'un conseil trouvé sur le site.
        </p>
      </section>
    </div>
  );
}
