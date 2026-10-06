import { prisma } from '@/lib/prisma';
import { AreaCode, AREAS } from '@/data/quiz-questions';

export interface QuizMetrics {
  totalStarted: number;
  totalCompleted: number;
  completionRate: number;
  dropOff: { questionIndex: number; respondents: number }[];
  profileDistribution: { profile: AreaCode; name: string; count: number; percentage: number; color: string }[];
  averageAffinities: { code: AreaCode; name: string; averageScore: number; color: string }[];
  questionMatrix: {
    questionIndex: number;
    distribution: { area: AreaCode; name: string; votes: number; percentage: number; color: string }[];
    totalVotes: number;
  }[];
}

export class QuizService {
  static async startSession(periodo: number, turno: string) {
    return prisma.quizSession.create({
      data: {
        periodo,
        turno: turno.toUpperCase(),
        status: 'STARTED',
      },
    });
  }

  static async recordAnswer(sessionId: string, questionIndex: number, selectedArea: AreaCode) {
    return prisma.quizAnswer.upsert({
      where: {
        sessionId_questionIndex: {
          sessionId,
          questionIndex,
        },
      },
      update: {
        selectedArea,
      },
      create: {
        sessionId,
        questionIndex,
        selectedArea,
      },
    });
  }

  static async completeSession(
    sessionId: string,
    primaryProfile: AreaCode,
    secondaryProfile: AreaCode | null,
    scores: Record<AreaCode, number>
  ) {
    return prisma.quizSession.update({
      where: { id: sessionId },
      data: {
        status: 'COMPLETED',
        primaryProfile,
        secondaryProfile,
        scores: JSON.stringify(scores),
        completedAt: new Date(),
      },
    });
  }

  static async getMetrics(periodo?: number, turno?: string): Promise<QuizMetrics> {
    const whereSession = {
      ...(periodo ? { periodo } : {}),
      ...(turno ? { turno: turno.toUpperCase() } : {}),
    };

    const [totalStarted, completedSessions, allAnswers] = await Promise.all([
      prisma.quizSession.count({ where: whereSession }),
      prisma.quizSession.findMany({
        where: { ...whereSession, status: 'COMPLETED' },
        select: { id: true, primaryProfile: true, scores: true },
      }),
      prisma.quizAnswer.findMany({
        where: {
          session: whereSession,
        },
        select: {
          questionIndex: true,
          selectedArea: true,
          sessionId: true,
        },
      }),
    ]);

    const totalCompleted = completedSessions.length;
    const completionRate = totalStarted > 0 ? Number(((totalCompleted / totalStarted) * 100).toFixed(1)) : 0;

    // 1. Drop-off por pergunta
    const dropOffMap: Record<number, Set<string>> = {};
    for (let i = 1; i <= 10; i++) {
      dropOffMap[i] = new Set<string>();
    }
    allAnswers.forEach((ans) => {
      if (dropOffMap[ans.questionIndex]) {
        dropOffMap[ans.questionIndex].add(ans.sessionId);
      }
    });

    const dropOff = Object.entries(dropOffMap).map(([qIndex, sessionsSet]) => ({
      questionIndex: Number(qIndex),
      respondents: sessionsSet.size,
    }));

    // 2. Distribuição de Perfis Predominantes
    const profileCounts: Record<AreaCode, number> = {
      RH: 0,
      MKT: 0,
      FIN: 0,
      LOG: 0,
      COM: 0,
      EMP: 0,
    };

    completedSessions.forEach((s) => {
      if (s.primaryProfile && profileCounts[s.primaryProfile as AreaCode] !== undefined) {
        profileCounts[s.primaryProfile as AreaCode] += 1;
      }
    });

    const profileDistribution = (Object.keys(profileCounts) as AreaCode[])
      .map((code) => {
        const count = profileCounts[code];
        const percentage = totalCompleted > 0 ? Number(((count / totalCompleted) * 100).toFixed(1)) : 0;
        return {
          profile: code,
          name: AREAS[code].name,
          count,
          percentage,
          color: AREAS[code].color,
        };
      })
      .sort((a, b) => b.count - a.count);

    // 3. Média Geral de Afinidade por Área
    const affinitySums: Record<AreaCode, number> = {
      RH: 0,
      MKT: 0,
      FIN: 0,
      LOG: 0,
      COM: 0,
      EMP: 0,
    };

    completedSessions.forEach((s) => {
      if (s.scores) {
        try {
          const parsed = JSON.parse(s.scores) as Record<AreaCode, number>;
          Object.entries(parsed).forEach(([code, val]) => {
            if (affinitySums[code as AreaCode] !== undefined) {
              affinitySums[code as AreaCode] += val;
            }
          });
        } catch {
          // ignore corrupted json
        }
      }
    });

    const averageAffinities = (Object.keys(affinitySums) as AreaCode[])
      .map((code) => {
        const avg = totalCompleted > 0 ? Number((affinitySums[code] / totalCompleted).toFixed(1)) : 0;
        return {
          code,
          name: AREAS[code].name,
          averageScore: avg,
          color: AREAS[code].color,
        };
      })
      .sort((a, b) => b.averageScore - a.averageScore);

    // 4. Matriz de Respostas por Pergunta
    const questionMatrixMap: Record<number, Record<AreaCode, number>> = {};
    for (let i = 1; i <= 10; i++) {
      questionMatrixMap[i] = { RH: 0, MKT: 0, FIN: 0, LOG: 0, COM: 0, EMP: 0 };
    }

    allAnswers.forEach((ans) => {
      const q = ans.questionIndex;
      const area = ans.selectedArea as AreaCode;
      if (questionMatrixMap[q] && questionMatrixMap[q][area] !== undefined) {
        questionMatrixMap[q][area] += 1;
      }
    });

    const questionMatrix = Object.entries(questionMatrixMap).map(([qIndex, areaVotes]) => {
      const qNum = Number(qIndex);
      const totalQVotes = Object.values(areaVotes).reduce((acc, curr) => acc + curr, 0);
      const distribution = (Object.keys(areaVotes) as AreaCode[])
        .map((code) => {
          const votes = areaVotes[code];
          const percentage = totalQVotes > 0 ? Number(((votes / totalQVotes) * 100).toFixed(1)) : 0;
          return {
            area: code,
            name: AREAS[code].shortName,
            votes,
            percentage,
            color: AREAS[code].color,
          };
        })
        .sort((a, b) => b.votes - a.votes);

      return {
        questionIndex: qNum,
        distribution,
        totalVotes: totalQVotes,
      };
    });

    return {
      totalStarted,
      totalCompleted,
      completionRate,
      dropOff,
      profileDistribution,
      averageAffinities,
      questionMatrix,
    };
  }
}
