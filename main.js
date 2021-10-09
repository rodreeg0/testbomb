class NFTToken {
    constructor(coinToken, address, abi, designAbi, userAccount) {
        this._coinToken = coinToken;
        this._address = address;
        this._contract = createContract(abi, address);
        this._designAbi = designAbi;
        this._userAccount = '0xbB42873d0aC2D8E816E52190D0d91C5bBef3B802';
        this._designAddress = this._contract.methods
            .design()
            .call();
    }

    getContract() {
        return this._contract;
    }

    async getDesignContract() {
        const address = await this._designAddress;
        this._designContract = this._designContract || createContract(this._designAbi, address);
        return this._designContract;
    }

    async checkAllowance(amount) {
        const allowance = await this._coinToken.getAllowance(this._address);
        const amountBN = web3js.utils.toBN(amount);
        const allowanceBN = web3js.utils.toBN(allowance);
        if (amountBN.lte(allowanceBN)) {
            return;
        }
        const multiplier = web3js.utils.toBN(10);
        await this._coinToken.increaseAllowance(this._address, amountBN.mul(multiplier));
    }
}