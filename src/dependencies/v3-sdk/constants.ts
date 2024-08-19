export const FACTORY_ADDRESS = '0xBF8db9778461A8a4B3986ccdd8c923C6dee9e6D5'

export const ADDRESS_ZERO = '0x0000000000000000000000000000000000000000'

export const POOL_INIT_CODE_HASH = '0xf3c0ec05bea6e579a4eed3625bf6f7c882f8c49ad8fdf771cef1436bd67e333f'
export const POOL_INIT_CODE_HASH_OPTIMISM = '0x0c231002d0970d2126e7e00ce88c3b0e5ec8e48dac71478d56245c34ea2f9447'

// historical artifact due to small compiler mismatch
export const POOL_INIT_CODE_HASH_OPTIMISM_KOVAN = '0x1fc830513acbdb1608b8c18fd3cf4a4bee3329c69bb41d56400401c40fe02fd0'

/**
 * The default factory enabled fee amounts, denominated in hundredths of bips.
 */
export enum FeeAmount {
  LOW = 500,
  MEDIUM = 3000,
  HIGH = 10000,
}

/**
 * The default factory tick spacings by fee amount.
 */
export const TICK_SPACINGS: { [amount in FeeAmount]: number } = {
  [FeeAmount.LOW]: 10,
  [FeeAmount.MEDIUM]: 60,
  [FeeAmount.HIGH]: 200,
}
