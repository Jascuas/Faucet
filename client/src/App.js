import React, { useEffect, useState, Component  } from "react";
import Web3 from "web3";
import './App.css';

function App() {
  const [web3Api, setWeb3Api] = useState({
    provider: null,
    we3: null
  })

  useEffect(() => {
    const loadProvider = async () => {
      let provider = null;

      if (window.ethereum) {
        provider = window.ethereum;
      } else if (window.web3) {
        provider = window.web3.currentProvider;
      } else if (!process.env.production) {
        provider = new Web3.provider.HtppProvider("http://192.168.1.0:7545");
      }

    }

    loadProvider();
  }, [])
  
    return (
      <div className="faucet-wrapper">
        <div className="faucet">
          <div className="balance-view is-size-2">
            Current Balance: <strong>10</strong> ETH
          </div>
          <button className="btn mr-2"
            onClick={async () => {
              const accounts = await window.ethereum.request({ method: "eth_requestAccounts" })
              console.log(accounts)
            }}
          >Connect</button>
          <button className="btn mr-2">Donate</button>
          <button className="btn">Withdraw</button>
        </div>
      </div>
    );
  }

  export default App;
