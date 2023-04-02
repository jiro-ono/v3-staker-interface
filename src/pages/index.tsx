import { useAccount } from 'wagmi'

import { Account, Connect, NetworkSwitcher, CreateIncentive } from '../components'

function Page() {
  const { isConnected } = useAccount()

  return (
    <>
      <h1>wagmi + Next.js</h1>

      <Connect />

      {isConnected && (
        <>
          <Account />
          <NetworkSwitcher />
          <CreateIncentive />
        </>
      )}
    </>
  )
}

export default Page
