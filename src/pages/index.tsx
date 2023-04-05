import { useAccount } from 'wagmi'

import { Account, Connect, NetworkSwitcher, CreateIncentive, IncentivesList, Stake, UserStakes, ClaimReward } from '../components'

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
          <IncentivesList />
          <Stake />
          <UserStakes />
          <ClaimReward />
        </>
      )}
    </>
  )
}

export default Page
