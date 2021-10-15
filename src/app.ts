import express from "express";
import * as dotenv from "dotenv";
import cors from "cors";
import  ipfsClient from "ipfs-http-client";
import multer from "multer";
//import * as fileUpload from "express-fileupload";

const IPFS_HOST1:string = process.env.IPFS_HOST1;
const IPFS_PORT1:string = process.env.IPFS_PORT1;

const ipfs = new (ipfsClient as any)("http://localhost:5001");
//const upload = multer({ dest: `${UPLOAD_PATH}/` });


require('dotenv').config();

const hostname = process.env.HOST;
const port = process.env.PORT;
let fileBuffer;
//const multer = require('multer');
//const fs = require('fs');
//const ipfsClient = require('ipfs-http-client');
//const ipfs = new ipfsClient({host:process.env.IPFS_HOST1,port:process.env.IPFS_PORT1,protocol:'http'});

//const fileUpload = require('express-fileupload');
//const baseUrl = "http://".concat(hostname).concat(":").concat(port).concat("/files");
const app = express();
var http = require('http').createServer(app);
app.use(cors());
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.set("title", "Synergy Collaboration App");
app.use(cors({
  exposedHeaders: ['Content-Disposition'],
}));
//var io = require('socket.io')(http);
//var uuidv4 = require('uuid').v4;
const bodyParser = require("body-parser");
const { response } = require("express");
const kycService = require("./services/kyc-service");

app.get("/", (req, res) => {
  //kycService.execute();
});


app.post("/getAccount/:email",(req,res) => {
  //check with email (SEED) in Solana and retreive the account
  //
})

// retrieve the customer details 

app.get("/getCustomer/:account_id", (req,res) =>{
    // customer details will be retrieved and sent back to UI
    //
    //  customer_id: abc1235
    //  customer_name: surendra
    //  kyc_status: false
    //  basic_details: {
            //...
        //}
        //address_details {}
});


app.post("/createCustomer", (req,res) => {

  // await createCustomer('"instruction" : "CreateCustomer", "customer_id" : "1", "legal_name" : "ABC Corporation", "registration_number" : "1002343-AXZSDF", "incorporation_country" : "Singapore", "lei_registration_status" :"Registered", "lei" : "ABC4097092374092BDJ3", "incorporation_date" : "12 May 2012", "primary_country_operation" : "Singapore", "primary_isic_code" : "1122 - Food and Beverages", "entity_type" : "Subsidiary", "swift_code" : "ABCFXX", "kyc_status" : false, "is_active" : true');


  const legalName: string = req.body.basicDetails.legalName;
  const leiRegistrationStatus: string =  req.body.basicDetails.leiRegistrationStatus;
  const primaryCountryOfOperations: string = req.body.basicDetails.primaryCountryOfOperations;
  const swiftCode: string = req.body.basicDetails.swiftCode;
  const incorporationCountry:string = req.body.basicDetails.incorporationCountry;
  const incorporationDate:string = req.body.basicDetails.incorporationDate;
  const entityType:string = req.body.basicDetails.entityType;
  const registrationNumber:string = req.body.basicDetails.registrationNumber;
  const lei:string = req.body.basicDetails.lei;
  const primaryIsicCode:string = req.body.basicDetails.primaryIsicCode;
 
  kycService.create(legalName,leiRegistrationStatus,primaryCountryOfOperations,swiftCode,incorporationCountry,incorporationDate,entityType,registrationNumber,lei,primaryIsicCode);


})


app.post("/grantAccess:account_id", (req,res) => {
  // How to mint tokens per account and use this as escrow
})

app.get("/getMyClients",(req,res) => {
  //  how many profiles I've access 
  // ex: Bank A is retriving the list of customer ? 
})

//get my kyc consumers 
app.get("/getMyKYCConsumers",(req,res) => {

})

app.post("giveConsent",(req,res) => {
  //provide consent to others
})

http.listen(port,hostname, ()=> {
    console.log(`Server running at http://${hostname}:${port}/`);
  });