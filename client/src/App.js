import React, {useCallback, useEffect, useState } from "react";
import Web3 from "web3";
import './App.css';
import detectEthereumProvider from '@metamask/detect-provider';
import {loadContract} from "./utils/loadContract";


function App() {

  const [web3Api, setWeb3Api] = useState({
    provider: null,
    web3: null,
    contract: null
  });

  const [balance, setBalance] = useState(null);
  const [account, setAccount] = useState(null);


  const setAccountListener = provider => {

    provider.on('accountsChanged', accounts => {

      if (accounts.length === 0) {
        // MetaMask is locked or the user has not connected any accounts
        setAccount(null);
      } else  {
        // MetaMask is change user accounts
        setAccount(accounts[0])
        // Do any other work!
      }
    })
  }

  useEffect(() => {
    const loadProvider = async () => {
      const provider = await detectEthereumProvider();
      const contract = await loadContract("Faucet", provider);


      if (provider) {
        setAccountListener(provider);
        setWeb3Api({
          web3: new Web3(provider),
          provider,
          contract
        })
        console.log(provider)
        console.log('Ethereum successfully detected!')
        // From now on, this should always be true:
        // provider === window.ethereum

        // Access the decentralized web!
      } else {

        // if the provider is not detected, detectEthereumProvider resolves to null
        console.error('Please install MetaMask!')
      }


    }

    loadProvider();
  }, [])

  useEffect(() => {
    const loadBalance = async () => {
      const { contract, web3 } = web3Api;
      const balance = await web3.eth.getBalance(contract.address);
      setBalance(web3.utils.fromWei(balance, 'ether'));
    }


    web3Api.contract && loadBalance();
  }, [web3Api])

  useEffect(() => {
    const getAccount = async () => {
      const accounts = await web3Api.web3.eth.getAccounts()
      setAccount(accounts[0])
    }

    web3Api.web3 && getAccount();
  }, [web3Api.web3])

  async function loadAccount() {
    let button = document.querySelector("#Connect");
    button.className = "button is-small is-loading mr-2"
    const accounts = await web3Api.provider.request({ method: 'eth_requestAccounts' });
    setAccount(accounts[0])
  }

  const addFunds = useCallback(async () => {
    const { contract, web3 } = web3Api
    await contract.addFunds({
      from: account,
      value: web3.utils.toWei("1", "ether")
    })
  }, [web3Api, account])

  return (
    <div className="faucet-wrapper ">
      <div className="faucet">
        <div className="is-flex is-aling-items-center">
          <span className="mr-2">
            <strong>Account: </strong>
          </span>
          <h1>
            {account ?
              account :
              <button
                id="Connect"
                className="button is-small mr-2"
                onClick={loadAccount}
              >Connect Wallet</button>}
          </h1>
        </div>
        <div className="balance-view is-size-2 my-4">
          Current Balance: <strong>{balance}</strong> ETH
        </div>

        <button className="button is-link mr-2" onClick={addFunds}>Donate 1 eth</button>
        <button className="button is-primary">Withdraw</button>
      </div>
    </div>
  );
}

export default App;
