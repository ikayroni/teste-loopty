'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState } from 'react'

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 0, // Sempre considera dados como desatualizados
            gcTime: 0, // Não mantém cache após componente desmontar
            refetchOnMount: true, // Sempre busca dados ao montar
            refetchOnWindowFocus: true, // Busca ao focar na janela
            refetchOnReconnect: true, // Busca ao reconectar
            retry: 1,
          },
        },
      })
  )

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}
