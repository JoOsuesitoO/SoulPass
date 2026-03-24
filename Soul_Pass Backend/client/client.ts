import BN from "bn.js";
import * as web3 from "@solana/web3.js";
import * as anchor from "@coral-xyz/anchor";
import { web3, BN } from "@coral-xyz/anchor";
import type { Soulpass } from "../target/types/soulpass";

// Configure the client to use the local cluster
anchor.setProvider(anchor.AnchorProvider.env());

const program = anchor.workspace.Soulpass as anchor.Program<Soulpass>;


// Función auxiliar para fondear compradores de prueba
async function fundBuyer(buyer: web3.Keypair, amountSol: number) {
  const transferIx = web3.SystemProgram.transfer({
    fromPubkey: program.provider.publicKey,
    toPubkey: buyer.publicKey,
    lamports: amountSol * web3.LAMPORTS_PER_SOL,
  });
  const tx = new web3.Transaction().add(transferIx);
  await anchor.getProvider().sendAndConfirm(tx);
  
  console.log("Sincronizando fondos en Devnet...");
  
  // El "Sleep" inteligente: Consultamos la blockchain hasta que el balance cambie.
  let balance = 0;
  while (balance === 0) {
    balance = await program.provider.connection.getBalance(buyer.publicKey, "confirmed");
  }
  console.log("¡Fondos listos!");
}

console.log("INICIANDO SIMULACIÓN DE SOULPASS...");
console.log("===================================================");

// =========================================================================
// ESCENARIO A: EVENTO CANCELADO Y REEMBOLSO ÍNTEGRO
// =========================================================================
console.log("\n ESCENARIO A: Cancelación y Reembolso");
const eventA = new web3.Keypair();
const buyerA = new web3.Keypair();
const priceA = new BN(0.1 * web3.LAMPORTS_PER_SOL);

// 1. Crear Evento A
await program.methods.initializeEvent(priceA, new BN(100)).accounts({
  event: eventA.publicKey,
  organizer: program.provider.publicKey,
  systemProgram: web3.SystemProgram.programId,
}).signers([eventA]).rpc();

// 2. Comprar Boleto
await fundBuyer(buyerA, 0.2); // Fondeamos al comprador A
const [escrowA] = web3.PublicKey.findProgramAddressSync([Buffer.from("escrow"), eventA.publicKey.toBuffer()], program.programId);
const [ticketA] = web3.PublicKey.findProgramAddressSync([Buffer.from("ticket"), eventA.publicKey.toBuffer(), buyerA.publicKey.toBuffer()], program.programId);

await program.methods.buyTicket().accounts({
  event: eventA.publicKey,
  ticketRecord: ticketA,
  buyer: buyerA.publicKey,
  escrow: escrowA,
  systemProgram: web3.SystemProgram.programId,
}).signers([buyerA]).rpc();
console.log("Boleto comprado. Dinero seguro en Escrow.");

// 3. Cancelar Evento
await program.methods.updateEventStatus({ cancelled: {} }).accounts({
  event: eventA.publicKey,
  organizer: program.provider.publicKey,
  escrow: escrowA,
  systemProgram: web3.SystemProgram.programId,
}).rpc();
console.log("Evento Cancelado por Organizador.");

// 4. Reclamar Reembolso
let balanceAntes = await program.provider.connection.getBalance(buyerA.publicKey);
await program.methods.claimRefund().accounts({
  event: eventA.publicKey,
  ticketRecord: ticketA,
  owner: buyerA.publicKey,
  escrow: escrowA,
  systemProgram: web3.SystemProgram.programId,
}).signers([buyerA]).rpc();
let balanceDespues = await program.provider.connection.getBalance(buyerA.publicKey);
console.log(`Reembolso Exitoso! Recuperado: ${(balanceDespues - balanceAntes) / web3.LAMPORTS_PER_SOL} SOL`);


// =========================================================================
// ESCENARIO B: EVENTO COMPLETADO Y BONO DE LEALTAD
// =========================================================================
console.log("\n ESCENARIO B: Evento Exitoso y Lealtad");
const eventB = new web3.Keypair();
const buyerB = new web3.Keypair();

await program.methods.initializeEvent(priceA, new BN(100)).accounts({
  event: eventB.publicKey,
  organizer: program.provider.publicKey,
  systemProgram: web3.SystemProgram.programId,
}).signers([eventB]).rpc();

await fundBuyer(buyerB, 0.2);
const [escrowB] = web3.PublicKey.findProgramAddressSync([Buffer.from("escrow"), eventB.publicKey.toBuffer()], program.programId);
const [ticketB] = web3.PublicKey.findProgramAddressSync([Buffer.from("ticket"), eventB.publicKey.toBuffer(), buyerB.publicKey.toBuffer()], program.programId);

await program.methods.buyTicket().accounts({
  event: eventB.publicKey,
  ticketRecord: ticketB,
  buyer: buyerB.publicKey,
  escrow: escrowB,
  systemProgram: web3.SystemProgram.programId,
}).signers([buyerB]).rpc();

// Completar Evento (El dinero se va al organizador)
await program.methods.updateEventStatus({ completed: {} }).accounts({
  event: eventB.publicKey,
  organizer: program.provider.publicKey,
  escrow: escrowB,
  systemProgram: web3.SystemProgram.programId,
}).rpc();
console.log("Evento Finalizado. Fondos liberados al organizador.");

// Reclamar Lealtad
await program.methods.claimLoyalty().accounts({
  event: eventB.publicKey,
  ticketRecord: ticketB,
  owner: buyerB.publicKey,
}).signers([buyerB]).rpc();
console.log("Bono de Lealtad reclamado (Evento On-Chain emitido para el Frontend).");


// =========================================================================
// ESCENARIO C: SOLD OUT Y SENTIPASS
// =========================================================================
console.log("\n ESCENARIO C: Sold Out y Fila Virtual");
const eventC = new web3.Keypair();
const buyerC1 = new web3.Keypair(); // El suertudo que alcanza boleto
const buyerC2 = new web3.Keypair(); // El que se queda en fila

// 1. Crear evento con capacidad de UN SOLO LUGAR (1)
await program.methods.initializeEvent(priceA, new BN(1)).accounts({
  event: eventC.publicKey,
  organizer: program.provider.publicKey,
  systemProgram: web3.SystemProgram.programId,
}).signers([eventC]).rpc();

// 2. Comprador 1 agota el evento
await fundBuyer(buyerC1, 0.2);
const [escrowC] = web3.PublicKey.findProgramAddressSync([Buffer.from("escrow"), eventC.publicKey.toBuffer()], program.programId);
const [ticketC1] = web3.PublicKey.findProgramAddressSync([Buffer.from("ticket"), eventC.publicKey.toBuffer(), buyerC1.publicKey.toBuffer()], program.programId);

await program.methods.buyTicket().accounts({
  event: eventC.publicKey,
  ticketRecord: ticketC1,
  buyer: buyerC1.publicKey,
  escrow: escrowC,
  systemProgram: web3.SystemProgram.programId,
}).signers([buyerC1]).rpc();
console.log("Boleto 1 vendido. ¡SOLD OUT!");

// 3. Comprador 2 intenta unirse a la fila para reclamar el SentiPass
await fundBuyer(buyerC2, 0.2);
await program.methods.joinWaitlist().accounts({
  event: eventC.publicKey,
  user: buyerC2.publicKey,
}).signers([buyerC2]).rpc();
console.log("Fila virtual detectó Sold Out. SentiPass activado para el usuario 2.");

console.log("\n===================================================");
console.log("¡ESCENARIOS PROBADOS CON ÉXITO!");