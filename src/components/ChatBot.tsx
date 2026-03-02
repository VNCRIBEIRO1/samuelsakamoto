'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageCircle,
  X,
  Send,
  Bot,
  Scale,
  ArrowLeft,
  ExternalLink,
  ShieldCheck,
  AlertTriangle,
  Clock,
  CheckCircle,
} from 'lucide-react';

// ============================================================
// TIPOS
// ============================================================
type Opcao = { label: string; valor: string };

type Mensagem = {
  id: number;
  tipo: 'bot' | 'user';
  texto: string;
  opcoes?: Opcao[];
  timestamp: Date;
};

type DadosTriagem = {
  area: string;
  subarea: string;
  urgencia: string;
  detalhes: string[];
  nome: string;
  telefone: string;
};

// ============================================================
// FLUXOS POR ÁREA — PERGUNTAS CONVERSACIONAIS COMPLETAS
// ============================================================
type Pergunta = {
  id: string;
  texto: string;
  opcoes?: Opcao[];
  livre?: boolean;
  campo?: keyof DadosTriagem;
  campoArray?: boolean;
};

type Fluxo = {
  saudacao: string;
  perguntas: Pergunta[];
};

// ============================================================
// PERGUNTA DE URGÊNCIA (reutilizada em todos os fluxos)
// ============================================================
const PERGUNTA_URGENCIA: Pergunta = {
  id: 'urgencia',
  texto: 'Qual o nível de urgência da sua situação?',
  opcoes: [
    { label: '🔴 Urgente — preciso de atendimento imediato', valor: 'URGENTE' },
    { label: '🟡 Moderado — preciso resolver em breve', valor: 'MODERADO' },
    { label: '🟢 Consulta — quero entender meus direitos', valor: 'CONSULTA' },
  ],
  campo: 'urgencia',
};

const FLUXOS: Record<string, Fluxo> = {
  // ============================================================
  // DIREITO DO TRABALHO
  // ============================================================
  trabalho: {
    saudacao:
      'Entendi! Vamos conversar sobre sua questão de *Direito do Trabalho*. Vou fazer algumas perguntas para entender melhor sua situação e direcionar seu atendimento.',
    perguntas: [
      {
        id: 'sub',
        texto: 'Qual situação melhor descreve o que você está passando?',
        opcoes: [
          { label: '🔴 Fui demitido(a) por justa causa', valor: 'Demissão por justa causa' },
          { label: '💰 Não recebi verbas rescisórias', valor: 'Verbas rescisórias não pagas' },
          { label: '⏰ Horas extras não pagas', valor: 'Horas extras não pagas' },
          { label: '😰 Assédio moral ou sexual no trabalho', valor: 'Assédio moral/sexual no trabalho' },
          { label: '🤕 Acidente de trabalho / doença ocupacional', valor: 'Acidente de trabalho / doença ocupacional' },
          { label: '📋 Desvio ou acúmulo de função', valor: 'Desvio ou acúmulo de função' },
          { label: '🚫 Trabalho sem registro (CLT)', valor: 'Trabalho sem registro em carteira' },
          { label: '⚖️ Rescisão indireta (quero sair com direitos)', valor: 'Rescisão indireta' },
          { label: '🔒 Estabilidade (gestante, CIPA, acidente)', valor: 'Estabilidade provisória' },
          { label: '📋 Outro assunto trabalhista', valor: 'Outro assunto trabalhista' },
        ],
        campo: 'subarea',
      },
      PERGUNTA_URGENCIA,
      {
        id: 'tempo',
        texto: 'Há quanto tempo ocorreu ou está ocorrendo essa situação?',
        opcoes: [
          { label: '📅 Menos de 30 dias', valor: 'Menos de 30 dias' },
          { label: '📅 Entre 1 e 6 meses', valor: 'Entre 1 e 6 meses' },
          { label: '📅 Entre 6 meses e 1 ano', valor: 'Entre 6 meses e 1 ano' },
          { label: '📅 Entre 1 e 2 anos', valor: 'Entre 1 e 2 anos' },
          { label: '⚠️ Mais de 2 anos (atenção ao prazo prescricional)', valor: 'Mais de 2 anos' },
        ],
        campoArray: true,
      },
      {
        id: 'vinculo',
        texto: 'Qual era/é o vínculo empregatício?',
        opcoes: [
          { label: '✅ Carteira assinada (CLT)', valor: 'CLT — carteira assinada' },
          { label: '❌ Sem registro em carteira', valor: 'Sem registro em carteira' },
          { label: '📄 Contrato temporário / terceirizado', valor: 'Contrato temporário / terceirizado' },
          { label: '🏠 Trabalho doméstico', valor: 'Empregado(a) doméstico(a)' },
          { label: '🚗 Motorista de aplicativo / PJ', valor: 'Motorista de app / PJ' },
          { label: '📋 Outro tipo de vínculo', valor: 'Outro tipo de vínculo' },
        ],
        campoArray: true,
      },
      {
        id: 'documentos',
        texto: 'Você tem documentos ou provas da situação?',
        opcoes: [
          { label: '✅ Sim, tenho documentos e comprovantes', valor: 'Possui documentos/comprovantes' },
          { label: '📱 Tenho conversas (WhatsApp, e-mail)', valor: 'Possui conversas digitais como prova' },
          { label: '👥 Tenho testemunhas', valor: 'Possui testemunhas' },
          { label: '❌ Não tenho provas no momento', valor: 'Sem provas no momento' },
        ],
        campoArray: true,
      },
      {
        id: 'detalhe',
        texto: 'Descreva brevemente o que aconteceu. Quanto mais detalhes, melhor poderemos orientá-lo(a):',
        livre: true,
        campoArray: true,
      },
    ],
  },

  // ============================================================
  // FAMÍLIA E SUCESSÕES
  // ============================================================
  familia: {
    saudacao:
      'Compreendo. Vamos tratar da sua questão de *Família e Sucessões* com o cuidado necessário. Preciso de algumas informações para direcionar o atendimento.',
    perguntas: [
      {
        id: 'sub',
        texto: 'Qual situação melhor descreve o seu caso?',
        opcoes: [
          { label: '💍 Divórcio ou separação', valor: 'Divórcio/Separação' },
          { label: '👧 Guarda e convivência', valor: 'Guarda e convivência' },
          { label: '💰 Pensão alimentícia', valor: 'Pensão alimentícia' },
          { label: '🏠 Partilha de bens', valor: 'Partilha de bens' },
          { label: '📜 Inventário', valor: 'Inventário' },
          { label: '📋 Planejamento sucessório', valor: 'Planejamento sucessório' },
          { label: '📋 Outro assunto de família', valor: 'Outro assunto de família' },
        ],
        campo: 'subarea',
      },
      PERGUNTA_URGENCIA,
      {
        id: 'acordo',
        texto: 'Existe acordo ou diálogo entre as partes?',
        opcoes: [
          { label: '✅ Sim, há diálogo', valor: 'Há diálogo' },
          { label: '⚠️ Parcialmente', valor: 'Diálogo parcial' },
          { label: '❌ Não, há conflito', valor: 'Sem diálogo' },
        ],
        campoArray: true,
      },
      {
        id: 'documentos',
        texto: 'Você possui documentos ou provas?',
        opcoes: [
          { label: '✅ Sim, tenho documentos', valor: 'Possui documentos' },
          { label: '📱 Tenho conversas ou registros', valor: 'Possui conversas/registros' },
          { label: '👥 Tenho testemunhas', valor: 'Possui testemunhas' },
          { label: '❌ Não tenho no momento', valor: 'Sem documentos no momento' },
        ],
        campoArray: true,
      },
      {
        id: 'detalhe',
        texto: 'Descreva brevemente a situação para que possamos orientar melhor:',
        livre: true,
        campoArray: true,
      },
    ],
  },

  // ============================================================
  // DIREITO PREVIDENCIÁRIO
  // ============================================================
  previdenciario: {
    saudacao:
      'Certo! Vamos conversar sobre sua questão de *Direito Previdenciário*. Preciso de algumas informações para direcionar o melhor atendimento.',
    perguntas: [
      {
        id: 'sub',
        texto: 'Qual situação melhor descreve sua demanda?',
        opcoes: [
          { label: '🏖️ Aposentadoria (tempo, idade, especial)', valor: 'Aposentadoria' },
          { label: '🤕 Auxílio-doença / Incapacidade temporária', valor: 'Auxílio-doença' },
          { label: '♿ BPC/LOAS (benefício assistencial)', valor: 'BPC/LOAS' },
          { label: '💰 Pensão por morte', valor: 'Pensão por morte' },
          { label: '🔄 Revisão de benefício', valor: 'Revisão de benefício' },
          { label: '❌ Benefício negado pelo INSS', valor: 'Benefício negado' },
          { label: '📋 Outro assunto previdenciário', valor: 'Outro assunto previdenciário' },
        ],
        campo: 'subarea',
      },
      PERGUNTA_URGENCIA,
      {
        id: 'contribuicao',
        texto: 'Qual sua situação de contribuição ao INSS?',
        opcoes: [
          { label: '✅ Contribuo regularmente (CLT ou autônomo)', valor: 'Contribuinte regular' },
          { label: '⚠️ Contribuição irregular/atrasada', valor: 'Contribuição irregular' },
          { label: '❌ Nunca contribuí', valor: 'Nunca contribuiu' },
          { label: '🏖️ Já sou aposentado(a)', valor: 'Já aposentado(a)' },
          { label: '❓ Não sei informar', valor: 'Não sabe informar' },
        ],
        campoArray: true,
      },
      {
        id: 'documentos',
        texto: 'Você possui documentos relacionados?',
        opcoes: [
          { label: '✅ Sim, tenho CNIS/carteira de trabalho', valor: 'Possui CNIS/CTPS' },
          { label: '📄 Tenho laudos médicos', valor: 'Possui laudos médicos' },
          { label: '📂 Tenho parte dos documentos', valor: 'Documentos parciais' },
          { label: '❌ Ainda não', valor: 'Sem documentos no momento' },
        ],
        campoArray: true,
      },
      {
        id: 'detalhe',
        texto: 'Descreva brevemente sua situação previdenciária:',
        livre: true,
        campoArray: true,
      },
    ],
  },

  // ============================================================
  // DIREITO DO CONSUMIDOR
  // ============================================================
  consumidor: {
    saudacao:
      'Perfeito! Vamos tratar da sua questão de *Direito do Consumidor*. Me ajude a entender o cenário para direcionarmos o atendimento.',
    perguntas: [
      {
        id: 'sub',
        texto: 'Qual situação melhor descreve sua demanda?',
        opcoes: [
          { label: '💳 Cobrança indevida', valor: 'Cobrança indevida' },
          { label: '📦 Produto com defeito', valor: 'Produto com defeito' },
          { label: '📉 Serviço não prestado/negado', valor: 'Serviço não prestado' },
          { label: '🧾 Cancelamento e reembolso', valor: 'Cancelamento e reembolso' },
          { label: '🚫 Negativação indevida', valor: 'Negativação indevida' },
          { label: '📋 Outro assunto do consumidor', valor: 'Outro assunto do consumidor' },
        ],
        campo: 'subarea',
      },
      PERGUNTA_URGENCIA,
      {
        id: 'documentos',
        texto: 'Você possui comprovantes, contratos ou conversas?',
        opcoes: [
          { label: '✅ Sim, tenho documentos', valor: 'Possui documentos' },
          { label: '📱 Tenho conversas / registros', valor: 'Possui conversas/registros' },
          { label: '❌ Ainda não', valor: 'Sem documentos no momento' },
        ],
        campoArray: true,
      },
      {
        id: 'detalhe',
        texto: 'Descreva brevemente o que aconteceu:',
        livre: true,
        campoArray: true,
      },
    ],
  },

  // ============================================================
  // LICITAÇÃO PÚBLICA
  // ============================================================
  licitacao: {
    saudacao:
      'Entendido! Vamos conversar sobre *Licitação Pública*. Me conte mais sobre sua demanda para direcionarmos o atendimento adequado.',
    perguntas: [
      {
        id: 'sub',
        texto: 'Qual situação melhor descreve sua demanda em licitação?',
        opcoes: [
          { label: '📑 Participação em pregão', valor: 'Participação em pregão' },
          { label: '📂 Habilitação e documentação', valor: 'Habilitação e documentação' },
          { label: '⚖️ Impugnações e recursos', valor: 'Impugnações e recursos' },
          { label: '🧾 Contrato administrativo', valor: 'Contrato administrativo' },
          { label: '📋 Outro assunto em licitação', valor: 'Outro assunto em licitação' },
        ],
        campo: 'subarea',
      },
      PERGUNTA_URGENCIA,
      {
        id: 'documentos',
        texto: 'Você possui edital, documentos e comunicações?',
        opcoes: [
          { label: '✅ Sim, tenho documentos', valor: 'Possui documentos' },
          { label: '📂 Tenho parte dos documentos', valor: 'Documentos parciais' },
          { label: '❌ Ainda não', valor: 'Sem documentos no momento' },
        ],
        campoArray: true,
      },
      {
        id: 'detalhe',
        texto: 'Descreva brevemente sua demanda em licitação:',
        livre: true,
        campoArray: true,
      },
    ],
  },
};

// ============================================================
// ÁREAS DO MENU INICIAL
// ============================================================
const AREAS: Opcao[] = [
  { label: '⚖️ Direito do Trabalho', valor: 'trabalho' },
  { label: '👨‍👩‍👧‍👦 Família e Sucessões', valor: 'familia' },
  { label: '🧾 Direito Previdenciário', valor: 'previdenciario' },
  { label: '🛡️ Direito do Consumidor', valor: 'consumidor' },
  { label: '🏛️ Licitação Pública', valor: 'licitacao' },
  { label: '🧮 Calculadora de Direitos', valor: 'calculadora' },
];

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP || '551832211222';

// ============================================================
// HELPERS DE URGÊNCIA
// ============================================================
const getUrgenciaMarcador = (nivel: string) => {
  switch (nivel) {
    case 'URGENTE':
      return '🔴';
    case 'MODERADO':
      return '🟡';
    case 'CONSULTA':
      return '🟢';
    default:
      return '⚪';
  }
};

const getUrgenciaTexto = (nivel: string) => {
  switch (nivel) {
    case 'URGENTE':
      return 'Atendimento Urgente';
    case 'MODERADO':
      return 'Prioridade Moderada';
    case 'CONSULTA':
      return 'Consulta Informativa';
    default:
      return 'Não informada';
  }
};

const getUrgenciaCor = (nivel: string) => {
  switch (nivel) {
    case 'URGENTE':
      return 'bg-red-100 text-red-700 border-red-300';
    case 'MODERADO':
      return 'bg-yellow-100 text-yellow-700 border-yellow-300';
    case 'CONSULTA':
      return 'bg-green-100 text-green-700 border-green-300';
    default:
      return 'bg-secondary-100 text-secondary-600 border-secondary-300';
  }
};

// ============================================================
// COMPONENTE CHATBOT
// ============================================================
export default function ChatBot() {
  const [aberto, setAberto] = useState(false);
  const [mensagens, setMensagens] = useState<Mensagem[]>([]);
  const [inputTexto, setInputTexto] = useState('');
  const [etapa, setEtapa] = useState<'inicio' | 'fluxo' | 'nome' | 'telefone' | 'resumo'>('inicio');
  const [areaAtual, setAreaAtual] = useState('');
  const [perguntaIdx, setPerguntaIdx] = useState(0);
  const [dados, setDados] = useState<DadosTriagem>({
    area: '',
    subarea: '',
    urgencia: '',
    detalhes: [],
    nome: '',
    telefone: '',
  });
  const [digitando, setDigitando] = useState(false);

  const chatRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const idCounter = useRef(0);

  const nextId = () => ++idCounter.current;

  // Auto-scroll
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [mensagens, digitando]);

  // Focus input
  useEffect(() => {
    if (aberto && inputRef.current) {
      inputRef.current.focus();
    }
  }, [aberto, etapa, mensagens]);

  // Mensagem inicial
  const iniciar = useCallback(() => {
    idCounter.current = 0;
    setMensagens([]);
    setEtapa('inicio');
    setAreaAtual('');
    setPerguntaIdx(0);
    setDados({ area: '', subarea: '', urgencia: '', detalhes: [], nome: '', telefone: '' });

    setTimeout(() => {
      setDigitando(true);
      setTimeout(() => {
        setDigitando(false);
        setMensagens([
          {
            id: nextId(),
            tipo: 'bot',
            texto:
              'Olá! 👋 Sou o assistente virtual do escritório *Samuel Sakamoto Sociedade de Advogados*.\n\nEstou aqui para entender sua situação e direcionar seu atendimento.\n\n💡 Use nossa Calculadora de Direitos para entender adicionais trabalhistas.\n\nEm qual área posso ajudá-lo(a)?',
            opcoes: AREAS,
            timestamp: new Date(),
          },
        ]);
      }, 800);
    }, 300);
  }, []);

  useEffect(() => {
    if (aberto && mensagens.length === 0) {
      iniciar();
    }
  }, [aberto, mensagens.length, iniciar]);

  // Listener para abrir chatbot via evento customizado ou botão na página
  useEffect(() => {
    const handleAbrirChatbot = () => setAberto(true);
    window.addEventListener('abrir-chatbot', handleAbrirChatbot);

    const handleClick = (e: Event) => {
      const target = e.target as HTMLElement;
      if (target.closest('.abrir-chatbot-btn')) {
        e.preventDefault();
        setAberto(true);
      }
    };
    document.addEventListener('click', handleClick);

    return () => {
      window.removeEventListener('abrir-chatbot', handleAbrirChatbot);
      document.removeEventListener('click', handleClick);
    };
  }, []);

  // Adicionar mensagem do bot com delay de digitação
  const addBotMsg = (texto: string, opcoes?: Opcao[]) => {
    setDigitando(true);
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        setDigitando(false);
        setMensagens((prev) => [
          ...prev,
          { id: nextId(), tipo: 'bot', texto, opcoes, timestamp: new Date() },
        ]);
        resolve();
      }, 600 + Math.random() * 400);
    });
  };

  const addUserMsg = (texto: string) => {
    setMensagens((prev) => [
      ...prev,
      { id: nextId(), tipo: 'user', texto, timestamp: new Date() },
    ]);
  };

  // ============================================================
  // HANDLERS
  // ============================================================

  // Selecionar área
  const selecionarArea = async (valor: string) => {
    if (valor === 'calculadora') {
      addUserMsg('🧮 Calculadora de Direitos');
      await addBotMsg(
        '✅ Ótimo! Vou te direcionar para nossa *Calculadora de Direitos Trabalhistas*.\n\nLá você poderá verificar se tem direito a adicional de insalubridade ou periculosidade em poucos minutos.\n\n👉 A página será aberta em instantes...'
      );
      setTimeout(() => {
        window.open('/calculadora-de-direitos', '_blank');
      }, 1500);
      return;
    }

    const areaLabel = AREAS.find((a) => a.valor === valor)?.label || valor;
    addUserMsg(areaLabel);

    const fluxo = FLUXOS[valor];
    if (!fluxo) return;

    setAreaAtual(valor);
    setDados((prev) => ({ ...prev, area: areaLabel.replace(/^[^\s]+\s/, '') }));
    setPerguntaIdx(0);
    setEtapa('fluxo');

    await addBotMsg(fluxo.saudacao);
    const primeiraPergunta = fluxo.perguntas[0];
    await addBotMsg(primeiraPergunta.texto, primeiraPergunta.opcoes);
  };

  // Responder pergunta do fluxo
  const responderPergunta = async (resposta: string, label?: string) => {
    addUserMsg(label || resposta);

    const fluxo = FLUXOS[areaAtual];
    if (!fluxo) return;

    const perguntaAtual = fluxo.perguntas[perguntaIdx];

    if (perguntaAtual.campo) {
      setDados((prev) => ({ ...prev, [perguntaAtual.campo!]: resposta }));
    }
    if (perguntaAtual.campoArray) {
      setDados((prev) => ({
        ...prev,
        detalhes: [...prev.detalhes, `${perguntaAtual.texto}\n→ ${resposta}`],
      }));
    }

    const nextIdx = perguntaIdx + 1;

    if (nextIdx < fluxo.perguntas.length) {
      setPerguntaIdx(nextIdx);
      const prox = fluxo.perguntas[nextIdx];
      await addBotMsg(prox.texto, prox.opcoes);
    } else {
      setEtapa('nome');
      await addBotMsg(
        'Obrigado pelas informações! Para finalizar, qual o seu *nome completo*?'
      );
    }
  };

  // Coletar nome
  const enviarNome = async (nome: string) => {
    addUserMsg(nome);
    setDados((prev) => ({ ...prev, nome }));
    setEtapa('telefone');
    await addBotMsg(
      `Prazer, ${nome.split(' ')[0]}! Agora me informe seu *telefone* para contato:`
    );
  };

  // Coletar telefone → gerar resumo
  const enviarTelefone = async (telefone: string) => {
    addUserMsg(telefone);
    setDados((prev) => ({ ...prev, telefone }));
    setEtapa('resumo');

    await addBotMsg(
      'Perfeito! Preparei o resumo da sua consulta. Ao clicar no botão abaixo, voce sera redirecionado(a) ao *WhatsApp* com a mensagem pronta — basta enviar.'
    );

    setDigitando(true);
    setTimeout(() => {
      setDigitando(false);
      setMensagens((prev) => [
        ...prev,
        {
          id: nextId(),
          tipo: 'bot',
          texto: '__RESUMO__',
          timestamp: new Date(),
        },
      ]);
    }, 500);
  };

  // ============================================================
  // GERAR MENSAGEM WHATSAPP
  // ============================================================
  const gerarMensagemWhatsApp = () => {
    const d = dados;
    const urgMarcador = getUrgenciaMarcador(d.urgencia);
    const urgTexto = getUrgenciaTexto(d.urgencia);
    const dataHora = new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' });

    const detalhesFormatados = d.detalhes
      .map((item, idx) => {
        const parts = item.split('\n→ ');
        if (parts.length === 2) {
          return `${idx + 1}. _${parts[0]}_\n   > *${parts[1]}*`;
        }
        return `${idx + 1}. ${item}`;
      })
      .join('\n\n');

    const linha = '________________________________';

    return `${urgMarcador} *${urgTexto.toUpperCase()}*
${linha}

*NOVA CONSULTA — Samuel Sakamoto*
${linha}

*Area:* ${d.area}
*Assunto:* ${d.subarea}
*Urgencia:* ${urgMarcador} ${urgTexto}
${linha}

*DETALHES DA TRIAGEM*
${linha}

${detalhesFormatados}
${linha}

*DADOS DO CLIENTE*
${linha}

*Nome:* ${d.nome}
*Telefone:* ${d.telefone}
${linha}

*Data/Hora:* ${dataHora}
_Enviado via Assistente Virtual do site_`.trim();
  };

  const enviarTriagemAPI = async () => {
    try {
      const detalhesObj: Record<string, string> = {};
      dados.detalhes.forEach((item, idx) => {
        const parts = item.split('\n→ ');
        if (parts.length === 2) {
          detalhesObj[parts[0]] = parts[1];
        } else {
          detalhesObj[`Detalhe ${idx + 1}`] = item;
        }
      });
      await fetch('/api/triagem', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome: dados.nome,
          telefone: dados.telefone,
          area: dados.area,
          subarea: dados.subarea,
          urgencia: dados.urgencia === 'URGENTE' ? 'alta' : dados.urgencia === 'MODERADO' ? 'media' : 'baixa',
          detalhes: JSON.stringify(detalhesObj),
        }),
      });
    } catch {
      // Silencioso — não impede o fluxo do WhatsApp
    }
  };

  const abrirWhatsApp = () => {
    enviarTriagemAPI();
    const msg = encodeURIComponent(gerarMensagemWhatsApp());
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`, '_blank');
  };

  // Submit input de texto
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const texto = inputTexto.trim();
    if (!texto) return;
    setInputTexto('');

    if (etapa === 'nome') {
      enviarNome(texto);
    } else if (etapa === 'telefone') {
      enviarTelefone(texto);
    } else if (etapa === 'fluxo') {
      const fluxo = FLUXOS[areaAtual];
      const pAtual = fluxo?.perguntas[perguntaIdx];
      if (pAtual?.livre) {
        responderPergunta(texto);
      }
    }
  };

  // ============================================================
  // VERIFICAÇÃO: campo de texto ativo?
  // ============================================================
  const inputAtivo =
    etapa === 'nome' ||
    etapa === 'telefone' ||
    (etapa === 'fluxo' &&
      FLUXOS[areaAtual]?.perguntas[perguntaIdx]?.livre === true);

  // ============================================================
  // RENDER
  // ============================================================
  return (
    <>
      {/* Botão Flutuante do Chatbot */}
      <AnimatePresence>
        {!aberto && (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            transition={{ delay: 1.5, type: 'spring', stiffness: 200 }}
            onClick={() => setAberto(true)}
            className="fixed bottom-24 right-6 z-50 w-14 h-14 bg-gradient-to-br from-gold-500 to-gold-700 rounded-full flex items-center justify-center shadow-lg hover:shadow-gold-500/40 transition-shadow group"
            aria-label="Abrir assistente virtual"
            title="Assistente Virtual"
          >
            <Scale className="w-7 h-7 text-white" />
            <span className="absolute inset-0 rounded-full bg-gold-400 animate-ping opacity-20" />
            <span className="absolute right-full mr-3 bg-white text-secondary-700 text-sm px-4 py-2 rounded-lg shadow-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              Assistente Virtual
            </span>
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-[10px] text-white font-bold shadow">
              1
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Painel do Chat */}
      <AnimatePresence>
        {aberto && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-6 right-6 z-50 w-[380px] max-w-[calc(100vw-2rem)] h-[560px] max-h-[calc(100vh-4rem)] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-secondary-200"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-[#0b1223] via-[#162244] to-[#0b1223] px-4 py-3 flex items-center gap-3 flex-shrink-0">
              <div className="w-10 h-10 bg-gold-500/20 rounded-full flex items-center justify-center">
                <Scale className="w-5 h-5 text-gold-400" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-white font-semibold text-sm truncate">
                  Samuel Sakamoto
                </h3>
                <p className="text-primary-300 text-xs flex items-center gap-1">
                  <span className="w-2 h-2 bg-green-400 rounded-full inline-block" />
                  Assistente online
                </p>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={iniciar}
                  className="p-1.5 rounded-lg hover:bg-white/10 transition-colors text-primary-300 hover:text-white"
                  title="Reiniciar conversa"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setAberto(false)}
                  className="p-1.5 rounded-lg hover:bg-white/10 transition-colors text-primary-300 hover:text-white"
                  title="Fechar"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Linha dourada */}
            <div className="h-[2px] bg-gradient-to-r from-transparent via-gold-500 to-transparent flex-shrink-0" />

            {/* Corpo do chat */}
            <div
              ref={chatRef}
              className="flex-1 overflow-y-auto p-4 space-y-3 bg-gradient-to-b from-secondary-50 to-white"
            >
              {mensagens.map((msg) => (
                <div key={msg.id}>
                  {msg.texto === '__RESUMO__' ? (
                    <div className="bg-gradient-to-br from-primary-50 to-gold-50 border border-gold-200 rounded-xl p-4 space-y-3">
                      <p className="font-semibold text-sm text-secondary-800 flex items-center gap-2">
                        <Scale className="w-4 h-4 text-gold-600" />
                        Resumo da Consulta
                      </p>

                      {dados.urgencia && (
                        <div
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${getUrgenciaCor(dados.urgencia)}`}
                        >
                          {dados.urgencia === 'URGENTE' && <AlertTriangle className="w-3 h-3" />}
                          {dados.urgencia === 'MODERADO' && <Clock className="w-3 h-3" />}
                          {dados.urgencia === 'CONSULTA' && <CheckCircle className="w-3 h-3" />}
                          {getUrgenciaMarcador(dados.urgencia)} {getUrgenciaTexto(dados.urgencia)}
                        </div>
                      )}

                      <div className="text-xs text-secondary-600 space-y-1">
                        <p><strong>Área:</strong> {dados.area}</p>
                        <p><strong>Assunto:</strong> {dados.subarea}</p>
                        <p><strong>Cliente:</strong> {dados.nome}</p>
                        <p><strong>Telefone:</strong> {dados.telefone}</p>
                      </div>
                      <button
                        onClick={abrirWhatsApp}
                        className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold text-sm py-2.5 rounded-lg transition-colors shadow"
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                        </svg>
                        Enviar para o Advogado
                        <ExternalLink className="w-3.5 h-3.5" />
                      </button>
                      <a
                        href={`/agendamento?tipo=${encodeURIComponent(dados.area)}&nome=${encodeURIComponent(dados.nome)}&telefone=${encodeURIComponent(dados.telefone)}&assunto=${encodeURIComponent(dados.subarea)}#agendar-online`}
                        className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#d1ad57] to-[#c1933c] hover:from-[#d4b55a] hover:to-[#c9a84c] text-white font-semibold text-sm py-2.5 rounded-lg transition-colors shadow"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" strokeWidth={2}/><line x1="16" y1="2" x2="16" y2="6" strokeWidth={2}/><line x1="8" y1="2" x2="8" y2="6" strokeWidth={2}/></svg>
                        Agendar Consulta Online
                      </a>
                      <p className="text-[10px] text-secondary-400 text-center flex items-center justify-center gap-1">
                        <ShieldCheck className="w-3 h-3" />
                        Escolha WhatsApp ou agende com data e horário
                      </p>
                    </div>
                  ) : msg.tipo === 'bot' ? (
                    <div className="flex gap-2 items-start">
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#162244] to-[#243b6b] flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Bot className="w-3.5 h-3.5 text-gold-400" />
                      </div>
                      <div className="max-w-[85%] space-y-2">
                        <div className="bg-white border border-secondary-100 rounded-2xl rounded-tl-sm px-3.5 py-2.5 shadow-sm">
                          <p
                            className="text-sm text-secondary-700 leading-relaxed whitespace-pre-line"
                            dangerouslySetInnerHTML={{
                              __html: msg.texto
                                .replace(/&/g, '&amp;')
                                .replace(/</g, '&lt;')
                                .replace(/>/g, '&gt;')
                                .replace(
                                  /\*([^*]+)\*/g,
                                  '<strong class="text-secondary-800">$1</strong>'
                                ),
                            }}
                          />
                        </div>

                        {msg.opcoes && msg.id === mensagens[mensagens.length - 1]?.id && (
                          <div className="space-y-1.5">
                            {msg.opcoes.map((op) => (
                              <button
                                key={op.valor}
                                onClick={() => {
                                  if (etapa === 'inicio') {
                                    selecionarArea(op.valor);
                                  } else {
                                    responderPergunta(op.valor, op.label);
                                  }
                                }}
                                className="block w-full text-left text-sm px-3 py-2 rounded-xl bg-gold-50 hover:bg-gold-100 border border-gold-200 hover:border-gold-300 text-secondary-700 transition-all hover:shadow-sm"
                              >
                                {op.label}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="flex justify-end">
                      <div className="max-w-[80%] bg-gradient-to-br from-[#162244] to-[#243b6b] text-white px-3.5 py-2.5 rounded-2xl rounded-tr-sm shadow-sm">
                        <p className="text-sm leading-relaxed">{msg.texto}</p>
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {/* Indicador de digitação */}
              {digitando && (
                <div className="flex gap-2 items-start">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#162244] to-[#243b6b] flex items-center justify-center flex-shrink-0">
                    <Bot className="w-3.5 h-3.5 text-gold-400" />
                  </div>
                  <div className="bg-white border border-secondary-100 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-secondary-300 rounded-full animate-bounce [animation-delay:0ms]" />
                      <span className="w-2 h-2 bg-secondary-300 rounded-full animate-bounce [animation-delay:150ms]" />
                      <span className="w-2 h-2 bg-secondary-300 rounded-full animate-bounce [animation-delay:300ms]" />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input area */}
            <div className="border-t border-secondary-100 p-3 flex-shrink-0 bg-white">
              {etapa === 'resumo' ? (
                <div className="flex gap-2">
                  <button
                    onClick={abrirWhatsApp}
                    className="flex-1 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold py-2.5 rounded-xl transition-colors"
                  >
                    <MessageCircle className="w-4 h-4" />
                    Enviar via WhatsApp
                  </button>
                  <button
                    onClick={iniciar}
                    className="px-3 py-2.5 rounded-xl border border-secondary-200 hover:bg-secondary-50 text-secondary-600 text-sm transition-colors"
                    title="Nova consulta"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex gap-2">
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputTexto}
                    onChange={(e) => setInputTexto(e.target.value)}
                    placeholder={
                      inputAtivo
                        ? etapa === 'nome'
                          ? 'Digite seu nome completo...'
                          : etapa === 'telefone'
                          ? '(18) 99999-9999'
                          : 'Digite sua resposta...'
                        : 'Selecione uma opção acima'
                    }
                    disabled={!inputAtivo}
                    className="flex-1 text-sm px-3 py-2.5 rounded-xl border border-secondary-200 focus:border-gold-400 focus:ring-1 focus:ring-gold-400 outline-none disabled:bg-secondary-50 disabled:text-secondary-400 transition-colors"
                  />
                  <button
                    type="submit"
                    disabled={!inputAtivo || !inputTexto.trim()}
                    className="w-10 h-10 flex items-center justify-center rounded-xl bg-gradient-to-br from-gold-500 to-gold-700 text-white disabled:opacity-40 transition-opacity hover:shadow-lg"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              )}
            </div>

            {/* Rodapé legal */}
            <div className="px-3 pb-2 flex-shrink-0 bg-white">
              <p className="text-[9px] text-secondary-400 text-center leading-tight">
                Assistente informativo. Não constitui aconselhamento jurídico nem
                estabelece relação advogado-cliente. Provimento 205/2021 OAB.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
