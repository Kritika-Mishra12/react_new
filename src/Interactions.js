import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Web3 from "web3";
import styles from './Wallet.module.css';

const Interactions = (props) => {
    const [mintHash, setMintHash] = useState('');
    const [TransactionblockNumber, setTransactionBlockNumber] = useState('');
    const [currentBlockNumber, setCurrentBlockNumber] = useState('');
    const [currentBnbPrice, setCurrentBnbPrice] = useState('');

    useEffect(() => {
        const fetchBlockNumber = async () => {
            const web3 = new Web3(Web3.givenProvider || 'https://data-seed-prebsc-1-s1.binance.org:8545/');
            let latestBlockNumber = await web3.eth.getBlockNumber();
            setCurrentBlockNumber("Current Block Number: " + latestBlockNumber);
        };

        const fetchBnbPrice = async () => {
            try {
                const response = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=binancecoin&vs_currencies=usd');
                setCurrentBnbPrice("Current BNB Price: $" + response.data.binancecoin.usd);
            } catch (error) {
                console.error('Error fetching BNB price:', error);
            }
        };

        fetchBlockNumber();
        fetchBnbPrice();
    }, []);

    const mintHandler = async (e) => {
        e.preventDefault();
        let transferAmount = e.target.sendAmount.value;
        let receiverAddress = e.target.receiverAddress.value;

        let tx = await props.contract.mint(receiverAddress, transferAmount); 
        console.log(tx);
        setMintHash("Transfer confirmation hash: " + tx.hash);

        // Define the BscScan API URL for fetching transaction details
        const apiUrl = `https://api-testnet.bscscan.com/api?module=proxy&action=eth_getTransactionByHash&txhash=${tx.hash}&apikey=YourApiKeyToken`;

        // Make an Axios GET request to the BscScan API
        axios.get(apiUrl)
            .then(response => {
                const result = response.data.result;
                if (result) {
                    const blockNumber = parseInt(result.blockNumber, 16);
                    setTransactionBlockNumber("Transaction Block Number: " + blockNumber);
                }
            })
            .catch(error => {
                console.error('Error fetching transaction details:', error);
            });
    }

    return (
        <div className={styles.interactionsCard}>
            <form onSubmit={mintHandler}>
                <div>
                    {currentBlockNumber}
                </div>
                <div>
                    {currentBnbPrice}
                </div>
                <h3> Mint Token </h3>
                <p> Receiver Address </p>
                <input type='text' id='receiverAddress' className={styles.addressInput} />

                <p> Send Amount </p>
                <input type='number' id='sendAmount' min='0' step='1' />

                <button type='submit' className={styles.button6}>Send</button>
                <div>
                    {mintHash}
                </div>
                <div>
                    {TransactionblockNumber}
                </div>
            </form>
        </div>
    );
}

export default Interactions;



