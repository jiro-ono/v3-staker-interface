import { useAccount } from 'wagmi'
import { useState } from 'react'
import styled from 'styled-components'

export function IncentivesList() {
  const { address, isConnected } = useAccount()
  
  return (
    <div>
      <h2>Incentives List</h2>
    </div>
  )
}