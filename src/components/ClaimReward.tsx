import { useContractWrite, usePrepareContractWrite, useWaitForTransaction, useContractRead, useAccount } from 'wagmi'
import { useState } from 'react'
import styled from 'styled-components'
import { request, gql } from 'graphql-request'
import { useQuery } from 'react-query'
import { debounce } from 'lodash'

import V3StakerArtifact from '../contracts/artifacts/V3Staker.json'


const endpoint = "https://api.thegraph.com/subgraphs/name/jiro-ono/v3-staker"
const INCENTIVE_ID_QUERY = gql`
    query incentiveKey($id: String!) {
      incentive(id: $id) {
        rewardToken
        pool
        startTime
        endTime
        vestingPeriod
        refundee
      }
    }
  `


export function ClaimReward() {
  const { address, isConnected } = useAccount()
  const [params, setParams] = useState({
    incentiveId: '',
    tokenId: '',
  })
  const [incentiveData, setIncentiveData] = useState({
    'rewardToken': '',
    'pool': '',
    'startTime': '',
    'endTime': '',
    'vestingPeriod': '',
    'refundee': '',
  })

  const { config: unstakeToken } = usePrepareContractWrite({
    address: '0x206439339d40aA4Ce1A57CB8Cc400e67B315DD15',
    abi: V3StakerArtifact.abi,
    functionName: 'unstakeToken',
    args: [
      {
        "rewardToken": incentiveData.rewardToken,
        "pool": incentiveData.pool,
        "startTime": incentiveData.startTime,
        "endTime": incentiveData.endTime,
        "vestingPeriod": incentiveData.vestingPeriod,
        "refundee": incentiveData.refundee,
      },
      params.tokenId
    ]
  })

  const { config: claimReward } = usePrepareContractWrite({
    address: '0x206439339d40aA4Ce1A57CB8Cc400e67B315DD15',
    abi: V3StakerArtifact.abi,
    functionName: 'claimReward',
    args: [
      incentiveData.rewardToken,
      address,
      0
    ]
  })

  const { config: withdrawToken } = usePrepareContractWrite({
    address: '0x206439339d40aA4Ce1A57CB8Cc400e67B315DD15',
    abi: V3StakerArtifact.abi,
    functionName: 'withdrawToken',
    args: [
      params.tokenId,
      address,
      '0x'
    ]
  })

  const { data: unstakeTx, write: writeUnstakeToken} = useContractWrite(unstakeToken)
  const { data: claimTx, write: writeClaimReward} = useContractWrite(claimReward)
  const { data: withdrawTx, write: writeWithdrawToken} = useContractWrite(withdrawToken)
  

  const fetchData = async () => {
    console.log('fetching data...')
    if (params.incentiveId === '' || params.tokenId === '') {
      return
    }
    
    const variables = {
      id: params.incentiveId.toLowerCase()
    }

    console.log('pulling incentive data from graph...')
    console.log(params.incentiveId)

    try {
      const data = await request(endpoint, INCENTIVE_ID_QUERY, variables)
      
      setIncentiveData({
        'rewardToken': data.incentive.rewardToken,
        'pool': data.incentive.pool,
        'startTime': data.incentive.startTime,
        'endTime': data.incentive.endTime,
        'vestingPeriod': data.incentive.vestingPeriod,
        'refundee': data.incentive.refundee,
      })
    } catch (error) {
      console.log(error)
    }
  }

  const debouncedFetchData = debounce(fetchData, 300)

  const handleChange = (e) => {
    const { name, value } = e.target
    setParams((prevParams) => ({ ...prevParams, [name]: value }))
    
    debouncedFetchData()
  }

  const handleUnstake = async () => {
    writeUnstakeToken!()
  }
  const handleClaimReward = async () => {
    writeClaimReward!()
  }
  const handleWithdrawToken = async () => {
    writeWithdrawToken!()
  }

  return (
    <div>
      <h2>Unstake / Claim Reward / Withdraw</h2>
      <Button onClick={handleUnstake}>Unstake</Button>
      <Button onClick={handleClaimReward}>Claim Reward</Button>
      <Button onClick={handleWithdrawToken}>Withdraw</Button>
      <p>incentive_id</p>
      <TextInput
        type="text"
        name= "incentiveId"
        value={params.incentiveId}
        onChange={handleChange}
        placeholder="Enter Incentive Id"
      />
      <p>token_id</p>
      <TextInput
        type="text"
        name= "tokenId"
        value={params.tokenId}
        onChange={handleChange}
        placeholder="Enter Token Id"
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