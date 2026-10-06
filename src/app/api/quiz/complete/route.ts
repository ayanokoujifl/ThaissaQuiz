import { NextResponse } from 'next/server';
import { QuizService } from '@/services/quiz.service';
import { AreaCode } from '@/data/quiz-questions';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { sessionId, primaryProfile, secondaryProfile, scores } = body;

    if (!sessionId || !primaryProfile || !scores) {
      return NextResponse.json(
        { error: 'Dados insuficientes para concluir o quiz.' },
        { status: 400 }
      );
    }

    const session = await QuizService.completeSession(
      sessionId,
      primaryProfile as AreaCode,
      secondaryProfile ? (secondaryProfile as AreaCode) : null,
      scores as Record<AreaCode, number>
    );

    return NextResponse.json({ success: true, session });
  } catch (error) {
    console.error('Error completing quiz session:', error);
    return NextResponse.json(
      { error: 'Erro ao concluir sessão do quiz.' },
      { status: 500 }
    );
  }
}
