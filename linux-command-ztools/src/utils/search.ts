export function fuzzyMatch(keyword: string, text: string): number {
  const lowerKeyword = keyword.toLowerCase();
  const lowerText = text.toLowerCase();
  
  if (lowerText === lowerKeyword) {
    return 100;
  }
  
  if (lowerText.startsWith(lowerKeyword)) {
    return 80;
  }
  
  if (lowerText.includes(lowerKeyword)) {
    const index = lowerText.indexOf(lowerKeyword);
    return 60 - (index * 2);
  }
  
  let score = 0;
  let keywordIndex = 0;
  
  for (let i = 0; i < lowerText.length && keywordIndex < lowerKeyword.length; i++) {
    if (lowerText[i] === lowerKeyword[keywordIndex]) {
      score += 10;
      keywordIndex++;
    }
  }
  
  if (keywordIndex === lowerKeyword.length) {
    return Math.min(score, 50);
  }
  
  return 0;
}

export function searchAndSort(keyword: string, items: string[]): Array<{name: string, score: number}> {
  if (!keyword.trim()) {
    return items.slice(0, 20).map(name => ({ name, score: 0 }));
  }
  
  const results = items
    .map(name => ({
      name,
      score: fuzzyMatch(keyword, name)
    }))
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 20);
  
  return results;
}
