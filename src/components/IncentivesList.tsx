import { useAccount } from 'wagmi'
import { useState } from 'react'
import styled from 'styled-components'
import { request, gql } from 'graphql-request'
import { useQuery } from 'react-query'

const endpoint = "https://api.thegraph.com/subgraphs/name/jiro-ono/v3-staker"
  const INCENTIVES_QUERY = gql`
    query {
      incentives(first: 5) {
        id
        staker {
          id
        }
        creator {
          id
        }
        rewardToken
        pool
        startTime
        endTime
        vestingPeriod
        refundee
        initialRewardAmount
		    ended
        stakes {
          id
        }
      }
    }
  `

export function IncentivesList() {
  const { address, isConnected } = useAccount()

  const { data, isLoading, error } = useQuery("incentives", () => {
    return request(endpoint, INCENTIVES_QUERY)
  })

  return (
    <div>
      <h2>Incentives List</h2>
      {isLoading && <p>Loading...</p>}
        {data != undefined && 
          <div>
            {data.incentives.map((incentives) => (
              <div key={incentives.id}>
                <p>Incentive Id: {incentives.id}</p>
                <ul>
                  <li>Staker: {incentives.staker.id}</li>
                  <li>Creator: {incentives.creator.id}</li>
                  <li>Reward Token: {incentives.rewardToken}</li>
                  <li>Pool: {incentives.pool}</li>
                  <li>Start Time: {incentives.startTime}</li>
                  <li>End Time: {incentives.endTime}</li>
                  <li>Vesting Period: {incentives.vestingPeriod}</li>
                  <li>Refundee: {incentives.refundee}</li>
                  <li>Initial Reward Amount: {incentives.initialRewardAmount}</li>
                  <li>Ended: {incentives.ended.toString()}</li>
                </ul>
              </div>
            ))}
          </div>
        }
    </div>
  )
}