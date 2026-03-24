# SoulPass: Escrow-Backed Ticketing on Solana

SoulPass es una dApp de boletaje descentralizado construida en Solana que elimina el fraude, asegura los fondos de los fans a través de bóvedas criptográficas (Escrows) y recompensa la lealtad.

![Solana](https://img.shields.io/badge/Solana-362D59?style=for-the-badge&logo=solana&logoColor=white)
![Anchor](https://img.shields.io/badge/Anchor-000000?style=for-the-badge&logo=rust&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)

---

## Pitch del Proyecto
Los sistemas de boletaje actuales obligan a los fans a confiar ciegamente en los organizadores. SoulPass cambia las reglas del juego utilizando **Program Derived Addresses (PDAs)** en Solana para crear un Escrow automatizado. El dinero del fan no va al organizador hasta que el evento concluye con éxito.

## Características Principales (Smart Contract)

Nuestro Smart Contract (`lib.rs`) maneja tres escenarios principales de forma 100% on-chain:

* ** Escenario A (Protección al Fan):** Si un evento se cancela, los fondos estacionados en el Escrow PDA se liberan, permitiendo a los usuarios reclamar un reembolso íntegro instantáneo y sin intermediarios.
* ** Escenario B (Bono de Lealtad):** Si el evento se completa, los fondos se liberan al organizador y el contrato emite un evento on-chain (`LoyaltyTokenAwarded`) para que el fan reclame recompensas exclusivas.
* ** Escenario C (SentiPass):** Cuando un evento hace *Sold Out*, el contrato inteligente detecta a los usuarios que se quedaron en la fila virtual y les otorga automáticamente un "SentiPass" (beneficios de consuelo).

## Arquitectura Técnica

* **Backend / Smart Contract:** Escrito en **Rust** utilizando el framework **Anchor**. Desplegado y testeado en Solana Devnet/Localnet.
* **Frontend:** Construido con **React** y **TypeScript**.
* **Web3 Integration:** Uso de `@solana/wallet-adapter-react` para la conexión nativa con Phantom y `@coral-xyz/anchor` para interactuar con los PDAs (Escrow y TicketRecords).

## Roadmap (V2) - Integración DeFi (Yield)
La arquitectura de nuestro Smart Contract ya incluye la base para integraciones CPI (*Cross-Program Invocation*). En la Fase 2, los fondos estacionados en el Escrow del evento se conectarán automáticamente a protocolos de liquidez de bajo riesgo en Solana (como Kamino o Solend). 

Los rendimientos (Yield) generados por estos fondos se utilizarán para financiar el "Fondo de Resiliencia" y pagar los beneficios del SentiPass, creando un modelo económico sustentable.
