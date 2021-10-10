function onLogged() {
   	userAccount = "0x17a678938420ac5b2875279892e33ead77886e26";
    
    console.log("addess select = " + userAccount);

    coinToken = new BCoinToken(bCoinTokenAddress, bCoinTokenAbi, userAccount);
    heroToken = new BHeroToken(coinToken, bHeroTokenAddress, bHeroTokenAbi, bHeroDesignAbi, userAccount);
    houseToken = new BHouseToken(coinToken, bHouseTokenAddress, bHouseTokenAbi, bHouseDesignAbi, userAccount);
}
