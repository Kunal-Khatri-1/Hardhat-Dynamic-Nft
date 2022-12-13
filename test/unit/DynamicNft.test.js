const { assert, expect } = require("chai")
const { network, deployments, ethers } = require("hardhat")
const { developmentChains, FIRST_IMG_URL, SECOND_IMG_URL } = require("../../helper-hardhat-config")

!developmentChains.includes(network.name)
    ? describe.skip
    : describe("Dynamic NFT Unit Tests", function () {
          let dynamicNft,
              deployer,
              accounts,
              testPlayer,
              playerDynamicNft,
              firstImageURL,
              secondImageURL
          beforeEach(async () => {
              accounts = await ethers.getSigners()
              deployer = accounts[0]
              testPlayer = accounts[1]
              await deployments.fixture(["all"])

              dynamicNft = await ethers.getContract("DynamicNft")
              playerDynamicNft = dynamicNft.connect(testPlayer)

              firstImageURL = FIRST_IMG_URL
              secondImageURL = SECOND_IMG_URL
          })

          describe("Constructor is runs correctly", () => {
              it("deployer is the owner", async () => {
                  const owner = await dynamicNft.getOwner()
                  assert.equal(owner, deployer.address)
              })

              it("s_tokenCounter starts with 0", async () => {
                  const tokenCounter = await dynamicNft.getTokenCounter()
                  assert.equal(tokenCounter.toString(), "0")
              })

              it("set the token URI correctly", async () => {
                  const tokenURI = await dynamicNft.tokenURI(1)
                  const expectedTokenURI =
                      "data:application/json;base64,eyJuYW1lIjogIlRpY2tldCIsICJpbWFnZSI6ICJpcGZzOi8vUW1mWFhBU3BuZ2Rla25QdEZCQzY3Zm9HVldKWjFTcVc1YWI5WWhVUGJWQ1JtViIsICJ2ZW51ZSIgOiAiVG93biBIYWxsIn0="
                  assert.equal(tokenURI, expectedTokenURI)
              })

              it("starts with mintFee of 1 ETH", async () => {
                  const mintFee = await dynamicNft.getMintFee()
                  assert.equal(mintFee.toString(), ethers.utils.parseEther("1").toString())
              })
          })

          describe("Mint function runs correctly", () => {
              beforeEach(async function () {
                  const txResponse = await dynamicNft.mintNft({
                      value: ethers.utils.parseEther("1").toString(),
                  })
                  await txResponse.wait(1)
              })

              it("shows the correct owner of the NFT", async function () {
                  const deployerAddress = deployer.address
                  const nftOwner = await dynamicNft.ownerOf("1")

                  assert.equal(deployerAddress, nftOwner)
              })

              it("shows the correct balance of the owner of the NFT", async function () {
                  const deployerBalance = await dynamicNft.balanceOf(deployer.address)
                  assert.equal(deployerBalance.toString(), "1")
              })

              it("Allows users to mint an NFT, and updates appropriately", async function () {
                  const tokenURI = await dynamicNft.tokenURI(1)
                  const tokenCounter = await dynamicNft.getTokenCounter()
                  const dynamicNftTokenURI =
                      "data:application/json;base64,eyJuYW1lIjogIlRpY2tldCIsICJpbWFnZSI6ICJpcGZzOi8vUW1mWFhBU3BuZ2Rla25QdEZCQzY3Zm9HVldKWjFTcVc1YWI5WWhVUGJWQ1JtViIsICJ2ZW51ZSIgOiAiVG93biBIYWxsIn0="

                  assert.equal(tokenCounter.toString(), "1")
                  assert.equal(tokenURI, dynamicNftTokenURI)
              })

              it("Reverts if not enough ETH is sent", async () => {
                  await expect(dynamicNft.mintNft()).to.be.revertedWith("DynamicNFT__NeedMoreEth()")
              })

              it("emits an event when NFT is minted", async () => {
                  await expect(
                      dynamicNft.mintNft({ value: ethers.utils.parseEther("1").toString() })
                  ).to.emit(dynamicNft, "NftMinted")
              })
          })

          describe("testing setMintFee", () => {
              it("Mint Fee can only be changed by owner", async () => {
                  await expect(
                      playerDynamicNft.setMintFee(ethers.utils.parseEther("2").toString())
                  ).be.revertedWith("DynamicNFT__OnlyOwner()")
              })
          })

          describe("testing setImageURL", () => {
              it("imageURL be changed by owner", async () => {
                  await expect(playerDynamicNft.setImageURL(firstImageURL)).be.revertedWith(
                      "DynamicNFT__OnlyOwner()"
                  )
              })

              it("emits an event when imageURL is changed", async () => {
                  await expect(dynamicNft.setImageURL(secondImageURL)).to.emit(
                      dynamicNft,
                      "ImageURLChanged"
                  )
              })

              it("correctly changes tokenURI when called by owner", async () => {
                  const changeImgURLTx = await dynamicNft.setImageURL(secondImageURL)
                  const changeImgURLTxReceipt = changeImgURLTx.wait(1)

                  const newTokenURL = await dynamicNft.tokenURI(1)
                  const expectedTokenURL =
                      "data:application/json;base64,eyJuYW1lIjogIlRpY2tldCIsICJpbWFnZSI6ICJpcGZzOi8vUW1iQ2pWUUN6VjluY1REZmZEWU1RelZEY3haR0dXSkQ3aHRobkxURzRaMWRpaCIsICJ2ZW51ZSIgOiAiVG93biBIYWxsIn0="

                  assert.equal(newTokenURL, expectedTokenURL)
              })
          })

          describe("testing setVenue", () => {
              it("setVenue be changed by owner", async () => {
                  await expect(playerDynamicNft.setVenue("Other Place")).be.revertedWith(
                      "DynamicNFT__OnlyOwner()"
                  )
              })

              it("emits an event when imageURL is changed", async () => {
                  await expect(dynamicNft.setVenue("Other Place")).to.emit(
                      dynamicNft,
                      "VenueChanged"
                  )
              })

              it("correctly changes tokenURI when called by owner", async () => {
                  const changeImgURLTx = await dynamicNft.setVenue("Other Place")
                  const changeImgURLTxReceipt = changeImgURLTx.wait(1)

                  const newTokenURL = await dynamicNft.tokenURI(1)
                  const expectedTokenURL =
                      "data:application/json;base64,eyJuYW1lIjogIlRpY2tldCIsICJpbWFnZSI6ICJpcGZzOi8vUW1mWFhBU3BuZ2Rla25QdEZCQzY3Zm9HVldKWjFTcVc1YWI5WWhVUGJWQ1JtViIsICJ2ZW51ZSIgOiAiT3RoZXIgUGxhY2UifQ=="

                  assert.equal(newTokenURL, expectedTokenURL)
              })
          })
      })
