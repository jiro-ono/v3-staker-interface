import { useContractWrite, usePrepareContractWrite, useWaitForTransaction, useContractRead, useAccount} from 'wagmi'
import { useState } from 'react'
import styled from 'styled-components'

import V3StakerArtifact from '../contracts/artifacts/V3Staker.json'

export function Stake() {
  const { address, isConnected } = useAccount()
  const [params, setParams] = useState({
    incentiveId: '',
    tokenId: '',
  })


  const handleStake = async () => {
    console.log("Making write call...")
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setParams((prevParams) => ({ ...prevParams, [name]: value }))
  }

  return (
    <div>
      <h2>Stake</h2>
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