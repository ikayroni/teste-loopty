'use client'

import { useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { io, Socket } from 'socket.io-client'

let socket: Socket | null = null

export function useWebSocket() {
  const queryClient = useQueryClient()

  useEffect(() => {
    // Conecta ao WebSocket do backend
    if (!socket) {
      console.log('🔌 Tentando conectar ao WebSocket...')
      
      socket = io('http://localhost:3001', {
        transports: ['websocket', 'polling'],
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionAttempts: 10,
      })

      socket.on('connect', () => {
        console.log('✅ WebSocket CONECTADO! ID:', socket?.id)
      })

      socket.on('connect_error', (error) => {
        console.error('❌ Erro ao conectar WebSocket:', error.message)
      })

      socket.on('disconnect', (reason) => {
        console.log('❌ WebSocket DESCONECTADO. Motivo:', reason)
      })

      // Escuta eventos de atualização de tasks
      socket.on('tasks:updated', async (data) => {
        console.log('🔄 EVENTO RECEBIDO: tasks:updated', data)
        // Invalida e refaz imediatamente
        await queryClient.invalidateQueries({ queryKey: ['tasks'] })
        await queryClient.refetchQueries({ queryKey: ['tasks'], type: 'active' })
        console.log('✅ Tasks refetched!')
      })

      // Escuta eventos de atualização de analytics
      socket.on('analytics:updated', async (data) => {
        console.log('📊 EVENTO RECEBIDO: analytics:updated', data)
        // Invalida e refaz imediatamente todas as queries de analytics
        await queryClient.invalidateQueries({ queryKey: ['analytics'], exact: false })
        await queryClient.refetchQueries({ queryKey: ['analytics'], exact: false, type: 'active' })
        console.log('✅ Analytics refetched!')
      })
    }

    return () => {
      // Não desconecta para manter conexão persistente entre páginas
    }
  }, [queryClient])

  return { socket }
}
