
import {
    establishConnection,
    establishPayer,
    checkProgram,
    createKYCAccount,
    retriveCustomer,
  } from '../process/kyc-process';
  
  async function main() {
    console.log("Let's connect to a Solana account...");
  
    // Establish connection to the cluster
    await establishConnection();
  
    // Determine who pays for the fees
    await establishPayer();
  
    // Check if the program has been deployed
    await checkProgram();
 
    console.log('Success');
  }

  module.exports.execute = main;