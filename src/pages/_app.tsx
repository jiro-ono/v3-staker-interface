import type { AppProps } from 'next/app'
import NextHead from 'next/head'
import * as React from 'react'
import { WagmiConfig } from 'wagmi'
import { QueryClient, QueryClientProvider } from "react-query"

import { client } from '../wagmi'

function App({ Component, pageProps }: AppProps) {
  const [mounted, setMounted] = React.useState(false)

  const queryClient = new QueryClient()

  React.useEffect(() => setMounted(true), [])
  return (
    <QueryClientProvider client={queryClient}>
      <WagmiConfig client={client}>
        <NextHead>
          <title>wagmi</title>
        </NextHead>

        {mounted && <Component {...pageProps} />}
      </WagmiConfig>
    </QueryClientProvider>
  )
}

export default App
