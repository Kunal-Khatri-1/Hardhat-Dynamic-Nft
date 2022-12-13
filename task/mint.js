task("mint", "Command to mint NFT").setAction(async (taskArgs, hre) => {
    const ethers = hre.ethers

    console.log("-----------------------------")
    console.log("Minting an NFT")
    const DynamicNft = await ethers.getContract("DynamicNft")

    const mintFee = await DynamicNft.getMintFee()
    const mintTx = await DynamicNft.mintNft({
        value: mintFee.toString(),
    })
    mintTx.wait(1)
    console.log("NFT Minted!")
})
