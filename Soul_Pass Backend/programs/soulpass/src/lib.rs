use anchor_lang::prelude::*;

declare_id!("2zQxkQSsSrtVdSpjZ3gvjLvi75PBwVqQEExqKW3BuaNi");

#[program]
pub mod soulpass {
    use super::*;

    // =========================================================================
    // 1. INICIALIZACIÓN DEL EVENTO
    // =========================================================================
    pub fn initialize_event(ctx: Context<InitializeEvent>, price: u64, capacity: u64) -> Result<()> {
        let event = &mut ctx.accounts.event;
        event.organizer = ctx.accounts.organizer.key();
        event.price = price;
        event.capacity = capacity;
        event.tickets_sold = 0;
        event.status = EventStatus::Active;
        
        msg!("Soulpass Evento Creado. Capacidad: {}, Precio: {}", capacity, price);
        Ok(())
    }

    // =========================================================================
    // 2. COMPRA DE BOLETO
    // =========================================================================
    pub fn buy_ticket(ctx: Context<BuyTicket>) -> Result<()> {
        let event = &mut ctx.accounts.event;

        // Validaciones estrictas
        require!(event.status == EventStatus::Active, CustomError::EventNotActive);
        require!(event.tickets_sold < event.capacity, CustomError::SoldOut);

        // Cobro: De la wallet del fan al Escrow (PDA)
        let transfer_instruction = anchor_lang::system_program::Transfer {
            from: ctx.accounts.buyer.to_account_info(),
            to: ctx.accounts.escrow.to_account_info(),
        };
        let cpi_context = CpiContext::new(
            ctx.accounts.system_program.to_account_info(),
            transfer_instruction,
        );
        anchor_lang::system_program::transfer(cpi_context, event.price)?;

        event.tickets_sold = event.tickets_sold.checked_add(1).unwrap();

        // Registramos el boleto a nombre del comprador
        let ticket = &mut ctx.accounts.ticket_record;
        ticket.event = event.key();
        ticket.owner = ctx.accounts.buyer.key();
        ticket.claimed_refund = false;
        ticket.claimed_loyalty = false;

        msg!("¡Boleto comprado exitosamente en Soulpass!");
        Ok(())
    }

    // =========================================================================
    // 3. FILA VIRTUAL Y SENTIPASS (ESCENARIO C - SOLD OUT)
    // =========================================================================
    pub fn join_waitlist(ctx: Context<JoinWaitlist>) -> Result<()> {
        let event = &ctx.accounts.event;

        // Solo puedes reclamar el consuelo si realmente está agotado
        require!(event.tickets_sold >= event.capacity, CustomError::TicketsStillAvailable);

        // Emitimos un evento on-chain. El frontend de React detecta esto y regala el SentiPass
        emit!(SentiPassAwarded {
            event: event.key(),
            fan: ctx.accounts.user.key(),
            message: String::from("SentiPass otorgado por espera en fila virtual."),
        });

        msg!("Fan formado en fila virtual. SentiPass activado.");
        Ok(())
    }

    // =========================================================================
    // 4. ACTUALIZAR ESTADO DEL EVENTO (ORGANIZADOR)
    // =========================================================================
    pub fn update_event_status(ctx: Context<UpdateEventStatus>, new_status: EventStatus) -> Result<()> {
        let event = &mut ctx.accounts.event;
        require!(event.status == EventStatus::Active, CustomError::EventNotActive);

        event.status = new_status.clone();

        // Si se completó con éxito, liberamos los fondos de la bóveda al organizador
        if new_status == EventStatus::Completed {
            let balance = ctx.accounts.escrow.lamports();
            
            let event_key = event.key();
            let bump = ctx.bumps.escrow;
            let signer_seeds: &[&[&[u8]]] = &[&[
                b"escrow",
                event_key.as_ref(),
                &[bump],
            ]];

            let transfer_instruction = anchor_lang::system_program::Transfer {
                from: ctx.accounts.escrow.to_account_info(),
                to: ctx.accounts.organizer.to_account_info(),
            };

            anchor_lang::system_program::transfer(
                CpiContext::new_with_signer(
                    ctx.accounts.system_program.to_account_info(),
                    transfer_instruction,
                    signer_seeds
                ),
                balance
            )?;
            msg!("Escenario B: Evento completado. Fondos liberados al organizador.");
        } else if new_status == EventStatus::Cancelled {
            msg!("Escenario A: Evento cancelado. El dinero se queda en el Escrow para reembolsos.");
        }

        Ok(())
    }

    // =========================================================================
    // 5. RECLAMAR REEMBOLSO TOTAL (ESCENARIO A)
    // =========================================================================
    pub fn claim_refund(ctx: Context<ClaimRefund>) -> Result<()> {
        let event = &ctx.accounts.event;
        let ticket = &mut ctx.accounts.ticket_record;

        require!(event.status == EventStatus::Cancelled, CustomError::EventNotCancelled);
        require!(!ticket.claimed_refund, CustomError::AlreadyClaimed);

        let event_key = event.key();
        let bump = ctx.bumps.escrow;
        let signer_seeds: &[&[&[u8]]] = &[&[
            b"escrow",
            event_key.as_ref(),
            &[bump],
        ]];

        let transfer_instruction = anchor_lang::system_program::Transfer {
            from: ctx.accounts.escrow.to_account_info(),
            to: ctx.accounts.owner.to_account_info(),
        };

        // Regresamos el 100% del costo
        anchor_lang::system_program::transfer(
            CpiContext::new_with_signer(
                ctx.accounts.system_program.to_account_info(),
                transfer_instruction,
                signer_seeds
            ),
            event.price
        )?;

        ticket.claimed_refund = true; // Evita que reclamen dos veces

        msg!("Escenario A: Reembolso íntegro completado con éxito.");
        Ok(())
    }

    // =========================================================================
    // 6. RECLAMAR BONO DE LEALTAD (ESCENARIO B)
    // =========================================================================
    pub fn claim_loyalty(ctx: Context<ClaimLoyalty>) -> Result<()> {
        let event = &ctx.accounts.event;
        let ticket = &mut ctx.accounts.ticket_record;

        require!(event.status == EventStatus::Completed, CustomError::EventNotCompleted);
        require!(!ticket.claimed_loyalty, CustomError::AlreadyClaimed);

        ticket.claimed_loyalty = true;

        // Emitimos el evento para que el frontend suelte el NFT/Cupón de Lealtad
        emit!(LoyaltyTokenAwarded {
            event: event.key(),
            fan: ctx.accounts.owner.key(),
            message: String::from("Bono de Lealtad otorgado al fan verificado."),
        });

        msg!("Escenario B: Bono de lealtad reclamado exitosamente.");
        Ok(())
    }
}

// =========================================================================
    // 7. ROADMAP V2: INTEGRACIÓN DEFI Y GENERACIÓN DE RENDIMIENTO (YIELD)
    // =========================================================================
    /* pub fn invest_escrow_funds(ctx: Context<InvestEscrow>, amount: u64) -> Result<()> {
        let event = &ctx.accounts.event;
        
        require!(event.status == EventStatus::Active, CustomError::EventNotActive);

        let event_key = event.key();
        let bump = ctx.bumps.escrow;
        let signer_seeds: &[&[&[u8]]] = &[&[
            b"escrow",
            event_key.as_ref(),
            &[bump],
        ]];
        
        let transfer_instruction = anchor_lang::system_program::Transfer {
            from: ctx.accounts.escrow.to_account_info(),
            to: ctx.accounts.yield_pool.to_account_info(),
        };

        anchor_lang::system_program::transfer(
            CpiContext::new_with_signer(
                ctx.accounts.system_program.to_account_info(),
                transfer_instruction,
                signer_seeds
            ),
            amount
        )?;

        msg!("Fondos del Escrow invertidos en protocolo DeFi para generar intereses (SentiPass Yield).");
        Ok(())
    }
    */

// =========================================================================
// ESTRUCTURAS DE DATOS Y CONTEXTOS
// =========================================================================

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq)]
pub enum EventStatus {
    Active,
    Completed,
    Cancelled,
}

#[account]
pub struct EventState {
    pub organizer: Pubkey,
    pub price: u64,
    pub capacity: u64,
    pub tickets_sold: u64,
    pub status: EventStatus,
}

#[account]
pub struct TicketRecord {
    pub event: Pubkey,
    pub owner: Pubkey,
    pub claimed_refund: bool,
    pub claimed_loyalty: bool,
}

// --- CONTEXTOS ---

#[derive(Accounts)]
pub struct InitializeEvent<'info> {
    #[account(init, payer = organizer, space = 8 + 32 + 8 + 8 + 8 + 1)]
    pub event: Account<'info, EventState>,
    #[account(mut)]
    pub organizer: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct BuyTicket<'info> {
    #[account(mut)]
    pub event: Account<'info, EventState>,
    
    // Creamos un registro del boleto atado a este usuario y este evento
    #[account(
        init, 
        payer = buyer, 
        space = 8 + 32 + 32 + 1 + 1,
        seeds = [b"ticket", event.key().as_ref(), buyer.key().as_ref()],
        bump
    )]
    pub ticket_record: Account<'info, TicketRecord>,
    
    #[account(mut)]
    pub buyer: Signer<'info>,
    
    /// CHECK: Bóveda PDA
    #[account(mut, seeds = [b"escrow", event.key().as_ref()], bump)]
    pub escrow: SystemAccount<'info>,
    
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct JoinWaitlist<'info> {
    pub event: Account<'info, EventState>,
    pub user: Signer<'info>,
}

#[derive(Accounts)]
pub struct UpdateEventStatus<'info> {
    #[account(mut, has_one = organizer)]
    pub event: Account<'info, EventState>,
    #[account(mut)]
    pub organizer: Signer<'info>,
    /// Bóveda PDA
    #[account(mut, seeds = [b"escrow", event.key().as_ref()], bump)]
    pub escrow: SystemAccount<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct ClaimRefund<'info> {
    pub event: Account<'info, EventState>,
    #[account(
        mut,
        seeds = [b"ticket", event.key().as_ref(), owner.key().as_ref()],
        bump,
        has_one = owner @ CustomError::Unauthorized
    )]
    pub ticket_record: Account<'info, TicketRecord>,
    #[account(mut)]
    pub owner: Signer<'info>,
    /// CHECK: Bóveda PDA
    #[account(mut, seeds = [b"escrow", event.key().as_ref()], bump)]
    pub escrow: SystemAccount<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct ClaimLoyalty<'info> {
    pub event: Account<'info, EventState>,
    #[account(
        mut,
        seeds = [b"ticket", event.key().as_ref(), owner.key().as_ref()],
        bump,
        has_one = owner @ CustomError::Unauthorized
    )]
    pub ticket_record: Account<'info, TicketRecord>,
    #[account(mut)]
    pub owner: Signer<'info>,
}

/*
// Estructura planeada para la integración DeFi
#[derive(Accounts)]
pub struct InvestEscrow<'info> {
    pub event: Account<'info, EventState>,
    /// CHECK: Bóveda PDA del evento (Firma la transacción de salida)
    #[account(mut, seeds = [b"escrow", event.key().as_ref()], bump)]
    pub escrow: SystemAccount<'info>,
    /// CHECK: Bóveda del protocolo DeFi externo (Kamino/Solend)
    #[account(mut)]
    pub yield_pool: AccountInfo<'info>,
    pub system_program: Program<'info, System>,
    // TODO: Agregar el program_id del protocolo externo para el CPI
}
*/

// --- EVENTOS (Para el Frontend) ---
#[event]
pub struct SentiPassAwarded {
    pub event: Pubkey,
    pub fan: Pubkey,
    pub message: String,
}

#[event]
pub struct LoyaltyTokenAwarded {
    pub event: Pubkey,
    pub fan: Pubkey,
    pub message: String,
}

// --- ERRORES ---
#[error_code]
pub enum CustomError {
    #[msg("El evento no está activo.")]
    EventNotActive,
    #[msg("El evento no ha sido cancelado.")]
    EventNotCancelled,
    #[msg("El evento aún no está completado.")]
    EventNotCompleted,
    #[msg("Los boletos están agotados.")]
    SoldOut,
    #[msg("Aún hay boletos disponibles, no puedes unirte a la fila de consuelo.")]
    TicketsStillAvailable,
    #[msg("Esta recompensa o reembolso ya fue reclamada.")]
    AlreadyClaimed,
    #[msg("No eres el dueño de este boleto.")]
    Unauthorized,
}
