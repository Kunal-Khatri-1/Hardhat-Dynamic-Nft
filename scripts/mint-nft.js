const { ethers } = require("hardhat")
const { FIRST_IMG_URL } = require("../helper-hardhat-config")

async function mint() {
    console.log("-----------------------------")
    console.log("Mining an NFT...")
    const DynamicNft = await ethers.getContract("DynamicNft")

    const mintFee = await DynamicNft.getMintFee()
    const mintTx = await DynamicNft.mintNft({
        value: mintFee.toString(),
    })

    const tokenURI = await DynamicNft.tokenURI(1)

    console.log(`Successfully mined NFT!, tokenURL: \n ${tokenURI}`)
}

mint()
    .then(() => process.exit(0))
    .catch((error) => {
        console.log(error)
        process.exit(1)
    })
