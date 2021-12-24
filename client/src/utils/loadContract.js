
//import contract from "@truffle/contract";

var contract = require("@truffle/contract");

export const loadContract = async (name, provider) => {
    const res = await fetch(`/contracts/${name}.json`)
    console.log(res)
    const Artifact = await res.json()
    console.log(Artifact)
    const _contract = contract(Artifact);
    _contract.setProvider(provider);

    const deployedContract = await _contract.deployed();

    return deployedContract;
}