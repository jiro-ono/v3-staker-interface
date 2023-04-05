import { useContractWrite, usePrepareContractWrite, useWaitForTransaction, useContractRead, useAccount } from 'wagmi'
import { useState } from 'react'
import styled from 'styled-components'

import V3StakerArtifact from '../contracts/artifacts/V3Staker.json'

export function ClaimReward() {
  const { address, isConnected } = useAccount()
  const [params, setParams] = useState({
    rewardToken: '',
    to: '',
    amountRequested: '',
  })

  return (
    <div>
      <h2>Claim Reward</h2>
    </div>
  )

}