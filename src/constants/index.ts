export const CETHER = require('../contract/abis/CEther.json').abi
export const ERC20_ABI_DEG = require('../contract/abis/CErc20Delegator.json').abi
export const COMP_ABI = require('../contract/abis/comptroller.json').abi
export const BRIDGE_ABI = require('../contract/abis/bridge.json').abi
export const ORACAL_ABI = require('../contract/abis/priceOracle.json').abi
export const JUMPRATEMODELV2_ABI = require('../contract/abis/JumpRateModelV2.json').abi
export enum ChainId {
  AITDTESTNET = 239,
}

export const ChainIds = {
  eth: {
    chainId: 1337
  },
  aitd: {
    chainId: 239
  }
}
export class Token {
  readonly chainId: ChainId;
  readonly address: string;
  readonly name?: string;
  readonly decimals: number;
  readonly symbol?: string;
  readonly icon?: string;
  readonly contract?: string;
  public constructor(chainId: ChainId, address: string, decimals: number, symbol?: string, name?: string,contract?: string, icon?: string) {
    this.chainId = chainId;
    this.address = address;
    this.name = name;
    this.decimals = decimals;
    this.symbol = symbol;
    this.contract = contract;
    this.icon = icon;
  }
}
export enum TokenNames {
  USDT='USDT',
  BTC='BTC',
  AITD='AITD',
  AUSDT = 'AUSDT',
  ABTC = 'ABTC',
  AAITD ='aAITD',
  JUMPRATEMODELV2='JumpRateModelV2',
  SIMPLEPRICEORACLE = 'SimplePriceOracle',
  COMPTROLLER = 'Comptroller',
  WHITEPAPERINTERSTRATEMODEL = 'WhitePaperInterestRateModel',
}
export const CONTRACTS = {
  [TokenNames.USDT]: ERC20_ABI_DEG,
  [TokenNames.BTC]: ERC20_ABI_DEG,
  [TokenNames.AITD]: CETHER,
  [TokenNames.AUSDT]: ERC20_ABI_DEG,
  [TokenNames.ABTC]: ERC20_ABI_DEG,
  [TokenNames.AAITD]: CETHER,
  [TokenNames.JUMPRATEMODELV2]: JUMPRATEMODELV2_ABI,
  [TokenNames.SIMPLEPRICEORACLE]: ORACAL_ABI,
  [TokenNames.COMPTROLLER]: COMP_ABI,
  [TokenNames.WHITEPAPERINTERSTRATEMODEL]: ERC20_ABI_DEG,
}

export const COIN_TOKENS: { [chainId in TokenNames]: Token } = {
  [TokenNames.USDT]: new Token(ChainId.AITDTESTNET,'0x4B6b9F3695205C8468ddf9AB4025ec2A09bDfF1a', 18, TokenNames.USDT, TokenNames.USDT, CONTRACTS[TokenNames.USDT]),
  [TokenNames.BTC]: new Token(ChainId.AITDTESTNET,'0x4C32B8f1cB4310bF5f3b82A8F41d194A6fe98C69', 8, TokenNames.ABTC, TokenNames.BTC, CONTRACTS[TokenNames.BTC]),
  [TokenNames.AITD]: new Token(ChainId.AITDTESTNET, '0xA24AE5646A5D504D1E54c2D3eE909E83090F544F', 18, TokenNames.AITD, TokenNames.AITD, CONTRACTS[TokenNames.AITD]),
  
  [TokenNames.ABTC]: new Token(ChainId.AITDTESTNET, '0x183a6932540945eF6e6Eb364ECD966Cf3e96De3C', 8, TokenNames.ABTC, TokenNames.ABTC, CONTRACTS[TokenNames.ABTC]),
  [TokenNames.AUSDT]: new Token(ChainId.AITDTESTNET, '0xfE873982125e86e11f6459c34B12d82911CB6FEA', 8, TokenNames.AUSDT, TokenNames.AUSDT, CONTRACTS[TokenNames.AUSDT]),
  [TokenNames.AAITD]: new Token(ChainId.AITDTESTNET, '0xA24AE5646A5D504D1E54c2D3eE909E83090F544F', 8, TokenNames.AAITD, TokenNames.AAITD, CONTRACTS[TokenNames.AAITD]),
  [TokenNames.JUMPRATEMODELV2]: new Token(ChainId.AITDTESTNET, '0xB75D276EcBb9A1Cb2026312265bA52013f3C0652', 8, TokenNames.JUMPRATEMODELV2, TokenNames.JUMPRATEMODELV2, CONTRACTS[TokenNames.JUMPRATEMODELV2]),
  [TokenNames.SIMPLEPRICEORACLE]: new Token(ChainId.AITDTESTNET, '0x54eaF2e93cFc82da38Ff97028EC515ceE1e66127', 18, TokenNames.SIMPLEPRICEORACLE, TokenNames.SIMPLEPRICEORACLE, CONTRACTS[TokenNames.SIMPLEPRICEORACLE]),
  [TokenNames.COMPTROLLER]: new Token(ChainId.AITDTESTNET, '0xB271eF6Fc0D899d1b1747ec4EB3e72c381f841de', 18, TokenNames.COMPTROLLER, TokenNames.COMPTROLLER, CONTRACTS[TokenNames.COMPTROLLER]),
  
  [TokenNames.WHITEPAPERINTERSTRATEMODEL]: new Token(ChainId.AITDTESTNET, '0x4DB3a10Eea21C4D2923dAE1255F5E5B6a1D7b3eA', 18, TokenNames.WHITEPAPERINTERSTRATEMODEL, TokenNames.WHITEPAPERINTERSTRATEMODEL, CONTRACTS[TokenNames.WHITEPAPERINTERSTRATEMODEL]),
}


export const Tokens: { [chainId in ChainId]: Token[] } = {
  [ChainId.AITDTESTNET]: [new Token(
    ChainId.AITDTESTNET,
    '0x5900343DD73367fEBC0dB13C6108D54f3d85832d',
    18,
    'WAITD',
    'Wrapped Ether'
  )],
}