import { useAccount } from 'wagmi'

import { Account, Connect, NetworkSwitcher, CreateIncentive, IncentivesList, Stake, UserStakes, ClaimReward, RewardInfo } from '../components'

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
          <RewardInfo />
          <ClaimReward />
        </>
      )}
    </>
  )
}

export default Page
