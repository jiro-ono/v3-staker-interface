import { useContractRead, useAccount } from 'wagmi'
import { useState } from 'react'
import styled from 'styled-components'
import { request, gql } from 'graphql-request'
import { useQuery } from 'react-query'

import V3StakerArtifact from '../contracts/artifacts/V3Staker.json'

const endpoint = "https://api.thegraph.com/subgraphs/name/jiro-ono/v3-staker"
const USER_STAKES_QUERY = gql`
  query userStakes($address: String!) {
    stakes(where: {user: $address}) {
      id
      staker {
        id
      }
      position {
        id
      }
      incentive {
        id
      }
      stakedTimestamp
      activeStake
    }
  }
`

export function UserStakes() {
  const { address, isConnected } = useAccount()

  const { data, isLoading, error } = useQuery("userStakes", () => {
    return request(endpoint, USER_STAKES_QUERY, {
      "address": address?.toLowerCase()
    })
  })

  return (
    <div>
      <h2>Your Stakes</h2>
      {isLoading && <p>Loading...</p>}
        {data != undefined &&
          <div>
            {data.stakes.map((stakes) => (
              <div key={stakes.id}>
                <p>Stake Id: {stakes.id}</p>
                <ul>
                  <li>Staker: {stakes.staker.id}</li>
                  <li>Position: {stakes.position.id}</li>
                  <li>Incentive: {stakes.incentive.id}</li>
                  <li>Staked Timestamp: {stakes.stakedTimestamp}</li>
                  <li>Active Stake: {stakes.activeStake.toString()}</li>
                </ul>
              </div>
            ))}
          </div>
        }
    </div>
  )
}