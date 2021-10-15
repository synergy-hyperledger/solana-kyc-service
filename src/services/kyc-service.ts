import {
  establishConnection,
  establishPayer,
  checkProgram,
  createCustomer,
  updateKycStatus
} from '../process/kyc-process';

export const create = async (legalName: string,leiRegistrationStatus: string,primaryCountryOfOperations: string,swiftCode: string,
  incorporationCountry: string,incorporationDate: string,entityType: string,registrationNumber: string,lei: string,primaryIsicCode: string): Promise<void> => {
 
    console.log("legalName......... ",legalName);
  await establishConnection();

  await establishPayer();

  await checkProgram();

  //await createCustomer( "entity_type" : "Subsidiary", "swift_code" : "ABCFXX", "kyc_status" : false, "is_active" : true');

  const custJson = {
    instruction: 'CreateCustomer',
    customer_id: '1234',
    legal_name: legalName,
    registration_number: registrationNumber,
    incorporation_country: incorporationCountry,
    lei_registration_status: leiRegistrationStatus,
    lei: lei,
    incorporation_date: incorporationDate,
    primary_country_operation: primaryCountryOfOperations,
    primary_isic_code: primaryIsicCode,
    entity_type: entityType,
    swift_code: swiftCode,
    kyc_status: false,
    is_active: false
};
const custJsonstring = JSON.stringify(custJson);
console.log("custJsonstring", custJsonstring);

 // let employeeDesc1: string = employeeName + " works in the " + employeeDept + " department."; 
  console.log("Creating Customer");

  await createCustomer(custJsonstring);

  console.log("Updating KycStatus for the Customer")
  //await updateKycStatus('"instruction" : "updateKycStatus", "customer_id" : "1", "legal_name" : "ABC Corporation", "registration_number" : "1002343-AXZSDF", "incorporation_country" : "Singapore", "lei_registration_status" :"Registered", "lei" : "ABC4097092374092BDJ3", "incorporation_date" : "12 May 2012", "primary_country_operation" : "Singapore", "primary_isic_code" : "1122 - Food and Beverages", "entity_type" : "Subsidiary", "swift_code" : "ABCFXX", "kyc_status" : true, "is_active" : true');

  console.log('Success');
}

