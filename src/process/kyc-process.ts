import {
  Keypair,
  Connection,
  PublicKey,
  LAMPORTS_PER_SOL,
  SystemProgram,
  TransactionInstruction,
  Transaction,
  sendAndConfirmTransaction,
} from '@solana/web3.js';
import fs from 'mz/fs';
import path from 'path';
import * as borsh from 'borsh';

import { getPayer, getRpcUrl, createKeypairFromFile } from '../common/utils';

let connection: Connection;
let payer: Keypair;
let programId: PublicKey;
let kycPubKey: PublicKey;
const PROGRAM_PATH = path.resolve(__dirname, '../target/deploy');

const PROGRAM_SO_PATH = path.join(PROGRAM_PATH, 'kyc.so');
const
  PROGRAM_KEYPAIR_PATH = path.join(PROGRAM_PATH, 'kyc-keypair.json');


class CustomerData {

  instruction = "CreateCustomer"
  customer_id = "1"
  legal_name = "ABC Corporation"
  registration_number = "1002343-AXZSDF"
  incorporation_country = "Singapore"
  lei_registration_status = "Registered"
  lei = "ABC4097092374092BDJ3"
  incorporation_date = "12 May 2012"
  primary_country_operation = "Singapore"
  primary_isic_code = "1122 - Food and Beverages"
  entity_type = "Subsidiary"
  swift_code = "ABCFXX"
  kyc_status = false
  is_active = true
  constructor(fields: { instruction: string, customer_id: string, legal_name: string, registration_number: string, incorporation_country: string, lei_registration_status: string, lei: string, incorporation_date: string, primary_country_operation: string, primary_isic_code: string, entity_type: string, swift_code: string, kyc_status: boolean, is_active: boolean } | undefined = undefined) {
      if (fields) {
          this.instruction = fields.instruction;
          this.customer_id = fields.customer_id;
          this.legal_name = fields.legal_name;
          this.registration_number = fields.registration_number;
          this.incorporation_country = fields.incorporation_country;
          this.lei_registration_status = fields.lei_registration_status;
          this.lei = fields.lei;
          this.incorporation_date = fields.incorporation_date;
          this.primary_country_operation = fields.primary_country_operation;
          this.primary_isic_code = fields.primary_isic_code;
          this.entity_type = fields.entity_type;
          this.swift_code = fields.swift_code;
          this.kyc_status = fields.kyc_status;
          this.is_active = fields.is_active;
      }
  }
}

class CustomerDataList {
  data: CustomerData[] = [];
}

const CustomerDataSchema = new Map([
  [CustomerDataList, { kind: 'struct', fields: [['data', [4000]]] }],
]);

const CUSTOMER_SIZE = 4000;

export async function establishConnection(): Promise<void> {
  const rpcUrl = await getRpcUrl();
  connection = new Connection(rpcUrl, 'confirmed');
  const version = await connection.getVersion();
  console.log('Connection to cluster established:', rpcUrl, version);
}

export async function establishPayer(): Promise<void> {
  let fees = 0;
  console.log('space {}', CUSTOMER_SIZE);
  if (!payer) {
      const { feeCalculator } = await connection.getRecentBlockhash();
      fees += await connection.getMinimumBalanceForRentExemption(CUSTOMER_SIZE);
      fees += feeCalculator.lamportsPerSignature * 100; 
      payer = await getPayer();
  }

  let lamports = await connection.getBalance(payer.publicKey);
  if (lamports < fees) {
      const sig = await connection.requestAirdrop(
          payer.publicKey,
          fees - lamports,
      );
      await connection.confirmTransaction(sig);
      lamports = await connection.getBalance(payer.publicKey);
  }

  console.log(
      'Using account',
      payer.publicKey.toBase58(),
      'containing',
      lamports / LAMPORTS_PER_SOL,
      'SOL to pay for fees',
  );
}

export async function checkProgram(): Promise<void> {

  try {
      const programKeypair = await createKeypairFromFile(PROGRAM_KEYPAIR_PATH);
      programId = programKeypair.publicKey;
  } catch (err) {
      const errMsg = (err as Error).message;
      throw new Error(
          `Failed to read program keypair at '${PROGRAM_KEYPAIR_PATH}' due to error: ${errMsg}. Program may need to be deployed with \`solana program deploy target/deploy/kyc.so\``,
      );
  }
  
  const programInfo = await connection.getAccountInfo(programId);
  if (programInfo === null) {
      if (fs.existsSync(PROGRAM_SO_PATH)) {
          throw new Error(
              'Program needs to be deployed with `solana program deploy dist/program/kyc.so`',
          );
      } else {
          throw new Error('Program needs to be built and deployed');
      }
  } else if (!programInfo.executable) {
      throw new Error(`Program is not executable`);
  }
  console.log(`Using program ${programId.toBase58()}`);

  const KYC_SEED = 'bhaskar@gmail.com';
  kycPubKey = await PublicKey.createWithSeed(
      payer.publicKey,
      KYC_SEED,
      programId,
  );

  const customerAccount = await connection.getAccountInfo(kycPubKey);
  console.log('Account info {}', customerAccount);
  if (customerAccount === null) {
      console.log(
          'Creating Customer Account',
          kycPubKey.toBase58(),
      );
      const lamports = await connection.getMinimumBalanceForRentExemption(
          CUSTOMER_SIZE,
      );

      const transaction = new Transaction().add(
          SystemProgram.createAccountWithSeed({
              fromPubkey: payer.publicKey,
              basePubkey: payer.publicKey,
              seed: KYC_SEED,
              newAccountPubkey: kycPubKey,
              lamports,
              space: CUSTOMER_SIZE,
              programId,
          }),
      );
      await sendAndConfirmTransaction(connection, transaction, [payer]);
  }
}

export async function createCustomer(jsonMessage: string): Promise<void> {
  console.log("jsonMessage ............. ",jsonMessage);
  await invoke(jsonMessage);
}

export async function updateKycStatus(jsonMessage: string): Promise<void> {
  await invoke(jsonMessage);
}

export async function invoke(jsonMessage: string): Promise<void> {
  console.log('Invoking Smart Contract with Payload' + jsonMessage);
  const paddedMsg = jsonMessage.padEnd(1000);
  const buffer = Buffer.from(paddedMsg, 'utf8');

  const instruction = new TransactionInstruction({
      keys: [{ pubkey: kycPubKey, isSigner: false, isWritable: true }],
      programId,
      data: buffer,
  });
  await sendAndConfirmTransaction(
      connection,
      new Transaction().add(instruction),
      [payer],
      {
          commitment: 'singleGossip',
          preflightCommitment: 'singleGossip',
      },
  );

}