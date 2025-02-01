import Web3 from "web3";

let web3;
if (window.ethereum) {
    web3 = new Web3(window.ethereum);
    window.ethereum.request({ method: "eth_requestAccounts" })
        .then(accounts => console.log("Connected account:", accounts[0]))
        .catch(err => console.error("Connection error:", err));
} else {
    console.error("Please install MetaMask!");
}

export default web3;
