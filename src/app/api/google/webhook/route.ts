// ============================================================
// WEBHOOK — Google Calendar Push Notifications
// Recebe notificações em tempo real quando eventos são alterados
// ============================================================
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sincronizarDoGoogle } from '@/lib/google-calendar'

export async function POST(request: NextRequest) {
  try {
    // Headers da notificação Google
    const channelId = request.headers.get('x-goog-channel-id')
    const resourceState = request.headers.get('x-goog-resource-state')
    const channelToken = request.headers.get('x-goog-channel-token') // userId

    // Mensagem sync inicial — apenas confirmar
    if (resourceState === 'sync') {
      console.log(`[Webhook] Sync confirmado para canal ${channelId}`)
      return NextResponse.json({ ok: true })
    }

    // Notificação de mudança — resourceState === 'exists'
    if (resourceState === 'exists' && channelToken) {
      const userId = channelToken

      // Verificar se o usuário existe e tem sync ativo
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          googleSyncAtivo: true,
          googleRefreshToken: true,
          googleChannelId: true,
        },
      })

      if (!user?.googleSyncAtivo || !user.googleRefreshToken) {
        return NextResponse.json({ ok: true })
      }

      // Verificar se o canal é válido
      if (user.googleChannelId !== channelId) {
        return NextResponse.json({ ok: true })
      }

      // Sincronizar mês atual + próximo (eventos podem ser para o futuro)
      const agora = new Date()
      const mesAtual = agora.getMonth() + 1
      const anoAtual = agora.getFullYear()

      try {
        await sincronizarDoGoogle(userId, mesAtual, anoAtual)
        // Sempre sincronizar mês seguinte também
        const proxMes = mesAtual === 12 ? 1 : mesAtual + 1
        const proxAno = mesAtual === 12 ? anoAtual + 1 : anoAtual
        await sincronizarDoGoogle(userId, proxMes, proxAno)
      } catch {
        // Não travar — webhook não pode falhar
      }
    }

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('[Webhook] Erro ao processar notificação:', error)
    // Retornar 200 mesmo em caso de erro para evitar retries infinitos
    return NextResponse.json({ ok: true })
  }
}

// Google exige que o endpoint aceite GET também (verificação)
export async function GET() {
  return NextResponse.json({ status: 'webhook ativo' })
}
