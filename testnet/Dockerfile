FROM python:3.12-slim-bookworm
WORKDIR /usr/src/app
COPY . ./
RUN apt-get update && \
  apt-get install -y git nodejs npm && \
  apt-get clean
RUN npm install --ignore-scripts . && \
   npm install --ignore-scripts @nomicfoundation/hardhat-verify && \
   cp hardhat.local.env ./.env && \
   npx hardhat test && \
   pip install modules/feed-updater
CMD ./scripts/initialize-testnet.sh com_truflation_btc_ev com_truflation_btc_ev_fiat

