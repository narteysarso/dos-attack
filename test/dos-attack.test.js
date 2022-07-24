const {
  loadFixture,
} = require("@nomicfoundation/hardhat-network-helpers");
const { expect } = require("chai");
const {ethers} = require("hardhat")

describe("DOS attack", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshopt in every test.
  async function setup() {
    const [owner, acc1, acc2, acc3] = await ethers.getSigners();

    const dvContract = await ethers.getContractFactory("DosVulnerable");
    const deployedDVContract = await dvContract.deploy();

    const attackerContract = await ethers.getContractFactory("Attacker");
    const deployedAttackerContract = await attackerContract.deploy(deployedDVContract.address);

    return { deployedDVContract, deployedAttackerContract, owner, acc1, acc2,acc3 };
  }
  async function resistantSetup() {
    const [owner, acc1, acc2, acc3] = await ethers.getSigners();

    const dvContract = await ethers.getContractFactory("DosResistant");
    const deployedDVContract = await dvContract.deploy();

    const attackerContract = await ethers.getContractFactory("Attacker");
    const deployedAttackerContract = await attackerContract.deploy(deployedDVContract.address);

    return { deployedDVContract, deployedAttackerContract, owner, acc1, acc2,acc3 };
  }

  it("Should successfully complete dos attack", async function (){
    const {deployedDVContract, deployedAttackerContract, owner, acc1, acc2, acc3 } = await loadFixture(setup);

    await deployedDVContract.connect(acc1).bid({value: ethers.utils.parseEther("1")});

    expect(await deployedDVContract.highestBidder()).to.equal(acc1.address);

    await deployedDVContract.connect(acc2).bid({value: ethers.utils.parseEther("2")});

    expect(await deployedDVContract.highestBidder()).to.equal(acc2.address);


    await deployedAttackerContract.attack({value: ethers.utils.parseEther("3")});

    expect(await deployedDVContract.highestBidder()).to.equal(deployedAttackerContract.address);

    await deployedDVContract.connect(acc3).bid({value: ethers.utils.parseEther("4")});

    expect(await deployedDVContract.highestBidder()).to.equal(deployedAttackerContract.address);

  })

  it("Should fail dos attack", async function (){
    const {deployedDVContract, deployedAttackerContract, owner, acc1, acc2, acc3 } = await loadFixture(resistantSetup);

    await deployedDVContract.connect(acc1).bid({value: ethers.utils.parseEther("1")});

    expect(await deployedDVContract.highestBidder()).to.equal(acc1.address);

    await deployedDVContract.connect(acc2).bid({value: ethers.utils.parseEther("2")});

    expect(await deployedDVContract.highestBidder()).to.equal(acc2.address);


    await deployedAttackerContract.attack({value: ethers.utils.parseEther("3")});

    expect(await deployedDVContract.highestBidder()).to.equal(deployedAttackerContract.address);

    await deployedDVContract.connect(acc3).bid({value: ethers.utils.parseEther("4")});

    expect(await deployedDVContract.highestBidder()).to.equal(acc3.address);

  })

});
