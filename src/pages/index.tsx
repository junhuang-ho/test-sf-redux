import { rpcApi } from "../redux/store";

export default function Home() {
  const realtimeBalanceQuery = rpcApi.useRealtimeBalanceQuery({
    chainId: 80001,
    tokenAddress: "0xab9bbc59359e70EBdfAB5941bc8546E65BBe02da",
    accountAddress: "0x42bb40bF79730451B11f6De1CbA222F17b87Afd7",
  });

  return <div>test</div>;
}
