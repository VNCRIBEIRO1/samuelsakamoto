// ============================================================
// INTEGRAÇÃO GOOGLE CALENDAR — Samuel Sakamoto Sociedade de Advogados
// Sync bidirecional completo: CMS ↔ Google Calendar
// v2: fix token refresh, delete sync, error handling
// ============================================================
import { google, calendar_v3 } from 'googleapis'
import { prisma } from './prisma'
import { v4 as uuidv4 } from 'uuid'

const SCOPES = ['https://www.googleapis.com/auth/calendar']

function getOAuth2Client() {
  const clientId = (process.env.GOOGLE_CLIENT_ID || '').trim()
  const clientSecret = (process.env.GOOGLE_CLIENT_SECRET || '').trim()
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_APP_URL || '').trim()
  const redirectUri = `${siteUrl}/api/google/callback`

  if (!clientId || !clientSecret) {
    throw new Error('GOOGLE_CLIENT_ID e GOOGLE_CLIENT_SECRET não configurados')
  }

  return new google.auth.OAuth2(clientId, clientSecret, redirectUri)
}

// Gerar URL de autorização OAuth
export function getAuthUrl(userId: string): string {
  const client = getOAuth2Client()
  return client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
    prompt: 'consent',
    state: userId,
  })
}

// Trocar code por tokens
export async function exchangeCodeForTokens(code: string) {
  const client = getOAuth2Client()
  const { tokens } = await client.getToken(code)
  return tokens
}

// Obter client autenticado do usuário — com force refresh se expirado
export async function getAuthenticatedClient(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      googleAccessToken: true,
      googleRefreshToken: true,
      googleTokenExpiry: true,
    },
  })

  if (!user?.googleRefreshToken) {
    throw new Error('Usuário não conectou o Google Calendar')
  }

  const client = getOAuth2Client()
  client.setCredentials({
    access_token: user.googleAccessToken,
    refresh_token: user.googleRefreshToken,
    expiry_date: user.googleTokenExpiry?.getTime(),
  })

  // Listener para atualizar tokens quando renovados automaticamente
  client.on('tokens', async (tokens) => {
    const updateData: Record<string, unknown> = {}
    if (tokens.access_token) updateData.googleAccessToken = tokens.access_token
    if (tokens.refresh_token) updateData.googleRefreshToken = tokens.refresh_token
    if (tokens.expiry_date) updateData.googleTokenExpiry = new Date(tokens.expiry_date)
    if (Object.keys(updateData).length > 0) {
      try {
        await prisma.user.update({ where: { id: userId }, data: updateData })
      } catch {
        // Silencioso — não travar por falha ao salvar token
      }
    }
  })

  // FORCE REFRESH: Se token expirado ou prestes a expirar (<2min), forçar renovação
  const now = Date.now()
  const expiry = user.googleTokenExpiry?.getTime() || 0
  if (expiry > 0 && now >= expiry - 120000) {
    try {
      const { credentials } = await client.refreshAccessToken()
      client.setCredentials(credentials)
      // Salvar novos tokens imediatamente
      const updateData: Record<string, unknown> = {}
      if (credentials.access_token) updateData.googleAccessToken = credentials.access_token
      if (credentials.refresh_token) updateData.googleRefreshToken = credentials.refresh_token
      if (credentials.expiry_date) updateData.googleTokenExpiry = new Date(credentials.expiry_date)
      if (Object.keys(updateData).length > 0) {
        await prisma.user.update({ where: { id: userId }, data: updateData })
      }
    } catch {
      throw new Error('Token Google expirado. Reconecte o Google Calendar nas configurações.')
    }
  }

  return { client, calendarId: 'primary' }
}

// ============================================================
// OPERAÇÕES COM EVENTOS
// ============================================================

interface EventoData {
  titulo: string
  descricao?: string | null
  dataHora: Date
  duracao: number
  local?: string | null
  tipo?: string
  clienteNome?: string | null
}

// Criar evento no Google Calendar
export async function criarEventoGoogle(userId: string, evento: EventoData): Promise<string | null> {
  try {
    const { client, calendarId } = await getAuthenticatedClient(userId)
    const calendar = google.calendar({ version: 'v3', auth: client })

    const inicio = new Date(evento.dataHora)
    const fim = new Date(inicio.getTime() + evento.duracao * 60000)

    const descricaoCompleta = [
      evento.descricao,
      evento.clienteNome ? `Cliente: ${evento.clienteNome}` : null,
      evento.tipo ? `Tipo: ${evento.tipo}` : null,
      '---',
      'Samuel Sakamoto Sociedade de Advogados',
    ].filter(Boolean).join('\n')

    const res = await calendar.events.insert({
      calendarId,
      requestBody: {
        summary: evento.titulo,
        description: descricaoCompleta,
        location: evento.local || undefined,
        start: { dateTime: inicio.toISOString(), timeZone: 'America/Sao_Paulo' },
        end: { dateTime: fim.toISOString(), timeZone: 'America/Sao_Paulo' },
        reminders: {
          useDefault: false,
          overrides: [
            { method: 'popup', minutes: 30 },
            { method: 'popup', minutes: 60 * 24 },
          ],
        },
        colorId: getTipoColorId(evento.tipo),
      },
    })

    return res.data.id || null
  } catch (error) {
    console.error('[GoogleCal] Erro ao criar evento:', error)
    return null
  }
}

// Atualizar evento no Google Calendar
export async function atualizarEventoGoogle(
  userId: string,
  googleEventId: string,
  evento: Partial<EventoData>
): Promise<boolean> {
  try {
    const { client, calendarId } = await getAuthenticatedClient(userId)
    const calendar = google.calendar({ version: 'v3', auth: client })

    const updateBody: Record<string, unknown> = {}
    if (evento.titulo) updateBody.summary = evento.titulo
    if (evento.descricao !== undefined) updateBody.description = evento.descricao
    if (evento.local !== undefined) updateBody.location = evento.local

    if (evento.dataHora) {
      const inicio = new Date(evento.dataHora)
      const fim = new Date(inicio.getTime() + (evento.duracao || 60) * 60000)
      updateBody.start = { dateTime: inicio.toISOString(), timeZone: 'America/Sao_Paulo' }
      updateBody.end = { dateTime: fim.toISOString(), timeZone: 'America/Sao_Paulo' }
    }

    await calendar.events.update({
      calendarId,
      eventId: googleEventId,
      requestBody: updateBody,
    })

    return true
  } catch (error: unknown) {
    const status = (error as { code?: number })?.code
    if (status === 404 || status === 410) return true
    console.error('[GoogleCal] Erro ao atualizar evento:', error)
    return false
  }
}

// Deletar evento do Google Calendar — trata 404/410 como sucesso
export async function deletarEventoGoogle(userId: string, googleEventId: string): Promise<boolean> {
  try {
    const { client, calendarId } = await getAuthenticatedClient(userId)
    const calendar = google.calendar({ version: 'v3', auth: client })

    await calendar.events.delete({ calendarId, eventId: googleEventId })
    return true
  } catch (error: unknown) {
    const status = (error as { code?: number })?.code
    // 404 = não encontrado, 410 = já deletado — considerar sucesso
    if (status === 404 || status === 410) return true
    console.error('[GoogleCal] Erro ao deletar evento:', error)
    return false
  }
}

// Buscar eventos do Google Calendar em um período
export async function buscarEventosGoogle(
  userId: string,
  inicio: Date,
  fim: Date,
  opcoes?: { showDeleted?: boolean }
) {
  const { client, calendarId } = await getAuthenticatedClient(userId)
  const calendar = google.calendar({ version: 'v3', auth: client })

  const allEvents: calendar_v3.Schema$Event[] = []
  let pageToken: string | undefined = undefined

  do {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const res: any = await calendar.events.list({
      calendarId,
      timeMin: inicio.toISOString(),
      timeMax: fim.toISOString(),
      singleEvents: true,
      orderBy: 'startTime',
      maxResults: 250,
      showDeleted: opcoes?.showDeleted || false,
      pageToken,
    })

    if (res.data.items) {
      allEvents.push(...res.data.items)
    }
    pageToken = res.data.nextPageToken || undefined
  } while (pageToken)

  return allEvents
}

// Sincronizar: exportar agendamentos locais → Google
export async function sincronizarParaGoogle(userId: string, mes: number, ano: number) {
  const inicio = new Date(ano, mes - 1, 1)
  const fim = new Date(ano, mes, 0, 23, 59, 59)

  const agendamentos = await prisma.agendamento.findMany({
    where: {
      googleEventId: null,
      dataHora: { gte: inicio, lte: fim },
      status: { not: 'cancelado' },
    },
    include: { cliente: { select: { nome: true } } },
  })

  let criados = 0
  const erros: string[] = []

  for (const ag of agendamentos) {
    try {
      const eventId = await criarEventoGoogle(userId, {
        titulo: ag.titulo,
        descricao: ag.descricao,
        dataHora: ag.dataHora,
        duracao: ag.duracao,
        local: ag.local,
        tipo: ag.tipo,
        clienteNome: ag.cliente?.nome,
      })

      if (eventId) {
        await prisma.agendamento.update({
          where: { id: ag.id },
          data: { googleEventId: eventId },
        })
        criados++
      } else {
        erros.push(`Falha: ${ag.titulo}`)
      }
    } catch (e) {
      erros.push(`${ag.titulo}: ${e instanceof Error ? e.message : 'erro'}`)
    }
  }

  return { criados, total: agendamentos.length, erros }
}

// ============================================================
// SINCRONIZAÇÃO BIDIRECIONAL: Google → Local
// Detecta: novos, modificações, cancelamentos, deleções
// ============================================================
export async function sincronizarDoGoogle(userId: string, mes: number, ano: number) {
  const inicio = new Date(ano, mes - 1, 1)
  const fim = new Date(ano, mes, 0, 23, 59, 59)

  // Buscar eventos incluindo deletados/cancelados
  const eventosGoogle = await buscarEventosGoogle(userId, inicio, fim, { showDeleted: true })

  // Buscar agendamentos locais do período com googleEventId
  const agendamentosLocais = await prisma.agendamento.findMany({
    where: {
      googleEventId: { not: null },
      dataHora: { gte: inicio, lte: fim },
    },
    select: {
      id: true, googleEventId: true, titulo: true,
      dataHora: true, duracao: true, local: true, status: true, tipo: true,
    },
  })

  const mapaLocal = new Map(agendamentosLocais.map(a => [a.googleEventId!, a]))
  const idsNoGoogle = new Set<string>()

  let importados = 0
  let atualizados = 0
  let cancelados = 0

  for (const evento of eventosGoogle) {
    if (!evento.id) continue
    idsNoGoogle.add(evento.id)

    const agLocal = mapaLocal.get(evento.id)

    // ── CASO 1: Evento cancelado/deletado no Google ──
    if (evento.status === 'cancelled') {
      if (agLocal && agLocal.status !== 'cancelado') {
        await prisma.agendamento.update({
          where: { id: agLocal.id },
          data: { status: 'cancelado' },
        })
        cancelados++
      }
      continue
    }

    // ── CASO 2: Evento já existe localmente → verificar modificações ──
    if (agLocal) {
      const dataInicio = evento.start?.dateTime || evento.start?.date
      if (!dataInicio) continue

      const dataFim = evento.end?.dateTime || evento.end?.date
      const googleInicio = new Date(dataInicio)
      const googleFim = dataFim ? new Date(dataFim) : new Date(googleInicio.getTime() + 3600000)
      const googleDuracao = Math.round((googleFim.getTime() - googleInicio.getTime()) / 60000)

      const updateData: Record<string, unknown> = {}

      // Se estava cancelado localmente mas existe no Google, reativar
      if (agLocal.status === 'cancelado') {
        updateData.status = 'agendado'
      }

      const tituloMudou = (evento.summary || 'Evento Google') !== agLocal.titulo
      const dataMudou = Math.abs(googleInicio.getTime() - agLocal.dataHora.getTime()) > 60000
      const duracaoMudou = googleDuracao !== agLocal.duracao
      const localMudou = (evento.location || null) !== (agLocal.local || null)

      if (tituloMudou) updateData.titulo = evento.summary || 'Evento Google'
      if (dataMudou) updateData.dataHora = googleInicio
      if (duracaoMudou) updateData.duracao = googleDuracao > 0 ? googleDuracao : 60
      if (localMudou) updateData.local = evento.location || null
      if (tituloMudou) updateData.tipo = classificarTipoEvento(evento.summary || '')

      if (Object.keys(updateData).length > 0) {
        await prisma.agendamento.update({
          where: { id: agLocal.id },
          data: updateData,
        })
        atualizados++
      }
      continue
    }

    // ── CASO 3: Evento novo no Google → importar ──
    const dataInicio = evento.start?.dateTime || evento.start?.date
    if (!dataInicio) continue

    const dataFim = evento.end?.dateTime || evento.end?.date
    const inicio2 = new Date(dataInicio)
    const fim2 = dataFim ? new Date(dataFim) : new Date(inicio2.getTime() + 3600000)
    const duracao = Math.round((fim2.getTime() - inicio2.getTime()) / 60000)

    // Evitar duplicatas
    const existeDuplicata = await prisma.agendamento.findFirst({
      where: {
        OR: [
          { googleEventId: evento.id },
          { titulo: evento.summary || 'Evento Google', dataHora: inicio2, status: { not: 'cancelado' } },
        ],
      },
    })

    if (existeDuplicata) continue

    await prisma.agendamento.create({
      data: {
        titulo: evento.summary || 'Evento Google',
        descricao: evento.description || null,
        dataHora: inicio2,
        duracao: duracao > 0 ? duracao : 60,
        tipo: classificarTipoEvento(evento.summary || ''),
        status: 'agendado',
        local: evento.location || null,
        googleEventId: evento.id,
      },
    })
    importados++
  }

  // ── CASO 4: Eventos locais com googleEventId que NÃO existem mais no Google ──
  for (const agLocal of agendamentosLocais) {
    if (agLocal.googleEventId && !idsNoGoogle.has(agLocal.googleEventId) && agLocal.status !== 'cancelado') {
      await prisma.agendamento.update({
        where: { id: agLocal.id },
        data: { status: 'cancelado' },
      })
      cancelados++
    }
  }

  return { importados, atualizados, cancelados, totalGoogle: eventosGoogle.length }
}

// ============================================================
// WEBHOOK — Push Notifications do Google Calendar
// ============================================================

export async function registrarWebhook(userId: string): Promise<boolean> {
  try {
    const { client, calendarId } = await getAuthenticatedClient(userId)
    const calendar = google.calendar({ version: 'v3', auth: client })

    const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_APP_URL || '').trim()
    if (!siteUrl || siteUrl.includes('localhost')) return false

    // Parar canal anterior se existir
    try { await pararWebhook(userId) } catch { /* silencioso */ }

    const channelId = uuidv4()
    const expiration = Date.now() + 7 * 24 * 60 * 60 * 1000

    const res = await calendar.events.watch({
      calendarId,
      requestBody: {
        id: channelId,
        type: 'web_hook',
        address: `${siteUrl}/api/google/webhook`,
        token: userId,
        expiration: expiration.toString(),
      },
    })

    await prisma.user.update({
      where: { id: userId },
      data: {
        googleChannelId: channelId,
        googleResourceId: res.data.resourceId || null,
        googleChannelExpiry: new Date(expiration),
      },
    })

    return true
  } catch (error) {
    console.error('[GoogleCal] Erro ao registrar webhook:', error)
    return false
  }
}

export async function pararWebhook(userId: string): Promise<boolean> {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { googleChannelId: true, googleResourceId: true },
    })

    if (!user?.googleChannelId || !user?.googleResourceId) return false

    const { client } = await getAuthenticatedClient(userId)
    const calendar = google.calendar({ version: 'v3', auth: client })

    await calendar.channels.stop({
      requestBody: {
        id: user.googleChannelId,
        resourceId: user.googleResourceId,
      },
    })

    await prisma.user.update({
      where: { id: userId },
      data: { googleChannelId: null, googleResourceId: null, googleChannelExpiry: null },
    })

    return true
  } catch {
    // Limpar mesmo que falhe (canal pode já estar inválido)
    await prisma.user.update({
      where: { id: userId },
      data: { googleChannelId: null, googleResourceId: null, googleChannelExpiry: null },
    }).catch(() => {})
    return false
  }
}

export async function renovarWebhookSeNecessario(userId: string): Promise<void> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { googleChannelExpiry: true, googleSyncAtivo: true },
  })

  if (!user?.googleSyncAtivo) return

  const agora = new Date()
  const umDiaAntes = user?.googleChannelExpiry
    ? new Date(user.googleChannelExpiry.getTime() - 24 * 60 * 60 * 1000)
    : null

  if (!user?.googleChannelExpiry || (umDiaAntes && agora >= umDiaAntes)) {
    await registrarWebhook(userId)
  }
}

// ============================================================
// HELPERS
// ============================================================

function getTipoColorId(tipo?: string): string {
  switch (tipo) {
    case 'audiencia': return '11'
    case 'prazo': return '6'
    case 'reuniao': return '7'
    case 'consulta': return '2'
    case 'retorno': return '5'
    default: return '1'
  }
}

function classificarTipoEvento(titulo: string): string {
  const t = titulo.toLowerCase()
  if (t.includes('audiência') || t.includes('audiencia')) return 'audiencia'
  if (t.includes('prazo')) return 'prazo'
  if (t.includes('reunião') || t.includes('reuniao')) return 'reuniao'
  if (t.includes('consulta')) return 'consulta'
  if (t.includes('retorno')) return 'retorno'
  return 'compromisso'
}
