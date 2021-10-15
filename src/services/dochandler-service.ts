const fs = require('fs');
const yaml = require('js-yaml');

import {
  establishConnection,
  establishPayer,
  checkProgram,
  createKYCAccount,
  retriveCustomer,
}
from "../process/documents";
async function main(PathHash: string, CustomerId: string, createdBy: string, lastModifiedBy: string, docType: string, docExt: string) {
  try {
     console.log("File uploaded successfully");

  } catch (error) {

      console.log(`Error processing transaction. ${error}`);
      console.log(error.stack);
  } 
}

module.exports.execute = main;