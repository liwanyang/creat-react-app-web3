import BN from 'bn.js'
import BigNumber from 'bignumber.js'

const mulDecimals = (
  amount,
  decimals,
) => {
  if (!Number(decimals)) {
    return new BN(amount);
  }

  const decimalsMul = `10${new Array(Number(decimals)).join('0')}`;
  const amountStr = new BigNumber(amount).multipliedBy(decimalsMul);

  return new BN(amountStr.toFixed());
};