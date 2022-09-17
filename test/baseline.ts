const { expect } = require("chai");
const tokenAddress = '0x3417dd955d4408638870723b9ad8aae81953b478'
describe("Token contract", function () {
  it("Deploy", async function () {
    const [owner] = await ethers.getSigners();
    const Operator = await ethers.getContractFactory("Operator");
    const operator = await Operator.deploy(
      tokenAddress,
      owner.address
    )
    await operator.deployed()

    const ApiClient = await ethers.getContractFactory("ApiClient");
    const apiClient =
      await ApiClient.deploy(
	operator.address,
	"cef7d7ad405e45eb91e2da0f415c920e",
	'100000000000000000',
	tokenAddress
      );
    await apiClient.deployed();
  });
});
