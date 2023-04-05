import { useContractWrite, usePrepareContractWrite, useWaitForTransaction, useContractRead, useAccount } from 'wagmi'
import { useState } from 'react'
import styled from 'styled-components'

import V3StakerArtifact from '../contracts/artifacts/V3Staker.json'

export function CreateIncentive() {
  const { address, isConnected } = useAccount()
  const [params, setParams] = useState({
    rewardToken: '',
    rewardAmount: '',
    poolPair: '',
    startTimestamp: '',
    endTimestamp: '',
    vestingPeriod: '',
    refundee: '',
  })

  const { data: factoryAddress, isLoading } = useContractRead({
    address: '0x206439339d40aA4Ce1A57CB8Cc400e67B315DD15',
    abi: V3StakerArtifact.abi,
    functionName: 'factory',
  })

  const { config, error, isError } = usePrepareContractWrite({
    address: '0x206439339d40aA4Ce1A57CB8Cc400e67B315DD15',
    abi: V3StakerArtifact.abi,
    functionName: 'createIncentive',
    args: [
      {
        "rewardToken": params.rewardToken,
        "pool": params.poolPair,
        "startTime": params.startTimestamp,
        "endTime": params.endTimestamp,
        "vestingPeriod": params.vestingPeriod,
        "refundee": params.refundee,
      },
      params.rewardAmount,
    ]
  })
  const { data, write } = useContractWrite(config)
  const {
    data: txData,
    isSuccess,
  } = useWaitForTransaction({
    confirmations: 1,
    hash: data?.hash,
  })
  
  const handleCreateIncentive = async () => {
    if (!isConnected || !address) {
      alert('Please connect your wallet')
      return
    }

    console.log(isError)
    console.log(error)

    console.log('Making write call......')
    console.log('rewardToken: ', params.rewardToken)
    console.log('rewardAmount: ', params.rewardAmount)
    console.log('poolPair: ', params.poolPair)
    console.log('startTimestamp: ', params.startTimestamp)
    console.log('endTimestamp: ', params.endTimestamp)
    console.log('vestingPeriod: ', params.vestingPeriod)
    console.log('refundee: ', params.refundee)

    write!()
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setParams((prevParams) => ({ ...prevParams, [name]: value }))
  }
  
  return (
    <div>
      <div>
        <h3>Incentive Contract Details</h3>
        <p>Factory: {factoryAddress}</p>
      </div>
      <h2>Create Incentive</h2>
      <Button onClick={handleCreateIncentive}>Create Incentive</Button>
      <p>set_token_reward</p>
      <TextInput
        type="text"
        name= "rewardToken"
        value={params.rewardToken}
        onChange={handleChange}
        placeholder="Enter Reward Token Address"
      />
      <p>set_rewards_amount</p>
      <TextInput
        type="text"
        name= "rewardAmount"
        value={params.rewardAmount}
        onChange={handleChange}
        placeholder="Enter Reward Amount"
      />
      <p>set_pool_pair</p>
      <TextInput
        type="text"
        name= "poolPair"
        value={params.poolPair}
        onChange={handleChange}
        placeholder="Enter Pool Pair"
      />
      <p>set_start_timestamp</p>
      <TextInput
        type="text"
        name= "startTimestamp"
        value={params.startTimestamp}
        onChange={handleChange}
        placeholder="Enter Start Timestamp"
      />
      <p>set_end_timestamp</p>
      <TextInput
        type="text"
        name= "endTimestamp"
        value={params.endTimestamp}
        onChange={handleChange}
        placeholder="Enter End Timestamp"
      />
      <p>set_vesting_period</p>
      <TextInput
        type="text"
        name= "vestingPeriod"
        value={params.vestingPeriod}
        onChange={handleChange}
        placeholder="Enter Vesting Period"
      />
      <p>set_refundee</p>
      <TextInput
        type="text"
        name= "refundee"
        value={params.refundee}
        onChange={handleChange}
        placeholder="Enter Refundee"
      /> 

    </div>
  )
}

export const Button = styled.button`
  cursor: pointer;
  font-size: large;
  color: green;
  border: none;
  background-color: #165B33;
  :hover {
    background-color: #146B3A;
  }
  :active {
    background-color: #146B3A;
  }
  :disabled {
    color: gray;
    background-color: darkgray;
  }
  border-radius: 0.5em;
`

export const TextInput = styled.input`
  font-family: Alagard;
  font-size: 1em;
  width: 30%;
  padding: 1em;
  background: #00000000;
  border: dashed;
  border-color: #F8B229;
`