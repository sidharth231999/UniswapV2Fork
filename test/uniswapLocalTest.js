const { expect } = require("chai");
const { ethers, waffle} = require("hardhat");
const { ContractFunctionVisibility } = require("hardhat/internal/hardhat-network/stack-traces/model");

describe("Token contract", function () {
    let signer;
    let uniswapV2Router;
    let uniswapV2Factory;
    let uniswapV2Pair;
    let tokenA;
    let tokenB;
    let taxableToken;
    let getInit;
    let initHash;
    let weth;
    let lpToken;
    let lpTokenAddress = '0xad8fe86ccb125417dce8a29cef7491ac7bb7e0d3';
    let lpTokenContract;
    let lpTokenAbi = [{"inputs":[{"internalType":"address","name":"account","type":"address"},{"internalType":"address","name":"minter_","type":"address"},{"internalType":"uint256","name":"mintingAllowedAfter_","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"delegator","type":"address"},{"indexed":true,"internalType":"address","name":"fromDelegate","type":"address"},{"indexed":true,"internalType":"address","name":"toDelegate","type":"address"}],"name":"DelegateChanged","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"delegate","type":"address"},{"indexed":false,"internalType":"uint256","name":"previousBalance","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"newBalance","type":"uint256"}],"name":"DelegateVotesChanged","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"minter","type":"address"},{"indexed":false,"internalType":"address","name":"newMinter","type":"address"}],"name":"MinterChanged","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"Transfer","type":"event"},{"constant":true,"inputs":[],"name":"DELEGATION_TYPEHASH","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"DOMAIN_TYPEHASH","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"PERMIT_TYPEHASH","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"account","type":"address"},{"internalType":"address","name":"spender","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"rawAmount","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"uint32","name":"","type":"uint32"}],"name":"checkpoints","outputs":[{"internalType":"uint32","name":"fromBlock","type":"uint32"},{"internalType":"uint96","name":"votes","type":"uint96"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"delegatee","type":"address"}],"name":"delegate","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"delegatee","type":"address"},{"internalType":"uint256","name":"nonce","type":"uint256"},{"internalType":"uint256","name":"expiry","type":"uint256"},{"internalType":"uint8","name":"v","type":"uint8"},{"internalType":"bytes32","name":"r","type":"bytes32"},{"internalType":"bytes32","name":"s","type":"bytes32"}],"name":"delegateBySig","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"delegates","outputs":[{"internalType":"address","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"getCurrentVotes","outputs":[{"internalType":"uint96","name":"","type":"uint96"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"account","type":"address"},{"internalType":"uint256","name":"blockNumber","type":"uint256"}],"name":"getPriorVotes","outputs":[{"internalType":"uint96","name":"","type":"uint96"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"minimumTimeBetweenMints","outputs":[{"internalType":"uint32","name":"","type":"uint32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"dst","type":"address"},{"internalType":"uint256","name":"rawAmount","type":"uint256"}],"name":"mint","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"mintCap","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"minter","outputs":[{"internalType":"address","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"mintingAllowedAfter","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"nonces","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"numCheckpoints","outputs":[{"internalType":"uint32","name":"","type":"uint32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"rawAmount","type":"uint256"},{"internalType":"uint256","name":"deadline","type":"uint256"},{"internalType":"uint8","name":"v","type":"uint8"},{"internalType":"bytes32","name":"r","type":"bytes32"},{"internalType":"bytes32","name":"s","type":"bytes32"}],"name":"permit","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"minter_","type":"address"}],"name":"setMinter","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"dst","type":"address"},{"internalType":"uint256","name":"rawAmount","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"src","type":"address"},{"internalType":"address","name":"dst","type":"address"},{"internalType":"uint256","name":"rawAmount","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"}]
    let provider = waffle.provider;


    const TOKEN_A_AMOUNT = ethers.utils.parseEther("1000");
    const AMOUNT_IN_MAX = ethers.utils.parseEther("1000000");
    const amountIn = ethers.utils.parseEther("100");
    const amountOut = ethers.utils.parseEther("1");
    const amountInq = ethers.utils.parseEther("100");
    const TOKEN_B_AMOUNT = ethers.utils.parseEther("1000");
    const ETH_AMOUNT = ethers.utils.parseEther("10");
    
describe("UniswapV2",async()=>{
        beforeEach(async()=>{
        signer = await ethers.getSigners();

        lpTokenContract = new ethers.Contract(lpTokenAddress, lpTokenAbi,signer[0]);

        const GetInit = await ethers.getContractFactory("CalHash");
        getInit = await GetInit.deploy();

        initHash = await getInit.connect(signer[0]).getInitHash();

        const LpToken = await ethers.getContractFactory("UniswapV2ERC20");
        lpToken = await LpToken.deploy();

        const WETH = await ethers.getContractFactory("WETH9");
        weth = await WETH.deploy();
  
        const UniswapV2Factory = await ethers.getContractFactory("UniswapV2Factory");
        uniswapV2Factory = await UniswapV2Factory.connect(signer[0]).deploy(signer[0].address);

        const UniswapV2Pair = await ethers.getContractFactory("UniswapV2Pair");
        uniswapV2Pair = await UniswapV2Pair.connect(signer[0]).deploy();
  
        const UniswapV2Router = await ethers.getContractFactory("UniswapV2Router02");
        uniswapV2Router = await UniswapV2Router.connect(signer[0]).deploy(uniswapV2Factory.address,weth.address, signer[4].address);
  
        const TokenA = await ethers.getContractFactory("TokenA");
        tokenA = await TokenA.connect(signer[0]).deploy();
  
        const TokenB = await ethers.getContractFactory("TokenB");
        tokenB = await TokenB.connect(signer[0]).deploy();

        const TaxableToken = await ethers.getContractFactory("taxableToken");
        taxableToken = await TaxableToken.connect(signer[0]).deploy();
        
        });

        describe("UniswapV2",async()=>{
            it("addliquidity function", async function () {
                // console.log("initHash: ",initHash);
                await tokenA.connect(signer[0]).approve(uniswapV2Router.address,TOKEN_A_AMOUNT);
                await tokenB.connect(signer[0]).approve(uniswapV2Router.address,TOKEN_B_AMOUNT);
                await uniswapV2Router.connect(signer[0]).addLiquidity(tokenA.address,tokenB.address,TOKEN_A_AMOUNT,TOKEN_B_AMOUNT,1,1,signer[0].address, 1764541741);
    
            });
            it("addliquidityETH function", async function () {
                await tokenA.connect(signer[0]).approve(uniswapV2Router.address,TOKEN_A_AMOUNT);
                await uniswapV2Router.connect(signer[0]).addLiquidityETH(tokenA.address,TOKEN_A_AMOUNT,1,ETH_AMOUNT,signer[0].address,1764541741,{value:ETH_AMOUNT});
            });
    
    
            it("swapExactTokensForTokens function", async function () {
                
                await tokenA.connect(signer[0]).approve(uniswapV2Router.address,TOKEN_A_AMOUNT);
                await tokenB.connect(signer[0]).approve(uniswapV2Router.address,TOKEN_B_AMOUNT);
                await uniswapV2Router.connect(signer[0]).addLiquidity(tokenA.address,tokenB.address,TOKEN_A_AMOUNT,TOKEN_B_AMOUNT,1,1,signer[0].address, 1764541741);
    
                await tokenA.connect(signer[0]).approve(uniswapV2Router.address,amountInq);
                let iniBalT1 = (parseInt(await tokenA.balanceOf(signer[0].address))/1e18);
                let iniBalT2 = (parseInt(await tokenB.balanceOf(signer[0].address))/1e18);
                await uniswapV2Router.connect(signer[0]).swapExactTokensForTokens(amountIn,1,[tokenA.address,tokenB.address],signer[0].address, 1764541741);
                let fnlBalT1 = (parseInt(await tokenA.balanceOf(signer[0].address))/1e18);
                let fnlBalT2 = (parseInt(await tokenB.balanceOf(signer[0].address))/1e18);
                let fnlBalT3 = (parseInt(await tokenA.balanceOf(signer[4].address))/1e18);
                expect(iniBalT1).to.be.greaterThan(fnlBalT1);
                expect(fnlBalT2).to.be.greaterThan(iniBalT2);
                expect(fnlBalT3).to.equal(0.3);
                // console.log(iniBalT1,iniBalT2,fnlBalT1,fnlBalT2,fnlBalT3);
                
            });
    
            it("swapTokensForExactTokens function", async function () {
                await tokenA.connect(signer[0]).approve(uniswapV2Router.address,TOKEN_A_AMOUNT);
                await tokenB.connect(signer[0]).approve(uniswapV2Router.address,TOKEN_B_AMOUNT);
                await uniswapV2Router.connect(signer[0]).addLiquidity(tokenA.address,tokenB.address,TOKEN_A_AMOUNT,TOKEN_B_AMOUNT,1,1,signer[0].address, 1764541741);
    
                let iniBalT1 = (parseInt(await tokenA.balanceOf(signer[0].address))/1e18);
                let iniBalT2 = (parseInt(await tokenB.balanceOf(signer[0].address))/1e18);
                await tokenA.connect(signer[0]).approve(uniswapV2Router.address,amountInq);
                await uniswapV2Router.connect(signer[0]).swapTokensForExactTokens(amountIn,TOKEN_A_AMOUNT,[tokenA.address,tokenB.address],signer[0].address, 1764541741);
                let fnlBalT1 = (parseInt(await tokenA.balanceOf(signer[0].address))/1e18);
                let fnlBalT2 = (parseInt(await tokenB.balanceOf(signer[0].address))/1e18);
                let fnlBalT3 = (parseInt(await tokenA.balanceOf(signer[4].address))/1e18);
    
                expect(iniBalT1).to.be.greaterThan(fnlBalT1);
                expect(fnlBalT2).to.be.greaterThan(iniBalT2);
                expect(fnlBalT3).to.equal(0.03039421294185587);
            });
    
            it("swapExactETHForTokens function", async function () {
                
                await tokenA.connect(signer[0]).approve(uniswapV2Router.address,TOKEN_A_AMOUNT);
                
                await uniswapV2Router.connect(signer[0]).addLiquidityETH(tokenA.address,TOKEN_A_AMOUNT,1,ETH_AMOUNT,signer[0].address,1764541741,{value:ETH_AMOUNT});
                let iniBalEther = (parseInt(await provider.getBalance(signer[0].address))/1e18);
                let iniBalToken = (parseInt(await tokenA.balanceOf(signer[0].address))/1e18);
                await uniswapV2Router.connect(signer[0]).swapExactETHForTokens(1,[weth.address,tokenA.address],signer[0].address, 1764541741,{value:amountIn});
    
                let fnlBalEther = (parseInt(await provider.getBalance(signer[0].address))/1e18);
                let fnlBalToken = (parseInt(await tokenA.balanceOf(signer[0].address))/1e18);
                let fnlBalT3 = (parseInt(await provider.getBalance(signer[4].address))/1e18);
    
                expect(iniBalEther).to.be.greaterThan(fnlBalEther);
                expect(iniBalToken).to.be.lessThan(fnlBalToken);
                expect(fnlBalT3).to.equal(10000.03);
                // console.log(fnlBalT3);
                // console.log(`T2${iniBalT2,fnlBalT2}`);
            });
            it("swapTokensForExactETH function", async function () {
                await tokenA.connect(signer[0]).approve(uniswapV2Router.address,TOKEN_A_AMOUNT);
                await uniswapV2Router.connect(signer[0]).addLiquidityETH(tokenA.address,TOKEN_A_AMOUNT,1,ETH_AMOUNT,signer[0].address,1764541741,{value:ETH_AMOUNT});
    
                let iniBalEther = (parseInt(await provider.getBalance(signer[0].address))/1e18);
                let iniBalToken = (parseInt(await tokenA.balanceOf(signer[0].address))/1e18);
                await tokenA.connect(signer[0]).approve(uniswapV2Router.address,TOKEN_A_AMOUNT);
                await uniswapV2Router.connect(signer[0]).swapTokensForExactETH(amountOut,TOKEN_A_AMOUNT,[tokenA.address,weth.address],signer[0].address,1764541741);
                let fnlBalEther = (parseInt(await provider.getBalance(signer[0].address))/1e18);
                let fnlBalToken = (parseInt(await tokenA.balanceOf(signer[0].address))/1e18);
                let fnlBalT3 = (parseInt(await tokenA.balanceOf(signer[4].address))/1e18);
    
                expect(iniBalToken).to.be.greaterThan(fnlBalToken);
                expect(iniBalEther).to.be.lessThan(fnlBalEther);
                expect(fnlBalT3).to.equal(0.3343363423604146);
        
            });
    
            it("swapExactTokensForETH function", async function () {
                await tokenA.connect(signer[0]).approve(uniswapV2Router.address,TOKEN_A_AMOUNT);
                await uniswapV2Router.connect(signer[0]).addLiquidityETH(tokenA.address,TOKEN_A_AMOUNT,1,ETH_AMOUNT,signer[0].address,1764541741,{value:ETH_AMOUNT});
    
                let iniBalEther = (parseInt(await provider.getBalance(signer[0].address))/1e18);
                let iniBalToken = (parseInt(await tokenA.balanceOf(signer[0].address))/1e18);
                await tokenA.connect(signer[0]).approve(uniswapV2Router.address,amountInq);
                await uniswapV2Router.connect(signer[0]).swapExactTokensForETH(amountIn,1,[tokenA.address,weth.address],signer[0].address,1764541741);
    
                let fnlBalEther = (parseInt(await provider.getBalance(signer[0].address))/1e18);
                let fnlBalToken = (parseInt(await tokenA.balanceOf(signer[0].address))/1e18);
                let fnlBalT3 = (parseInt(await tokenA.balanceOf(signer[4].address))/1e18);
    
                expect(iniBalToken).to.be.greaterThan(fnlBalToken);
                expect(iniBalEther).to.be.lessThan(fnlBalEther);
                expect(fnlBalT3).to.equal(0.03);
            });
    
            it("swapETHForExactTokens function", async function () {
                await tokenA.connect(signer[0]).approve(uniswapV2Router.address,TOKEN_A_AMOUNT);
                await uniswapV2Router.connect(signer[0]).addLiquidityETH(tokenA.address,TOKEN_A_AMOUNT,1,ETH_AMOUNT,signer[0].address,1764541741,{value:ETH_AMOUNT});
    
                let iniBalEther = (parseInt(await provider.getBalance(signer[0].address))/1e18);
                let iniBalToken = (parseInt(await tokenA.balanceOf(signer[0].address))/1e18);
                // await tokenA.connect(signer[0]).approve(uniswapV2Router.address,amountInq);
                await uniswapV2Router.connect(signer[0]).swapETHForExactTokens(amountOut,[weth.address,tokenA.address],signer[0].address, 1764541741,{value:amountIn});
    
                let fnlBalEther = (parseInt(await provider.getBalance(signer[0].address))/1e18);
                let fnlBalToken = (parseInt(await tokenA.balanceOf(signer[0].address))/1e18);
                let fnlBalT3 = (parseInt(await provider.getBalance(signer[4].address))/1e18);
    
                expect(iniBalToken).to.be.lessThan(fnlBalToken);
                expect(iniBalEther).to.be.greaterThan(fnlBalEther);
                expect(fnlBalT3).to.equal(10000.00003012039);
    
            });
    
            it("swapExactTokensForTokensSupportingFeeOnTransferTokens", async function () {
                
    
                await tokenA.connect(signer[0]).approve(uniswapV2Router.address,TOKEN_A_AMOUNT);
                await taxableToken.connect(signer[0]).approve(uniswapV2Router.address,TOKEN_B_AMOUNT);
                await uniswapV2Router.connect(signer[0]).addLiquidity(tokenA.address,taxableToken.address,TOKEN_A_AMOUNT,TOKEN_B_AMOUNT,1,1,signer[6].address, 1764541741);
                
                let iniBalT1 = (parseInt(await tokenA.balanceOf(signer[0].address))/1e18);
                let iniBalT2 = (parseInt(await taxableToken.balanceOf(signer[0].address))/1e18);
                
                await tokenA.connect(signer[0]).approve(uniswapV2Router.address,TOKEN_B_AMOUNT);
                await uniswapV2Router.connect(signer[0]).swapExactTokensForTokensSupportingFeeOnTransferTokens(amountIn,1,[tokenA.address,taxableToken.address],signer[0].address, 1764541741);
                
                let fnlBalT1 = (parseInt(await tokenA.balanceOf(signer[0].address))/1e18);
                let fnlBalT2 = (parseInt(await taxableToken.balanceOf(signer[0].address))/1e18);
                let fnlBalT3 = (parseInt(await tokenA.balanceOf(signer[4].address))/1e18);
                // console.log(fnlBalT3);
                expect(iniBalT1).to.be.greaterThan(fnlBalT1);
                expect(fnlBalT2).to.be.greaterThan(iniBalT2);
                expect(fnlBalT3).to.equal(0.3);
    
            });
    
            it.only("swapExactETHForTokensSupportingFeeOnTransferTokens", async function () {
    
    
                await taxableToken.connect(signer[0]).approve(uniswapV2Router.address,TOKEN_A_AMOUNT);
                
                await uniswapV2Router.connect(signer[0]).addLiquidityETH(taxableToken.address,TOKEN_A_AMOUNT,1,ETH_AMOUNT,signer[0].address,1764541741,{value:ETH_AMOUNT});
                
                let iniBalEther = (parseInt(await provider.getBalance(signer[0].address))/1e18);
                let iniBalToken = (parseInt(await taxableToken.balanceOf(signer[0].address))/1e18);
                // console.log(`reserve${await uniswapV2Pair.getReserves()}`);
                // await taxableToken.connect(signer[0]).approve(uniswapV2Router.address,TOKEN_A_AMOUNT);
                // await uniswapV2Router.connect(signer[0]).addLiquidityETH(taxableToken.address,TOKEN_A_AMOUNT,1,ETH_AMOUNT,signer[0].address,1764541741,{value:ETH_AMOUNT});
                // console.log(`reserve${await uniswapV2Pair.getReserves()}`);
                await uniswapV2Router.connect(signer[0]).swapExactETHForTokensSupportingFeeOnTransferTokens(1,[weth.address,taxableToken.address],signer[0].address, 1764541741,{value:amountIn}); 
                
                let fnlBalEther = (parseInt(await provider.getBalance(signer[0].address))/1e18);
                let fnlBalToken = (parseInt(await taxableToken.balanceOf(signer[0].address))/1e18);
                let fnlBalT3 = (parseInt(await provider.getBalance(signer[4].address))/1e18);
                // console.log(iniBalT1,fnlBalT1);
                // console.log(`--${iniBalT2,fnlBalT2}`);
                // await expect(fnlBalT2).to.be.greaterThan(iniBalT2);
                // await expect(iniBalT1).to.be.greaterThan(fnlBalT1);
                expect(iniBalToken).to.be.lessThan(fnlBalToken);
                expect(iniBalEther).to.be.greaterThan(fnlBalEther);
                expect(fnlBalT3).to.equal(10000.3);
                console.log((parseInt(await provider.getBalance(signer[7].address)))/1e18);

                console.log(iniBalToken,fnlBalToken,iniBalEther,fnlBalEther,fnlBalT3);
            });
    
            it("swapExactTokensForETHSupportingFeeOnTransferTokens", async function () {
                await taxableToken.connect(signer[0]).approve(uniswapV2Router.address,TOKEN_B_AMOUNT);
                await uniswapV2Router.connect(signer[0]).addLiquidityETH(taxableToken.address,TOKEN_A_AMOUNT,1,ETH_AMOUNT,signer[0].address,1764541741,{value:ETH_AMOUNT});
    
                let iniBalEther = (parseInt(await provider.getBalance(signer[0].address))/1e18);
                let iniBalToken = (parseInt(await taxableToken.balanceOf(signer[0].address))/1e18);
                await taxableToken.connect(signer[0]).approve(uniswapV2Router.address,amountInq);
                await uniswapV2Router.connect(signer[0]).swapExactTokensForETHSupportingFeeOnTransferTokens(amountIn,1,[taxableToken.address,weth.address],signer[0].address,1764541741);
    
                let fnlBalEther = (parseInt(await provider.getBalance(signer[0].address))/1e18);
                let fnlBalToken = (parseInt(await taxableToken.balanceOf(signer[0].address))/1e18);
                let fnlBalT3 = (parseInt(await taxableToken.balanceOf(signer[4].address))/1e18);
    
                expect(iniBalToken).to.be.greaterThan(fnlBalToken);
                expect(iniBalEther).to.be.lessThan(fnlBalEther);
                expect(fnlBalT3).to.equal(0.27);
                // console.log(`${}`)
            });
        });
    });
      

        })
        