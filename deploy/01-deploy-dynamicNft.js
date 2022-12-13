const { network } = require("hardhat")
const { FIRST_IMG_URL, developmentChains } = require("../helper-hardhat-config")
const { verify } = require("../utils/verify")

module.exports = async function ({ getNamedAccounts, deployments }) {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()

    log("deploying Dynamic NFT...")

    const args = ["Ticket", "TIK", FIRST_IMG_URL, "Town Hall"]
    // DEPLOYED ON GOERLI TESTNET
    // https://goerli.etherscan.io/address/0x00aa193448D38386af117Eebb7C245e705CC086B#code
    const DynamicNftContract = await deploy("DynamicNft", {
        from: deployer,
        log: true,
        args: args,
        waitConfirmations: network.config.blockConfirmations || 1,
    })

    if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
        await verify(DynamicNftContract.address, args)
    }

    log("-------------------------------")
}

module.exports.tags = ["all"]
