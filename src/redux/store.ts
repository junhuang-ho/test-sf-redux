import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import { Framework } from "@superfluid-finance/sdk-core";
import { createWrapper } from "next-redux-wrapper";
import { wrapMakeStore } from "next-redux-cookie-wrapper";
import {
  allRpcEndpoints,
  allSubgraphEndpoints,
  createApiWithReactHooks,
  initializeRpcApiSlice,
  initializeSubgraphApiSlice,
  setFrameworkForSdkRedux,
} from "@superfluid-finance/sdk-redux";

import { ethers } from "ethers";

export const rpcApi = initializeRpcApiSlice(
  createApiWithReactHooks
).injectEndpoints(allRpcEndpoints);
export const sfSubgraph = initializeSubgraphApiSlice(
  createApiWithReactHooks
).injectEndpoints(allSubgraphEndpoints);

// @ts-ignore
export const makeStore = wrapMakeStore(() => {
  const chainId = 80001;

  const sfFramework = () =>
    Framework.create({
      chainId: chainId,
      provider: new ethers.providers.StaticJsonRpcProvider("YOUR_HTTP_RPC_URL"),
      customSubgraphQueriesEndpoint:
        "https://api.thegraph.com/subgraphs/name/superfluid-finance/protocol-v1-mumbai",
    });
  setFrameworkForSdkRedux(chainId, sfFramework);

  const store = configureStore({
    reducer: {
      [rpcApi.reducerPath]: rpcApi.reducer,
      [sfSubgraph.reducerPath]: sfSubgraph.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware()
        .concat(rpcApi.middleware)
        .concat(sfSubgraph.middleware),
  });

  return store;
});

export const wrapper = createWrapper(makeStore, {
  debug: false,
  serializeState: (state: any) => JSON.stringify(state),
  deserializeState: (state: any) => JSON.parse(state),
});
