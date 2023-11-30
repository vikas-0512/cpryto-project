/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { FileSystemWallet, Gateway } = require('fabric-network');
const path = require('path');

const ccpPath = path.resolve(__dirname, '..', '..', 'first-network', 'connection-org1.json');

async function getCars(contract){
    try{

        const result = await contract.evaluateTransaction('queryAllCars');
        console.log(`Transaction has been evaluated, result is\n`);
        var resultArray = JSON.parse(result.toString())
        console.log("car model owner colour");
        resultArray.forEach(car => {
            console.log(car.Key+" "+car.Record.make+" "+car.Record.owner+" "+car.Record.color);
        });

    }catch(err){
        console.error(`Failed to evaluate transaction: ${err}`);
        process.exit(1);
    }
}
async function addCars(contract){
    try{
        await contract.submitTransaction('createCar', 'CAR20', 'benz', 'Accord', 'Black', 'yesh');
        console.log("transaction added successfully")
        process.exit(1);
    }catch(err){
        console.log("error while Transaction is added");
        process.exit(2);
    }
}
async function modifyTransaction(contract){
    try{
        await contract.submitTransaction('changeCarOwner', 'CAR20', 'vivek');
        console.log("transaction modified successfully")
        process.exit(1);
    }catch(err){
        console.log("error while Transaction is added");
        process.exit(2);
    }
}
async function main() {
    try {

        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), 'wallet');
        const wallet = new FileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        // Check to see if we've already enrolled the user.
        const userExists = await wallet.exists('user3');
        if (!userExists) {
            console.log('An identity for the user "user3" does not exist in the wallet');
            console.log('Run the registerUser.js application before retrying');
            return;
        }

        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(ccpPath, { wallet, identity: 'user3', discovery: { enabled: true, asLocalhost: true } });

        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork('mychannel');

        // Get the contract from the network.
        const contract = network.getContract('fabcar');

        // Evaluate the specified transaction.
        // queryCar transaction - requires 1 argument, ex: ('queryCar', 'CAR4')
        // queryAllCars transaction - requires no arguments, ex: ('queryAllCars')
        getCars(contract);
        // addCars(contract);
        // modifyTransaction(contract);
        

    } catch (error) {
        console.error(`Failed to evaluate transaction: ${error}`);
        process.exit(1);
    }
}

main();
