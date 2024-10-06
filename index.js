const SHA256 = require("crypto-js/sha256");

class CryptoBlock {
  constructor(index, timestamp, data, precedingHash = "") {
    this.index = index;
    this.timestamp = timestamp;
    this.data = data;
    this.precedingHash = precedingHash;
    this.hash = this.computeHash();
    this.nonce = 0;
  }

  proofOfWork(difficulty) {
    while (
      this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")
    ) {
      this.nonce++;
      this.hash - this.computeHash();
    }
  }

  computeHash() {
    return SHA256(
      this.index +
        this.precedingHash +
        this.timestamp +
        JSON.stringify(this.data) +
        this.nonce,
    ).toString();
  }
}

class CryptoBlockChain {
  constructor() {
    this.blockChain = [this.startGenesisBlock()];
    this.difficulty = 0;
  }

  checkChainValidity() {
    for (let i = 1; i < this.blockChain.length; i++) {
      const currentBlock = this.blockChain[i];
      const precedingBlock = this.blockChain[i - 1];
      if (currentBlock.hash !== currentBlock.computeHash()) {
        return false;
      }
      if (currentBlock.precedingHash !== precedingBlock.hash) {
        return false;
      }
      return true;
    }
  }

  startGenesisBlock() {
    return new CryptoBlock(0, "01/01/01", "Initial Block in the chain", "0");
  }

  obtainLatestBlock() {
    return this.blockChain[this.blockChain.length - 1];
  }

  addNewBlock(newBlock) {
    newBlock.precedingHash = this.obtainLatestBlock().hash;
    // newBlock.hash = newBlock.computeHash();
    newBlock.proofOfWork(this.difficulty);
    this.blockChain.push(newBlock);
  }
}

let batCoin = new CryptoBlockChain();

batCoin.addNewBlock(
  new CryptoBlock(1, "01/06/2020", {
    sender: "Iris Ljesnjanin",
    recipient: "Cosima Mielke",
    quantity: 50,
  }),
);
batCoin.addNewBlock(
  new CryptoBlock(2, "01/07/2020", {
    sender: "Vitaly Friedman",
    recipient: "Ricardo Gimenes",
    quantity: 100,
  }),
);
batCoin.addNewBlock(
  new CryptoBlock(3, "01/08/2020", {
    sender: "Roger Spike",
    recipient: "Micheal Jonas",
    quantity: 75,
  }),
);

console.log(JSON.stringify(batCoin, null, 4));
