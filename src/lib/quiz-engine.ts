import { AREAS, AreaCode, AreaInfo, QuestionAlternative } from '@/data/quiz-questions';

export interface AreaScore {
  code: AreaCode;
  area: AreaInfo;
  points: number;
  percentage: number;
}

export interface QuizCalculationResult {
  scores: Record<AreaCode, number>; // { RH: 40, MKT: 20, ... }
  ranking: AreaScore[];
  primaryArea: AreaInfo;
  secondaryArea?: AreaInfo; // Definido se houver empate no 1º lugar
  isTie: boolean;
  tiedAreas: AreaInfo[];
  otherMatches: AreaInfo[]; // 2º e 3º lugares quando não houver empate total
}

/**
 * Calcula a pontuação e ranking a partir das respostas do usuário.
 * answers: mapa de questionId (1..10) para AreaCode selecionado.
 */
export function calculateQuizResult(
  answers: Record<number, AreaCode>
): QuizCalculationResult {
  const pointsMap: Record<AreaCode, number> = {
    RH: 0,
    MKT: 0,
    FIN: 0,
    LOG: 0,
    COM: 0,
    EMP: 0,
  };

  Object.values(answers).forEach((area) => {
    if (pointsMap[area] !== undefined) {
      pointsMap[area] += 1;
    }
  });

  const totalQuestions = 10;
  const scores: Record<AreaCode, number> = {
    RH: 0,
    MKT: 0,
    FIN: 0,
    LOG: 0,
    COM: 0,
    EMP: 0,
  };

  const ranking: AreaScore[] = (Object.keys(pointsMap) as AreaCode[])
    .map((code) => {
      const points = pointsMap[code];
      const percentage = Math.round((points / totalQuestions) * 100);
      scores[code] = percentage;
      return {
        code,
        area: AREAS[code],
        points,
        percentage,
      };
    })
    .sort((a, b) => b.percentage - a.percentage);

  const highestScore = ranking[0].points;
  const topTied = ranking.filter((item) => item.points === highestScore);
  const isTie = topTied.length > 1;

  const primaryArea = topTied[0].area;
  const secondaryArea = isTie ? topTied[1].area : undefined;
  const tiedAreas = topTied.map((item) => item.area);

  // 2º e 3º lugares para exibição de áreas complementares
  const otherMatches: AreaInfo[] = isTie
    ? ranking.filter((r) => !topTied.some((t) => t.code === r.code) && r.points > 0).slice(0, 2).map((r) => r.area)
    : ranking.slice(1, 3).filter((r) => r.points > 0).map((r) => r.area);

  return {
    scores,
    ranking,
    primaryArea,
    secondaryArea,
    isTie,
    tiedAreas,
    otherMatches,
  };
}

/**
 * Embaralha uma lista de alternativas usando o algoritmo de Fisher-Yates de forma determinística
 */
export function shuffleAlternatives(
  alternatives: QuestionAlternative[]
): QuestionAlternative[] {
  const shuffled = [...alternatives];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}
