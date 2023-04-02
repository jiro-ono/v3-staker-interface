import { useNetwork, useSwitchNetwork } from 'wagmi'


export function NetworkSwitcher() {
  const { chain } = useNetwork()
  console.log(chain)
  const { chains, error, isLoading, pendingChainId, switchNetwork } =
    useSwitchNetwork()

  return (
    <div>
      <div>
        Connected to {chain?.name ?? chain?.id}
        {chain?.unsupported && ' (unsupported)'}
      </div>

      <div>{error && error.message}</div>
    </div>
  )
}