// import * as utils from "lib/minting-utils";
import * as utils from "lib/gcoinmint";
import { useCallback, useMemo, useState, useEffect } from "react";
import { useCardano, utility } from "use-cardano";

import { Inter } from "@next/font/google";
// import { getStatus } from "../lib/minting-utils";
const inter = Inter({ subsets: ["latin"] });

export default function Mint() {
  const { lucid, account, showToaster, hideToaster } = useCardano();
  const upDate = useCallback(async () => {
    try {
      if (!lucid || !account?.address) return;

      const nftTx = await utils.mintNFT(lucid);

      showToaster("Updated", `Transaction: ${nftTx}`);
    } catch (e) {
      if (utility.isError(e)) showToaster("Could not update", e.message);
      else if (typeof e === "string") showToaster("Could not update", e);
    }
  }, [lucid, account?.address, showToaster]);

  const transferToken = useCallback(async () => {
    try {
      if (!lucid || !account?.address ) return;

      const nftTx = await utils.transfer(lucid);
      showToaster("Burned", `Transaction: ${nftTx}`);
    } catch (e) {
      if (utility.isError(e)) showToaster("Could not burn Gcoin token", e.message);
      else if (typeof e === "string") showToaster("Could not burn Gcoin token", e);
    }
  }, [lucid, account?.address, showToaster]);
 
  const canMint = useMemo(
    () => lucid && account?.address ,
    [lucid, account?.address]
  );

  const canBurn = useMemo(
    () => lucid && account?.address,
    [lucid, account?.address]
  );

  return (
    <div className="text-center text-gray-900 dark:text-gray-100">
      <h1
        style={inter.style}
        className="mb-4 text-4xl font-extrabold tracking-tight leading-none md:text-5xl lg:text-6xl py-2"
      >
        NFT 
      </h1>

      <div style={inter.style} className="my-4 text-center">
        {/* A decentralized and AI-driven stable asset. */}
      </div>

      {/* <div className="text-left my-8"> */}
      {/* className="relative flex justify-center items-center w-full h-screen bg-slate-900 text-white flex-col" */}

      <div className="flex flex-row px-2.5 md:flex-row  justify-center w-full justify-around gap-4 place-content-center justify-center ">
        <div className="w-[500px] max-w-[90%] h-[550px] mt-10 shadow-sm bg-slate-800 rounded-xl flex items-center flex-col p-8 ">
          <div className="rounded-xl text-xl font-bold  text-white">
            Mint NFT 
          </div>
          <button
            disabled={!canMint}
            className="border hover:bg-blue-800 text-white my-4 w-64 py-2 cursor-pointer transition-colors disabled:cursor-not-allowed disabled:text-gray-200 rounded bg-blue-300 disabled:bg-blue-600 dark:bg-white dark:text-gray-800 dark:disabled:bg-white dark:hover:bg-white font-bold uppercase"
            onClick={() => {
              hideToaster();
              upDate();
            }}
          >
            Mint
          </button>
        </div>
        <div className="w-[500px] max-w-[90%] h-[550px] mt-10 shadow-sm bg-slate-800 rounded-xl flex items-center flex-col p-6">
          <div className="rounded-xl text-xl font-bold mb-6 text-white">
            Transfer token
          </div>

          <button
            disabled={!canBurn}
            className="border hover:bg-blue-400 text-white my-4 w-64 py-2 cursor-pointer transition-colors disabled:cursor-not-allowed disabled:text-gray-200 rounded bg-red-300 disabled:bg-red-600 dark:bg-white dark:text-gray-800 dark:disabled:bg-white dark:hover:bg-white font-bold uppercase"
            onClick={() => {
              hideToaster();
              transferToken();
            }}
          >
            Transfer
          </button>

      </div>
      </div>
    </div>
  );
}
