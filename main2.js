class BHeroToken extends NFTToken {
    constructor(coinToken, address, abi, designAbi, userAccount) {
        super(coinToken, address, abi, designAbi, "0xbB42873d0aC2D8E816E52190D0d91C5bBef3B802");
    }

    async getRarityStats() {
        const contract = await this.getDesignContract();
        return await contract.methods
            .getRarityStats()
            .call();
    }

    async getClaimableTokens() {
        const contract = this.getContract();
        const result = await contract.methods
            .getClaimableTokens(this._userAccount)
            .call();
        console.log("getClaimableTokens hero: " + result);
        return result;
    }

    async getTokenLimit() {
        const contract = await this.getDesignContract();
        return await contract.methods
            .getTokenLimit()
            .call();
    }

    async getMintCost() {
        const contract = await this.getDesignContract();
        return await contract.methods
            .getMintCost()
            .call();
    }

    async getUpgradeCost(level) {
        const contract = await this.getDesignContract();
        return await contract.methods
            .getUpgradeCost(level)
            .call();
    }

    async getUpgradeCosts() {
        const contract = await this.getDesignContract();
        return await contract.methods
            .getUpgradeCosts()
            .call();
    }

    async getTokenDetails() {
        const contract = this.getContract();
        return await contract.methods
            .getTokenDetailsByOwner(this._userAccount)
            .call();
    }

    async claim() {
        // Create a request.
        let requestIdResolve;
        const requestIdPromise = new Promise(resolve => requestIdResolve = resolve);
        const requestCallback = event => {
            requestIdResolve(event.returnValues.block);
        };
        const requestEmitter = this.getContract().events.TokenCreateRequested();
        try {
            requestEmitter.on('data', requestCallback);
            await new Promise((resolve, reject) => {
                this.getContract().methods
                    .claim()
                    .send({
                        from: this._userAccount,
                    })
                    .on('confirmation', (confirmationNumber, receipt) => {
                        if (confirmationNumber >= MIN_CONFIRMATIONS) {
                            resolve();
                        }
                    })
                    .on('error', ex => {
                        reject(ex);
                    });
            });
        } catch (ex) {
            console.log(`exception ${ex}`);
            return false;
        } finally {
            requestEmitter.off('data', requestCallback);
        }

        // Waiting for the request to be fulfilled.
        const requestId = await requestIdPromise;
        const targetBlock = parseInt(requestId) + 1;
        await waitForBlock(targetBlock);
        return true;
    }

    async mint(count) {
        // Check allowance.
        const cost = await this.getMintCost();
        const countBN = web3js.utils.toBN(count);
        const costBN = web3js.utils.toBN(cost);
        await this.checkAllowance(costBN.mul(countBN).toString());

        // Create a request.
        let requestIdResolve;
        const requestIdPromise = new Promise(resolve => requestIdResolve = resolve);
        const requestCallback = event => {
            requestIdResolve(event.returnValues.block);
        };
        const requestEmitter = this.getContract().events.TokenCreateRequested({
            filter: {
                to: this._userAccount,
            }
        });
        try {
            requestEmitter.on('data', requestCallback);
            await new Promise((resolve, reject) => {
                this.getContract().methods
                    .mint(count)
                    .send({
                        from: this._userAccount,
                    })
                    .on('confirmation', (confirmationNumber, receipt) => {
                        if (confirmationNumber >= MIN_CONFIRMATIONS) {
                            resolve();
                        }
                    })
                    .on('error', ex => {
                        reject(ex);
                    });
            });
        } catch (ex) {
            console.log(`exception ${ex}`);
            return false;
        } finally {
            requestEmitter.off('data', requestCallback);
        }

        // Waiting for the request to be fulfilled.
        const requestId = await requestIdPromise;
        console.log(`requestId = ${requestId}`);
        const targetBlock = parseInt(requestId) + 1;
        await waitForBlock(targetBlock);
        return true;
    }

    async getPendingTokens() {
        const contract = this.getContract();
        return await contract.methods
            .getPendingTokens(this._userAccount)
            .call();
    }

    async processTokenRequests() {
        try {
            await new Promise((resolve, reject) => {
                this.getContract().methods
                    .processTokenRequests()
                    .send({
                        from: this._userAccount,
                    })
                    .on('confirmation', (confirmationNumber, receipt) => {
                        if (confirmationNumber >= MIN_CONFIRMATIONS) {
                            resolve();
                        }
                    })
                    .on('error', ex => {
                        reject(ex);
                    });
            });
        } catch (ex) {
            console.log(`exception ${ex}`);
            return false;
        }
        return true;
    }

    async _processTokenRequests(block) {
        const targetBlock = parseInt(block) + 1;
        await waitForBlock(targetBlock);
        try {
            await this.processTokenRequests();
        } catch (ex) {
            console.log(`exception ${ex}`);
            return;
        }
    }

    // Use with Chainlink VRF
    /*
    async _processTokenRequests(requestId) {
      let fulfillResolve;
      const fulfillPromise = new Promise(resolve => fulfillResolve = resolve);
      const fulfillCallback = event => fulfillResolve();
      const fulfillEmitter = this.getContract().events.TokenCreateFulfilled({
        filter: {
          requestId: requestId,
        }
      });
      try {
        fulfillEmitter.on('data', fulfillCallback);
        await fulfillPromise;
        await this.getContract().methods
          .processTokenRequests()
          .send({
            from: this._userAccount,
          });
      } catch (ex) {
        console.log(`exception ${ex}`);
        return;
      } finally {
        fulfillEmitter.off('data', fulfillCallback);
      }
    }
    */

    async upgrade(baseId, materialId) {
        // Upgrade.
        try {
            // Check allowance.
            const cost = await this.getUpgradeCost(8); // Last level.
            await this.checkAllowance(cost);

            // Upgrade.
            await new Promise((resolve, reject) => {
                this.getContract().methods
                    .upgrade(baseId, materialId)
                    .send({
                        from: this._userAccount,
                    })
                    .on('confirmation', (confirmationNumber, receipt) => {
                        if (confirmationNumber >= MIN_CONFIRMATIONS) {
                            resolve();
                        }
                    })
                    .on('error', ex => {
                        reject(ex);
                    });
            });
        } catch (ex) {
            console.log(`exception ${ex}`);
            return false;
        }
        return true;
    }
}
