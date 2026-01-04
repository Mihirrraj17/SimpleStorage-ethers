const { ethers } = require('ethers');

const contractAddress = "0x9c55f3e3add063f294f90f28515c3e610a8601a8";
const abi = [
    {
        "inputs": [],
        "name": "get",
        "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [{ "internalType": "uint256", "name": "store", "type": "uint256" }],
        "name": "set",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    }
];

async function connect() {
    if (typeof window.ethereum !== "undefined") {
        try {
            await window.ethereum.request({ method: "eth_requestAccounts" });
            const hiddenDiv = document.getElementById("hidden");
            document.getElementById("hidden").style.display = "block";
            document.getElementById("container-connect").style.display = "none";
            
        } catch (e) {
            console.error(e);
            alert("User rejected connection.");
        }
    } else {
        alert("Please install MetaMask!");
    }
}

async function setValue() {
    const status = document.getElementById("statusMessage");
    const value = document.getElementById("numInput").value;

    if (!value) {
        alert("Please enter a number first!");
        return;
    }

    if(status) status.innerText = "Sending transaction...";
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, abi, signer);

    try {
        const tx = await contract.set(valueToStore);
        if(status) status.innerText = "Mining transaction...";
        await tx.wait();
        if(status) status.innerText = `Success!`;
        console.log(tx);
    } catch (error) {
        console.error(error);
        if(status) status.innerText = "Error: See console for details.";
    }
}

async function getValue() {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const contract = new ethers.Contract(contractAddress, abi, provider);
    
    try {
        const value = await contract.get();
        alert("Stored Value: " + value.toString());
    } catch (error) {
        console.error(error);
    }
}
window.connect = connect;
window.setValue = setValue;
window.getValue = getValue;