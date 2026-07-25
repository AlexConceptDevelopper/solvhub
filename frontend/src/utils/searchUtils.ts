// src/utils/searchUtils.ts

export function normalizeText(text: string | null | undefined): string {
  if (!text) return "";
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

// Algorithme de distance de Levenshtein (mesure l'écart entre deux chaînes)
function getLevenshteinDistance(a: string, b: string): number {
  const matrix: number[][] = [];

  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }

  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, 
          Math.min(
            matrix[i][j - 1] + 1, 
            matrix[i - 1][j] + 1 
          )
        );
      }
    }
  }

  return matrix[b.length][a.length];
}

export function matchesSearchQuery(text: string | null | undefined, query: string): boolean {
  if (!query || query.trim().length < 3) return true;

  const cleanText = normalizeText(text);
  const cleanQuery = normalizeText(query);

  if (cleanText.includes(cleanQuery)) return true;

  const words = cleanText.split(/\s+/);

  const allowedErrors = cleanQuery.length > 5 ? 2 : 1;

  for (const word of words) {
    // Si la taille du mot est proche de la requête, on calcule la distance
    if (Math.abs(word.length - cleanQuery.length) <= allowedErrors) {
      const distance = getLevenshteinDistance(word, cleanQuery);
      if (distance <= allowedErrors) {
        return true;
      }
    }
  }

  return false;
}