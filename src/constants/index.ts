export const CETHER = require('../contract/abis/CEther.json').abi
export const ERC20_ABI_DEG = require('../contract/abis/CErc20Delegator.json').abi
export const COMP_ABI = require('../contract/abis/comptroller.json').abi
export const BRIDGE_ABI = require('../contract/abis/bridge.json').abi
export const ORACAL_ABI = require('../contract/abis/priceOracle.json').abi
export const JUMPRATEMODELV2_ABI = require('../contract/abis/JumpRateModelV2.json').abi

const REACT_APP_USDT_ADDRESS = process.env.REACT_APP_USDT_ADDRESS ?? ''
const REACT_APP_BTC_ADDRESS = process.env.REACT_APP_BTC_ADDRESS ?? ''
const REACT_APP_ETH_ADDRESS = process.env.REACT_APP_ETH_ADDRESS ?? ''
const REACT_APP_AITD_ADDRESS = process.env.REACT_APP_AITD_ADDRESS ?? ''
const REACT_APP_ABTC_ADDRESS = process.env.REACT_APP_ABTC_ADDRESS ?? ''
const REACT_APP_AETH_ADDRESS = process.env.REACT_APP_AETH_ADDRESS ?? ''
const REACT_APP_WAITD_ADDRESS = process.env.REACT_APP_WAITD_ADDRESS ?? ''
const REACT_APP_AUSDT_ADDRESS = process.env.REACT_APP_AUSDT_ADDRESS ?? ''
const REACT_APP_JUMPRATEMODELV2_ADDRESS = process.env.REACT_APP_JUMPRATEMODELV2_ADDRESS ?? ''
const REACT_APP_SIMPLEPRICEORACLE_ADDRESS = process.env.REACT_APP_SIMPLEPRICEORACLE_ADDRESS ?? ''
const REACT_APP_COMPTROLLER_ADDRESS = process.env.REACT_APP_COMPTROLLER_ADDRESS ?? ''
const REACT_APP_WHITEPAPERINTERSTRATEMODEL_ADDRESS = process.env.REACT_APP_WHITEPAPERINTERSTRATEMODEL_ADDRESS ?? ''
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
  ETH='ETH',
  AITD='AITD',
  AUSDT = 'AUSDT',
  ABTC = 'ABTC',
  AETH = 'AETH',
  AAITD ='aAITD',
  JUMPRATEMODELV2='JumpRateModelV2',
  SIMPLEPRICEORACLE = 'SimplePriceOracle',
  COMPTROLLER = 'Comptroller',
  WHITEPAPERINTERSTRATEMODEL = 'WhitePaperInterestRateModel',
}
export const CONTRACTS = {
  [TokenNames.USDT]: ERC20_ABI_DEG,
  [TokenNames.BTC]: ERC20_ABI_DEG,
  [TokenNames.ETH]: ERC20_ABI_DEG,
  [TokenNames.AITD]: CETHER,
  [TokenNames.AUSDT]: ERC20_ABI_DEG,
  [TokenNames.ABTC]: ERC20_ABI_DEG,
  [TokenNames.AETH]: ERC20_ABI_DEG,
  [TokenNames.AAITD]: CETHER,
  [TokenNames.JUMPRATEMODELV2]: JUMPRATEMODELV2_ABI,
  [TokenNames.SIMPLEPRICEORACLE]: ORACAL_ABI,
  [TokenNames.COMPTROLLER]: COMP_ABI,
  [TokenNames.WHITEPAPERINTERSTRATEMODEL]: ERC20_ABI_DEG,
}

export const COIN_TOKENS: { [chainId in TokenNames]: Token } = {
  [TokenNames.USDT]: new Token(ChainId.AITDTESTNET, REACT_APP_USDT_ADDRESS, 18, TokenNames.USDT, TokenNames.USDT, CONTRACTS[TokenNames.USDT]),
  [TokenNames.BTC]: new Token(ChainId.AITDTESTNET, REACT_APP_BTC_ADDRESS, 8, TokenNames.ABTC, TokenNames.BTC, CONTRACTS[TokenNames.BTC]),
  [TokenNames.AITD]: new Token(ChainId.AITDTESTNET, REACT_APP_AITD_ADDRESS, 18, TokenNames.AITD, TokenNames.AITD, CONTRACTS[TokenNames.AITD]),
  [TokenNames.ETH]: new Token(ChainId.AITDTESTNET, REACT_APP_ETH_ADDRESS, 8, TokenNames.ETH, TokenNames.ETH, CONTRACTS[TokenNames.ETH]),
  
  [TokenNames.ABTC]: new Token(ChainId.AITDTESTNET, REACT_APP_ABTC_ADDRESS, 8, TokenNames.ABTC, TokenNames.ABTC, CONTRACTS[TokenNames.ABTC]),
  [TokenNames.AETH]: new Token(ChainId.AITDTESTNET, REACT_APP_AETH_ADDRESS, 8, TokenNames.AETH, TokenNames.AETH, CONTRACTS[TokenNames.AETH]),
  [TokenNames.AUSDT]: new Token(ChainId.AITDTESTNET, REACT_APP_AUSDT_ADDRESS, 8, TokenNames.AUSDT, TokenNames.AUSDT, CONTRACTS[TokenNames.AUSDT]),
  [TokenNames.AAITD]: new Token(ChainId.AITDTESTNET, REACT_APP_AITD_ADDRESS, 8, TokenNames.AAITD, TokenNames.AAITD, CONTRACTS[TokenNames.AAITD]),
  [TokenNames.JUMPRATEMODELV2]: new Token(ChainId.AITDTESTNET, REACT_APP_JUMPRATEMODELV2_ADDRESS, 8, TokenNames.JUMPRATEMODELV2, TokenNames.JUMPRATEMODELV2, CONTRACTS[TokenNames.JUMPRATEMODELV2]),
  [TokenNames.SIMPLEPRICEORACLE]: new Token(ChainId.AITDTESTNET, REACT_APP_SIMPLEPRICEORACLE_ADDRESS, 18, TokenNames.SIMPLEPRICEORACLE, TokenNames.SIMPLEPRICEORACLE, CONTRACTS[TokenNames.SIMPLEPRICEORACLE]),
  [TokenNames.COMPTROLLER]: new Token(ChainId.AITDTESTNET, REACT_APP_COMPTROLLER_ADDRESS, 18, TokenNames.COMPTROLLER, TokenNames.COMPTROLLER, CONTRACTS[TokenNames.COMPTROLLER]),
  
  [TokenNames.WHITEPAPERINTERSTRATEMODEL]: new Token(ChainId.AITDTESTNET, REACT_APP_WHITEPAPERINTERSTRATEMODEL_ADDRESS, 18, TokenNames.WHITEPAPERINTERSTRATEMODEL, TokenNames.WHITEPAPERINTERSTRATEMODEL, CONTRACTS[TokenNames.WHITEPAPERINTERSTRATEMODEL]),
}


export const Tokens: { [chainId in ChainId]: Token[] } = {
  [ChainId.AITDTESTNET]: [new Token(
    ChainId.AITDTESTNET,
    REACT_APP_WAITD_ADDRESS,
    18,
    'WAITD',
    'Wrapped Ether'
  )],
}