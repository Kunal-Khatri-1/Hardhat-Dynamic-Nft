const { ethers } = require("hardhat")

async function changeMetadataVenue() {
    console.log("-----------------------------")
    console.log("Changing venue => changing meta-data")
    const DynamicNft = await ethers.getContract("DynamicNft")

    const tokenURI = await DynamicNft.tokenURI(1)

    const changeImgURLTx = await DynamicNft.setVenue("Other Place")
    const changeImgURLTxReceipt = changeImgURLTx.wait(1)

    const newTokenURI = await DynamicNft.tokenURI(1)

    console.log(`Changed token URI from: \n ${tokenURI} \n to \n ${newTokenURI}`)
}

changeMetadataVenue()
    .then(() => process.exit(0))
    .catch((error) => {
        console.log(error)
        process.exit(1)
    })
