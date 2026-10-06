export type AreaCode = 'RH' | 'MKT' | 'FIN' | 'LOG' | 'COM' | 'EMP';
export type Turno = 'MANHA' | 'NOITE' | 'EAD';

export interface AreaInfo {
  code: AreaCode;
  name: string;
  shortName: string;
  color: string;
  bgLight: string;
  borderColor: string;
  description: string;
  areasToExplore: string[];
}

export interface QuestionAlternative {
  id: string;
  text: string;
  area: AreaCode;
}

export interface Question {
  id: number;
  statement: string;
  alternatives: QuestionAlternative[];
}

export const AREAS: Record<AreaCode, AreaInfo> = {
  RH: {
    code: 'RH',
    name: 'Recursos Humanos',
    shortName: 'RH',
    color: '#0284C7',
    bgLight: '#E0F2FE',
    borderColor: '#BAE6FD',
    description:
      'Você tem facilidade para lidar com pessoas, desenvolver equipes e criar ambientes colaborativos.',
    areasToExplore: [
      'Recrutamento e Seleção',
      'Treinamento e Desenvolvimento',
      'Gestão de Pessoas',
      'Employer Branding',
    ],
  },
  MKT: {
    code: 'MKT',
    name: 'Marketing',
    shortName: 'Marketing',
    color: '#7C3AED',
    bgLight: '#EDE9FE',
    borderColor: '#DDD6FE',
    description:
      'Você é criativo(a), comunicativo(a) e gosta de entender o comportamento das pessoas e do mercado.',
    areasToExplore: [
      'Marketing Digital',
      'Branding e Posicionamento',
      'Pesquisa de Mercado',
      'Gestão de Redes Sociais',
    ],
  },
  FIN: {
    code: 'FIN',
    name: 'Financeiro',
    shortName: 'Finanças',
    color: '#059669',
    bgLight: '#D1FAE5',
    borderColor: '#A7F3D0',
    description:
      'Você tem perfil analítico e gosta de números, planejamento e estratégia financeira.',
    areasToExplore: [
      'Controladoria',
      'Planejamento Financeiro',
      'Análise de Investimentos',
      'Tesouraria',
    ],
  },
  LOG: {
    code: 'LOG',
    name: 'Logística',
    shortName: 'Logística',
    color: '#EA580C',
    bgLight: '#FFEDD5',
    borderColor: '#FED7AA',
    description:
      'Você se destaca pela organização, pelo planejamento e pela busca de eficiência nos processos.',
    areasToExplore: [
      'Gestão de Estoques',
      'Supply Chain',
      'Transporte e Distribuição',
      'Compras Estratégicas',
    ],
  },
  COM: {
    code: 'COM',
    name: 'Comercial',
    shortName: 'Comercial',
    color: '#DC2626',
    bgLight: '#FEE2E2',
    borderColor: '#FECACA',
    description:
      'Você tem facilidade para negociação, relacionamento e conquista de resultados.',
    areasToExplore: [
      'Vendas B2B/B2C',
      'Relacionamento com Clientes',
      'Negociação Estratégica',
      'Gestão de Contas (Key Account)',
    ],
  },
  EMP: {
    code: 'EMP',
    name: 'Empreendedorismo e Gestão',
    shortName: 'Empreendedorismo',
    color: '#D97706',
    bgLight: '#FEF3C7',
    borderColor: '#FDE68A',
    description:
      'Você gosta de liderar, inovar, tomar decisões e transformar ideias em projetos de sucesso.',
    areasToExplore: [
      'Gestão de Projetos',
      'Startups e Novos Negócios',
      'Consultoria Empresarial',
      'Planejamento Estratégico',
    ],
  },
};

export const QUIZ_QUESTIONS: Question[] = [
  {
    id: 1,
    statement: 'Em um trabalho em grupo, qual papel você costuma assumir?',
    alternatives: [
      { id: '1-rh', text: 'Ajudo a resolver conflitos e integrar a equipe', area: 'RH' },
      { id: '1-mkt', text: 'Cuido da comunicação e da apresentação', area: 'MKT' },
      { id: '1-fin', text: 'Faço os cálculos e controlo os custos', area: 'FIN' },
      { id: '1-log', text: 'Garanto prazos, materiais e entregas', area: 'LOG' },
      { id: '1-com', text: 'Converso com as pessoas e defendo as ideias do grupo', area: 'COM' },
      { id: '1-emp', text: 'Organizo as tarefas e tomo a frente das decisões', area: 'EMP' },
    ],
  },
  {
    id: 2,
    statement: 'Uma empresa está com um problema. Qual você teria mais vontade de resolver?',
    alternatives: [
      { id: '2-rh', text: 'Funcionários desmotivados e conflitos na equipe', area: 'RH' },
      { id: '2-mkt', text: 'Poucas pessoas conhecem a marca', area: 'MKT' },
      { id: '2-fin', text: 'A empresa está gastando mais do que deveria', area: 'FIN' },
      { id: '2-log', text: 'Os produtos estão atrasando para chegar aos clientes', area: 'LOG' },
      { id: '2-com', text: 'As vendas estão caindo', area: 'COM' },
      { id: '2-emp', text: 'A empresa está parada, sem novas ideias', area: 'EMP' },
    ],
  },
  {
    id: 3,
    statement: 'Quando surge um problema inesperado, você costuma:',
    alternatives: [
      { id: '3-rh', text: 'Conversar com as pessoas envolvidas para entender o que houve', area: 'RH' },
      { id: '3-mkt', text: 'Pensar em uma solução criativa e em como comunicá-la', area: 'MKT' },
      { id: '3-fin', text: 'Analisar os dados e os custos antes de decidir', area: 'FIN' },
      { id: '3-log', text: 'Buscar uma forma de melhorar o processo', area: 'LOG' },
      { id: '3-com', text: 'Negociar alternativas', area: 'COM' },
      { id: '3-emp', text: 'Montar um plano de ação e decidir rápido', area: 'EMP' },
    ],
  },
  {
    id: 4,
    statement: 'Qual atividade você escolheria para passar uma tarde inteira?',
    alternatives: [
      { id: '4-rh', text: 'Entrevistar e conhecer pessoas', area: 'RH' },
      { id: '4-mkt', text: 'Criar conteúdo ou campanhas', area: 'MKT' },
      { id: '4-fin', text: 'Trabalhar com planilhas e números', area: 'FIN' },
      { id: '4-log', text: 'Planejar entregas e estoques', area: 'LOG' },
      { id: '4-com', text: 'Negociar com clientes', area: 'COM' },
      { id: '4-emp', text: 'Desenvolver um projeto novo', area: 'EMP' },
    ],
  },
  {
    id: 5,
    statement: 'Se você organizasse um evento na faculdade, qual seria sua maior preocupação?',
    alternatives: [
      { id: '5-rh', text: 'Fazer todos trabalharem bem juntos', area: 'RH' },
      { id: '5-mkt', text: 'Divulgar o evento e atrair participantes', area: 'MKT' },
      { id: '5-fin', text: 'Controlar o orçamento', area: 'FIN' },
      { id: '5-log', text: 'Organizar horários, materiais e estrutura', area: 'LOG' },
      { id: '5-com', text: 'Conseguir patrocinadores e parcerias', area: 'COM' },
      { id: '5-emp', text: 'Coordenar tudo para o evento dar certo', area: 'EMP' },
    ],
  },
  {
    id: 6,
    statement: 'Uma empresa vai lançar um novo produto. O que mais chama sua atenção?',
    alternatives: [
      { id: '6-rh', text: 'Como treinar a equipe envolvida', area: 'RH' },
      { id: '6-mkt', text: 'Como divulgá-lo ao público', area: 'MKT' },
      { id: '6-fin', text: 'Quanto vai custar produzir e vender', area: 'FIN' },
      { id: '6-log', text: 'Como será distribuído aos clientes', area: 'LOG' },
      { id: '6-com', text: 'Como aumentar as vendas', area: 'COM' },
      { id: '6-emp', text: 'Como transformar a ideia em um negócio de sucesso', area: 'EMP' },
    ],
  },
  {
    id: 7,
    statement: 'Qual elogio você gostaria mais de receber em um trabalho?',
    alternatives: [
      { id: '7-rh', text: '“Você sabe lidar muito bem com pessoas.”', area: 'RH' },
      { id: '7-mkt', text: '“Você tem ideias muito criativas.”', area: 'MKT' },
      { id: '7-fin', text: '“Você é muito organizado(a) com números.”', area: 'FIN' },
      { id: '7-log', text: '“Você faz tudo funcionar no prazo.”', area: 'LOG' },
      { id: '7-com', text: '“Você é muito convincente.”', area: 'COM' },
      { id: '7-emp', text: '“Você tem visão e sabe liderar.”', area: 'EMP' },
    ],
  },
  {
    id: 8,
    statement: 'O que você considera mais importante em uma empresa?',
    alternatives: [
      { id: '8-rh', text: 'Pessoas motivadas', area: 'RH' },
      { id: '8-mkt', text: 'Uma marca forte', area: 'MKT' },
      { id: '8-fin', text: 'Bons resultados financeiros', area: 'FIN' },
      { id: '8-log', text: 'Processos organizados', area: 'LOG' },
      { id: '8-com', text: 'Clientes satisfeitos', area: 'COM' },
      { id: '8-emp', text: 'Crescimento e inovação', area: 'EMP' },
    ],
  },
  {
    id: 9,
    statement:
      'Se você pudesse comandar um projeto em uma empresa (ou abrir seu próprio negócio), qual seria sua prioridade?',
    alternatives: [
      { id: '9-rh', text: 'Melhorar o ambiente e a experiência dos funcionários', area: 'RH' },
      { id: '9-mkt', text: 'Criar uma campanha ou desenvolver uma marca conhecida', area: 'MKT' },
      { id: '9-fin', text: 'Melhorar os resultados e garantir a saúde financeira', area: 'FIN' },
      { id: '9-log', text: 'Tornar as operações mais eficientes', area: 'LOG' },
      { id: '9-com', text: 'Atrair e conquistar mais clientes', area: 'COM' },
      { id: '9-emp', text: 'Encontrar oportunidades inovadoras', area: 'EMP' },
    ],
  },
  {
    id: 10,
    statement: 'Qual frase mais combina com você?',
    alternatives: [
      { id: '10-rh', text: '“Pessoas são o maior patrimônio de uma empresa.”', area: 'RH' },
      { id: '10-mkt', text: '“Quem não é visto não é lembrado.”', area: 'MKT' },
      { id: '10-fin', text: '“Os números contam a história.”', area: 'FIN' },
      { id: '10-log', text: '“Tudo precisa funcionar no momento certo.”', area: 'LOG' },
      { id: '10-com', text: '“Toda empresa vive de vendas.”', area: 'COM' },
      { id: '10-emp', text: '“Sempre existe uma oportunidade para inovar.”', area: 'EMP' },
    ],
  },
];
