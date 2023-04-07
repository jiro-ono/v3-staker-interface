import { useContractWrite, usePrepareContractWrite, useWaitForTransaction, useContractRead, useAccount} from 'wagmi'
import { useState } from 'react'
import styled from 'styled-components'
import { request, gql } from 'graphql-request'
import { useQuery } from 'react-query'
import { debounce } from 'lodash'
import { Contract, ethers } from 'ethers'

import V3StakerArtifact from '../contracts/artifacts/V3Staker.json'
import NFTPositions from '../contracts/artifacts/NFTPositions.json'

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

export function Stake() {
  const abiEncoder = new ethers.utils.AbiCoder()
  const { address, isConnected } = useAccount()
  const [params, setParams] = useState({
    incentiveId: '',
    tokenId: '',
  })
  const [incentiveData, setIncentiveData] = useState('0x')

  const { config: approve } = usePrepareContractWrite({
    address: '0xC36442b4a4522E871399CD717aBDD847Ab11FE88',
    abi: NFTPositions.abi,
    functionName: 'setApprovalForAll',
    args: [
      '0x206439339d40aA4Ce1A57CB8Cc400e67B315DD15',
      true,
    ]
  })
  const { data: approveData, write: writeApprove } = useContractWrite(approve)
  const {
    data: approveTxData,
    isSuccess: approveIsSuccess,
  } = useWaitForTransaction({
    confirmations: 1,
    hash: approveData?.hash,
  })

  const { config: stakeToken, error, isError } = usePrepareContractWrite({
    address: '0xC36442b4a4522E871399CD717aBDD847Ab11FE88',
    abi: NFTPositions.abi,
    functionName: 'safeTransferFrom',
    args: [
      address,
      '0x206439339d40aA4Ce1A57CB8Cc400e67B315DD15',
      parseInt(params.tokenId, 10),
      incentiveData,
    ]
  })
  const { data, write: writeStakeToken } = useContractWrite(stakeToken)
  const {
    data: txData,
    isSuccess,
  } = useWaitForTransaction({
    confirmations: 1,
    hash: data?.hash,
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
      
      const params = abiEncoder.encode(
        ['address', 'address', 'uint256', 'uint256', 'uint256', 'address'],
        [data.incentive.rewardToken, data.incentive.pool, data.incentive.startTime, data.incentive.endTime, data.incentive.vestingPeriod, data.incentive.refundee]
      )
      setIncentiveData(params)
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

  const handleStake = async () => {
    if (!isConnected || !address) {
      alert('Please connect your wallet')
      return
    }

    if (incentiveData === '0x') {
      alert('Please enter a valid incentive id')
      return
    }

    console.log("Making write call...")

    writeStakeToken!()  
  }

  const handleApprove = async () => {
    if (!isConnected || !address) {
      alert('Please connect your wallet')
      return
    }

    console.log("Making approve call...")
    writeApprove!()
  } 

  return (
    <div>
      <h2>Stake</h2>
      <Button onClick={handleApprove}>Approve</Button>
      <Button onClick={handleStake}>Stake</Button>
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
        placeholder="Enter NFT Position Token Id"
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