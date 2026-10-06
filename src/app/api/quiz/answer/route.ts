import { NextResponse } from 'next/server';
import { QuizService } from '@/services/quiz.service';
import { AreaCode } from '@/data/quiz-questions';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { sessionId, questionIndex, selectedArea } = body;

    if (!sessionId || !questionIndex || !selectedArea) {
      return NextResponse.json(
        { error: 'Dados insuficientes para registrar resposta.' },
        { status: 400 }
      );
    }

    await QuizService.recordAnswer(
      sessionId,
      Number(questionIndex),
      selectedArea as AreaCode
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error recording answer:', error);
    return NextResponse.json(
      { error: 'Erro ao registrar resposta.' },
      { status: 500 }
    );
  }
}
