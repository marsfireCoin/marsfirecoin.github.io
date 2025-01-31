// src/App.js
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { motion } from "framer-motion";
import "./App.css";

const CONTRACT_ADDRESS = "0xYourContractAddressHere";
const ABI = [
  { "constant": false, "inputs": [{ "name": "_amount", "type": "uint256" }], "name": "claimReward", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
  { "constant": true, "inputs": [{ "name": "_owner", "type": "address" }], "name": "balanceOf", "outputs": [{ "name": "balance", "type": "uint256" }], "stateMutability": "view", "type": "function" }
];

function App() {
  const [wallet, setWallet] = useState(null);
  const [balance, setBalance] = useState(0);
  const [score, setScore] = useState(0);
  const [earned, setEarned] = useState(0);
  const [playerPos, setPlayerPos] = useState(50);

  const connectWallet = async () => {
    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await window.ethereum.request({ method: "eth_requestAccounts" });
      const signer = provider.getSigner();
      const address = await signer.getAddress();
      setWallet(address);
      fetchBalance(address, provider);
    } else {
      alert("Please install MetaMask!");
    }
  };

  const fetchBalance = async (address, provider) => {
    const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, provider);
    const balance = await contract.balanceOf(address);
    setBalance(ethers.utils.formatUnits(balance, 18));
  };

  const claimReward = async () => {
    if (!wallet) return alert("Connect your wallet first!");
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);
    const tx = await contract.claimReward(ethers.utils.parseUnits(earned.toString(), 18));
    await tx.wait();
    alert("Reward claimed!");
    fetchBalance(wallet, provider);
    setEarned(0);
  };

  const jump = () => {
    setPlayerPos((prev) => Math.max(0, prev - 25));
    setTimeout(() => setPlayerPos((prev) => Math.min(80, prev + 25)), 500);
    setScore((prev) => prev + 1);
    setEarned((prev) => prev + 10);
  };

  return (
    <div className="game-container">
      <h1>MarsFireCoin P2E</h1>
      <button onClick={connectWallet}>{wallet ? "Connected" : "Connect Wallet"}</button>
      <p>Balance: {balance} MFC</p>
      <p>Earned: {earned} MFC</p>
      <div className="game-area">
        <motion.div className="player" animate={{ top: `${playerPos}%` }} />
      </div>
      <button onClick={jump}>Jump</button>
      <button onClick={claimReward} disabled={earned === 0}>Claim Coins</button>
    </div>
  );
}

export default App;