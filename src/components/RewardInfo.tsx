import { useContractWrite, usePrepareContractWrite, useWaitForTransaction, useContractRead, useAccount} from 'wagmi'
import { useState, useEffect } from 'react'
import styled from 'styled-components'
import { request, gql } from 'graphql-request'
import { useQuery } from 'react-query'
import { Contract, ethers } from 'ethers'

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

export function RewardInfo() {
  const { address, isConnected } = useAccount()
  const [params, setParams] = useState({
    incentiveId: '',
    tokenId: '',
  })

  const [incentiveData, setIncentiveData] = useState<(string | number)[]>([]);

  const { data: rewardInfo } = useContractRead({
    address: '0x206439339d40aA4Ce1A57CB8Cc400e67B315DD15',
    abi: V3StakerArtifact.abi,
    functionName: 'getRewardInfo',
    args: [
      incentiveData,
      params.tokenId
    ]
  })

  const fetchData = async () => {
    if (params.incentiveId === '') {
      return
    }
    
    const variables = {
      id: params.incentiveId.toLowerCase()
    }

    console.log('pulling incentive data from graph...')
    console.log(params.incentiveId)

    try {
      const data = await request(endpoint, INCENTIVE_ID_QUERY, variables)
      if (data.incentive === null) {
        return
      }
      setIncentiveData([data.incentive.rewardToken, data.incentive.pool, data.incentive.startTime, data.incentive.endTime, data.incentive.vestingPeriod, data.incentive.refundee])
    } catch (error) {
      console.log(error)
    }
  }



  const handleChange = (e) => {
    const { name, value } = e.target
    setParams((prevParams) => ({ ...prevParams, [name]: value }))
  }

  useEffect(() => {
    fetchData()
  }, [params])

  return (
    <div>
      <h2>Reward Info</h2>
      <p>incentive_id</p>
      <TextInput
        type="text"
        name="incentiveId"
        value={params.incentiveId}
        onChange={handleChange}
        placeholder="Enter Incentive Id"
      />
      <p>token_id</p>
      <TextInput
        type="text"
        name="tokenId"
        value={params.tokenId}
        onChange={handleChange}
        placeholder="Enter Token Id"
      />
      {rewardInfo && (
        <div>
          <h3>Reward Information:</h3>
          <div>
            <p>reward: {ethers.utils.formatUnits(rewardInfo[0], 18).slice(0, -14)} tokens</p>
            <p>maxReward: {ethers.utils.formatUnits(rewardInfo[1], 18).slice(0, -14)} tokens</p>
            <p>secondsInsideX128: {rewardInfo[2].shr(128).toString()} seconds</p>
          </div>
        </div>
    )}
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