TFI_TO_USDT = 0.6
LINK_TO_USDT = 7.7
WEI = 1000000000000000000

def get_fee(r):
    fee = 2
    if r['service'].startswith('truflation/') or \
       r['service'].startswith('nft/'):
        fee = 5
    return int(fee * WEI * TFI_TO_USDT / LINK_TO_USDT)


