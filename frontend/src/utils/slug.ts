export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Supprime les accents
    .replace(/[^a-z0-9 -]/g, "")     // Supprime les caractères spéciaux
    .replace(/\s+/g, "-")            // Remplace les espaces par des tirets
    .replace(/-+/g, "-")             // Évite les tirets multiples
    .trim();
}

// Génère l'URL complète pour un problème
export function getProblemUrl(idProblem: number, title: string): string {
  const slug = slugify(title);
  return `/problem/${idProblem}-${slug}`;
}

export function getSolutionUrl(idSolution: number, title: string): string {
  const slug = slugify(title);
  return `/solution/${idSolution}-${slug}`;
}