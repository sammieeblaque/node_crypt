const {
  GelatoLimitOrders,
  GelatoStopLimitOrders,
} = require("@gelatonetwork/limit-orders-lib");
const ethers = require("ethers");
const web3 = require("web3");

let Web3 = new web3("ws://localhost:8546");

const provider = new ethers.providers.Web3Provider(Web3.currentProvider);

const chainId = 1;
const signerOrProvider = provider.getSigner();
const handler = "uniswap";

const gelatoLimitOrders = new GelatoLimitOrders(
  chainId,
  signerOrProvider, // optional
  handler // optional
);

const gelatoStopLimitOrders = new GelatoStopLimitOrders(
  chainId,
  signerOrProvider, // optional
  handler // required
);

const submitLimitOrders = async (
  inputToken,
  outputToken,
  inputAmount,
  minReturn
) => {
  let response = null;
  try {
    const approve = await gelatoLimitOrders.approveTokenAmount(
      inputToken,
      inputAmount
    );
    if (approve.accessList !== null) {
      const tx = await gelatoLimitOrders.submitLimitOrder(
        inputToken,
        outputToken,
        inputAmount,
        minReturn
      );
      response = tx;
    }
    return response;
  } catch (error) {
    console.error(error);
  }
};

const inputToken = "0x6b175474e89094c44da98b954eedeac495271d0f"; // DAI

// Token to buy
const outputToken = "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE"; // ETH

// Amount to sell
const inputAmount = ethers.utils.parseUnits("2000", "18");

// Minimum amount of outToken which the users wants to receive back
const minReturn = ethers.utils.parseEther("1");

// Address of user who places the order (must be same as signer address)
// const userAddress = "0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B";

submitLimitOrders(inputToken, outputToken, inputAmount, minReturn);
