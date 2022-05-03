const { expect } = require("chai")
const { ethers } = require("hardhat")

async function runTests() {

  let voting
  let deployTime

  const accs = await ethers.getSigners()
  const owner = accs[0]
  const cnd1 = accs[17]
  const cnd2 = accs[18]
  const cnd3 = accs[19]
  const voter = accs[1]

  const correctSum = "" + 1e16  // 0.01 ETH
  const voteDuration = 3  // time for test
  const sleepingTime = voteDuration * 1000

  const _ = undefined

  // function for fast default vote
  async function vote(_acc=voter, _index=0, _cnd=cnd1.address, _sum=correctSum) {
    return await voting.connect(_acc).vote(_index, _cnd, { value: _sum })
  }

  // function for fast default create voting
  async function addVoting(_acc=owner, _index=0, _addresses=[cnd1.address, cnd2.address]) {
    return await voting.connect(_acc).addVoting(_index, _addresses)
  }

  function sleep(timeout) {
    return new Promise(resolve => setTimeout(resolve, timeout));
  }
  
  describe("step1", async () => {  // without pre-created voting
  
    beforeEach(async function() {
      const _voting = await ethers.getContractFactory("CryptonVoting", owner)
      voting = await _voting.deploy(10)
      await voting.deployed()
    })
  
    it("SHOULD BE SUCCESS  | deploy with correct address", async function() {
      expect(voting.address)
        .to.be.properAddress
    })
  
    it("SHOULD BE SUCCESS  | 0 ether by default", async function() {
      const balance = await voting.getBalance()
      expect(balance).to.eq(0)  
    })
    
    it("SHOULD BE SUCCESS  | 0 free balance on contract", async function() {
      const freeBalance = await voting.connect(owner).freeBalance()
      expect(freeBalance).to.be.eq(0)
    })

    it("SHOULD BE REVERTED | no such voting", async function() {
      await expect(vote())
        .to.be.revertedWith('No such voting!')
    })
    
    it("SHOULD BE REVERTED | not owner create voting", async function() {
      await expect(addVoting(voter))
        .to.be.revertedWith('You are not an owner!')
    })

    it("SHOULD BE REVERTED | create voting without arguments", async function() {
      await expect(voting.connect(owner).addVoting())
        .to.be.reverted;
    })
  
    it("SHOULD BE REVERTED | incorrect input length", async function() {
      await expect(addVoting(_, _, _addresses=[cnd1.address]))
        .to.be.revertedWith('Must have at least two candidates!')
    })
    
    it("SHOULD BE REVERTED | create voting with duplicates", async function() {
      await expect(addVoting(_, _, _addresses=[cnd1.address, cnd1.address, cnd2.address]))
        .to.be.revertedWith('Dont use duplicates when adding candidates!')
    })

    it("SHOULD BE SUCCESS  | create voting without duplicates", async function() {
      await addVoting()
      const result = await voting.connect(voter).getCandidates(0)
      expect(result[0], result[1]).to.be.eq(cnd1.address, cnd2.address)
    })
  
  }) 
  
  describe("step2", async () => {  // with pre-created voting
    
    beforeEach(async function() {
      const _voting = await ethers.getContractFactory("CryptonVoting", owner)
      voting = await _voting.deploy(voteDuration)
      await voting.deployed()
      deployTime = (await ethers.provider.getBlock()).timestamp
      await addVoting()  // pre-create voting
    })
  
    it("SHOULD BE REVERTED | vote index is taken", async function() {
      await expect(addVoting())
        .to.be.revertedWith('This index is taken!')
    })
  
    it("SHOULD BE REVERTED | vote for yourself", async function() {
      await expect(vote(cnd1))
        .to.be.revertedWith('You cant vote for yourself!')
    })
  
    it("SHOULD BE REVERTED | incorrect vote price", async function() {
      await expect(vote(_, _, _, 1e13))
        .to.be.revertedWith('Incorrect voting prise!')
    })
  
    it("SHOULD BE SUCCESS  | vote change balances", async function() {
      const tx = vote()
      await expect(() => tx)
        .to.changeEtherBalances([voter, voting], ["-" + correctSum, correctSum])
    })
  
    it("SHOULD BE REVERTED | cant finish voting yet", async function() {
      await expect(voting.connect(voter).finishVoting(0))
        .to.be.revertedWith('Cant finish voiting yet!')
    })
  
    it("SHOULD BE SUCCESS  | no winner by default", async function() {
      const result = await voting.connect(voter).getWinner(0)
      expect(result[0]).to.be.eq('0');
    })
  
    it("SHOULD BE SUCCESS  | return candidates by vote", async function() {
      const result = await voting.connect(voter).getCandidates(0)
      expect(result[0], result[1]).to.be.eq(cnd1.address, cnd2.address)
    })
  
    it("SHOULD BE SUCCESS  | return the candidate votes", async function() {
      const result = await voting.connect(voter).getVotes(0, cnd1.address)
      expect(result).to.be.eq(0)
    })
  
    it("SHOULD BE REVERTED | person already vote", async function() {
      await vote()
      await expect(vote())
        .to.be.revertedWith('You have already voted!')
    })
  
    it("SHOULD BE SUCCESS  | return voting time left", async function() {
      const time = (await ethers.provider.getBlock()).timestamp
      const result = await voting.connect(voter).getTimeLeft(0)
      expect(result).to.be.eq(deployTime - time + voteDuration + 1)
    })
  
    it("SHOULD BE REVERTED | try finish non-existing voting", async function() {
      await expect(voting.connect(voter).finishVoting(1)).
        to.be.revertedWith("Voting not found!")
    })

    it("SHOULD BE SUCCESS  | vote change votes", async function() {
      await vote()
      
      const result1 = await voting.connect(voter).getVotes(0, cnd1.address)
      expect(result1).to.be.eq(1)
    })
    
    it("SHOULD BE SUCCESS  | winner not change if the number of votes is equal", async function() {
      await vote()
      const result = await voting.connect(voter).getWinner(0)
      expect(result).to.be.eq(cnd1.address);

      await vote(cnd1, _, cnd2.address)
      const result1 = await voting.connect(voter).getWinner(0)
      expect(result1).to.be.eq(cnd1.address);
    })

    it("SHOULD BE REVERTED | try withdraw out of free balance", async function() {
      await expect(voting.connect(owner).withdraw("" + 1e18))
        .to.be.revertedWith("Value is out of free balance!")
    })
    
    it("SHOULD BE REVERTED | try withdraw null value", async function() {
      await expect(voting.connect(owner).withdraw(0))
        .to.be.revertedWith("Cant withdraw null value!")
    })
  
    it("SHOULD BE REVERTED | try vote to non-existent candidate", async function() {
      await expect(vote(_, _, cnd3.address))
        .to.be.revertedWith("No such candidate!")
    })
    
    it("SHOULD BE SUCCESS  | withdraw free balance", async function() {
      await vote()

      await sleep(sleepingTime)

      await voting.connect(voter).finishVoting(0)
      const tx = await voting.connect(owner).withdraw("" + 1e15)
      await expect(() => tx)
        .to.changeEtherBalances([voting, owner], ["-" + 1e15, "" + 1e15]);
    })

    it("SHOULD BE SUCCESS  | finish voting with winner", async function() {
      await vote()
      const result = await voting.connect(voter).getWinner(0)
      expect(result).to.be.eq(cnd1.address);

      await sleep(sleepingTime)

      const tx = await voting.connect(voter).finishVoting(0)
      await expect(() => tx)
        .to.changeEtherBalances([voting, cnd1], ["-" + 1e16*0.9, "" + 1e16*0.9])
    })

    it("SHOULD BE REVERTED | try vote in finished voting", async function() {
      await sleep(sleepingTime)

      await expect(vote())
        .to.be.revertedWith("This vote is over!")
    })  

    it("SHOULD BE REVERTED | try finish voting again", async function() {
      await sleep(sleepingTime)

      await voting.connect(voter).finishVoting(0)
      await expect(voting.connect(voter).finishVoting(0)).
        to.be.revertedWith("Voting not found!")
    })
  })
}

runTests()
