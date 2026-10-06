import type { Metadata } from 'next';
import { verifyAdminSession } from '@/lib/auth';
import { QuizService } from '@/services/quiz.service';
import { AdminLoginForm } from './AdminLoginForm';
import { DashboardView } from './DashboardView';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Painel Analítico | Thaíssa Quiz FUMEC',
  robots: {
    index: false,
    follow: false,
  },
};

interface PainelProps {
  searchParams: Promise<{
    periodo?: string;
    turno?: string;
  }>;
}

export default async function PainelAnaliticoPage({ searchParams }: PainelProps) {
  const isAuth = await verifyAdminSession();

  if (!isAuth) {
    return <AdminLoginForm />;
  }

  const params = await searchParams;
  const periodoNum = params.periodo ? Number(params.periodo) : undefined;
  const turnoStr = params.turno ? String(params.turno) : undefined;

  const metrics = await QuizService.getMetrics(periodoNum, turnoStr);

  return (
    <DashboardView
      metrics={metrics}
      currentPeriodo={params.periodo || ''}
      currentTurno={params.turno || ''}
    />
  );
}
