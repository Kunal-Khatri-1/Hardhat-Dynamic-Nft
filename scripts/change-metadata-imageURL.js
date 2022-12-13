const { ethers } = require("hardhat")
const { SECOND_IMG_URL } = require("../helper-hardhat-config")

async function changeMetaDataImg() {
    console.log("-----------------------------")
    console.log("Changing imageURL => changing meta-data")
    const DynamicNft = await ethers.getContract("DynamicNft")

    const tokenURI = await DynamicNft.tokenURI(1)

    const changeImgURLTx = await DynamicNft.setImageURL(SECOND_IMG_URL)
    const changeImgURLTxReceipt = changeImgURLTx.wait(1)

    const newTokenURI = await DynamicNft.tokenURI(1)

    console.log(`Changed token URI from: \n ${tokenURI} \n  to \n ${newTokenURI}`)
}

changeMetaDataImg()
    .then(() => process.exit(0))
    .catch((error) => {
        console.log(error)
        process.exit(1)
    })
