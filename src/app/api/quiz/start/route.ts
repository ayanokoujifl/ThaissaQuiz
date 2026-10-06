import { NextResponse } from 'next/server';
import { QuizService } from '@/services/quiz.service';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { periodo, turno } = body;

    if (!periodo || !turno) {
      return NextResponse.json(
        { error: 'Período e turno são obrigatórios.' },
        { status: 400 }
      );
    }

    const session = await QuizService.startSession(Number(periodo), String(turno));
    return NextResponse.json({ sessionId: session.id }, { status: 201 });
  } catch (error) {
    console.error('Error starting quiz session:', error);
    return NextResponse.json(
      { error: 'Erro ao iniciar sessão do quiz.' },
      { status: 500 }
    );
  }
}
