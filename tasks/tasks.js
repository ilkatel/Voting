const { task } = require('hardhat/config')
require('dotenv').config()

const cAddress = process.env.CONTRACT_ADDRESS
const correctSum = "" + 1e16  // 0.01 eth

function printHash(result) {
    console.log(` >>> tx hash: ${result.hash}`)
}

async function getOwner() {
    const [owner] = await hre.ethers.getSigners()
    return owner
}

async function getContract() { 
    const metadata = require('../artifacts/contracts/Voting.sol/CryptonVoting.json')

    const voting = new hre.ethers.Contract(
        cAddress,
        metadata.abi,
        await getOwner()
    )

    return voting
}

function toEther(_wei) {
    return hre.ethers.utils.formatEther(_wei)
}

function toWei(_eth) {
    return hre.ethers.utils.parseEther(_eth)
}

function correctAddress(_addresses) {
    for (let i = 0; i < _addresses.length; i++) {
        if (hre.ethers.utils.isAddress(_addresses[i]))
            _addresses[i] = hre.ethers.utils.getAddress(_addresses[i])
        else
            throw ` >>> Incorrect address ${_addresses[i]}`
    }
    return _addresses
}

function catchError(e) {
    try {
        console.log(`\n >>> Transaction reverted with reason:\n${e.reason}\n\n >>> Error:\n${e.error}`)
    } catch(_) {
        console.log(`\n >>> Error!\n${e}`)
    }
}

// npx hardhat address
task("address", "Returns contract address")
    .setAction(async () => {
        console.log(cAddress)
})

// npx hardhat addressBalance --address 0x...
task("addressBalance", "Prints an address balance")
    .addParam("address", "Account address")
    .setAction(async (taskArgs) => {
        const address = correctAddress([taskArgs.address])
        const balance = await hre.network.provider.send('eth_getBalance', [address[0]])
        console.log(` >>> ${toEther(balance)} ETH`)
})

// npx hardhat freeBalance
task("freeBalance", "Prints an free balance")
    .setAction(async () => {
        const voting = await getContract()
        const freeBalance = await voting.freeBalance()
        console.log(` >>> ${toEther(freeBalance)} ETH`)
})

// npx hardhat balance
task("balance", "Prints an contract balance")
    .setAction(async () => {
        const voting = await getContract()
        const balance = await voting.getBalance()
        console.log(` >>> ${toEther(balance)} ETH`)
})

// npx hardhat getTimeLeft --index 0
task("getTimeLeft", "Returns the remaining voting time")
    .addParam("index", "The index of voting")
    .setAction(async (taskArgs) => {
        const voting = await getContract()
        const result = await voting.getTimeLeft(taskArgs.index)
        console.log(` >>> Time left ${result}`)
})

// npx hardhat addVoting --index 0 --addresses 0x...,0x...
task("addVoting", "Add new voting")
    .addParam("index", "The index of voting")
    .addParam("addresses", "Candidates addresses | string format addr1,addr2")
    .setAction(async (taskArgs) => {
        const addresses = correctAddress(taskArgs.addresses.split(','))

        try {
            const voting = await getContract()
            await voting.addVoting(taskArgs.index, addresses)
                .then(result => printHash(result))
            result = await voting.getCandidates(taskArgs.index)
            console.log(` >>> Added successfully\n\n${result}`)
        } catch(e) {
            catchError(e)
        }
})

// npx hardhat getCandidates --index 0
task("getCandidates", "Returns candidates by voting")
    .addParam("index", "The index of voting")
    .setAction(async (taskArgs) => {
        const voting = await getContract()
        const result = await voting.getCandidates(taskArgs.index)
        console.log(result)
})

// npx hardhat getVotes --index 0 --address 0x...
task("getVotes", "Returns candidate by voting")
    .addParam("index", "The index of voting")
    .addParam("address", "The candidate address")
    .setAction(async (taskArgs) => {
        const address = correctAddress([taskArgs.address])[0]
        const voting = await getContract()
        const result = await voting.getVotes(taskArgs.index, address)
        console.log(` >>> ${result}`)
})

// npx hardhat getWinner --index 0
task("getWinner", "Returns voting winners")
    .addParam("index", "The index of voting")
    .setAction(async (taskArgs) => {
        const voting = await getContract()
        const result = await voting.getWinner(taskArgs.index)
        if (result == 0)
            console.log(' >>> No winner')
        else
            console.log(` >>> Winner:\n ${result}`)
})

// npx hardhat vote --index 0 --address 0x...
task("vote", "Vote to candidate by string name")
    .addParam("index", "The index of voting")
    .addParam("address", "The candidate address")
    .setAction(async (taskArgs) => {
        const address = correctAddress([taskArgs.address])[0]
        try {
            const voting = await getContract()
            await voting.vote(taskArgs.index, address, {value: correctSum})
                .then(result => printHash(result))
            console.log(` >>> Vote to ${address} done`)
        } catch(e) {
            catchError(e)
        }
})

// npx hardhat finish --index 0
task("finish", "Finish voting by index")
    .addParam("index", "The index of voting")
    .setAction(async (taskArgs) => {
        try {
            const voting = await getContract()
            await voting.finishVoting(taskArgs.index)
                .then(result => printHash(result))
            console.log(` >>> Voting ${taskArgs.index} finished`)
        } catch(e) {
            catchError(e)
        }
})

// npx hardhat withdraw --value 0.1
task("withdraw", "Withdraw free ethers")
    .addParam("value", "ETH value")
    .setAction(async (taskArgs) => {
        const value = toWei(taskArgs.value)
        console.log(` >>> Wei value: ${value}`)
        try {
            const voting = await getContract()
            await voting.withdraw(value)
                .then(result => printHash(result))
            console.log(` >>> Withdraw ${taskArgs.value} ETH success`)
        } catch(e) {
            catchError(e)
        }    
})
