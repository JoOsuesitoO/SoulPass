use anchor_lang::prelude::*;

declare_id!("7YLUW2Dxhe7HtTsEQXwrtHR2Njtb4LqzhrWkjNuBSdKd");

#[program]
pub mod fair_pass {
    use super::*;

    // Función para crear un evento/concierto/show
    pub fn initialize_event(ctx: Context<InitializeEvent>, price: u64, capacity: u64) -> Result<()> {
        
        // Tomamos una referencia mutable a la cuenta del evento que acabamos de crear
        let event = &mut ctx.accounts.event;

        // Asignamos los valores iniciales basados en los parámetros
        event.organizer = ctx.accounts.organizer.key(); // Guardamos la wallet del creador
        event.price = price;
        event.capacity = capacity;
        event.tickets_sold = 0; // Inicia en 0 boletos vendidos
        event.status = EventStatus::Active; // El evento arranca como "Activo"

        msg!("¡Evento inicializado con éxito! Capacidad: {}, Precio: {}", capacity, price);
        
        Ok(())
    }
}
pub fn mint_ticket_to_escrow(ctx: Context<MintTicket>) -> Result<()> {
        let event = &mut ctx.accounts.event;

        // 1. VALIDACIONES DE SEGURIDAD
        // Verificamos que el evento siga activo
        require!(event.status == EventStatus::Active, CustomError::EventNotActive);
        // Verificamos que no se haya superado la capacidad máxima
        require!(event.tickets_sold < event.capacity, CustomError::SoldOut);

        // 2. TRANSFERENCIA DE FONDOS AL ESCROW
        // Armamos la instrucción para mover los SOL del comprador a la bóveda
        let transfer_instruction = anchor_lang::system_program::Transfer {
            from: ctx.accounts.buyer.to_account_info(),
            to: ctx.accounts.escrow.to_account_info(),
        };
        
        let cpi_context = CpiContext::new(
            ctx.accounts.system_program.to_account_info(),
            transfer_instruction,
        );

        // Ejecutamos el cobro usando el precio definido en el evento
        anchor_lang::system_program::transfer(cpi_context, event.price)?;

        // 3. ACTUALIZAR EL ESTADO (El "Boleto")
        // Sumamos 1 al contador de boletos vendidos de forma segura
        event.tickets_sold = event.tickets_sold.checked_add(1).unwrap();

        msg!("¡Boleto comprado! Fondos guardados en el Escrow. Boletos vendidos: {}/{}", event.tickets_sold, event.capacity);

        Ok(())
    }

#[derive(Accounts)]
pub struct MintTicket<'info> {
    // Traemos el evento que ya creamos, y lo ponemos "mut" porque vamos a sumarle 1 al contador
    #[account(mut)]
    pub event: Account<'info, EventState>,

    // El comprador que firma la transacción y de donde saldrá el dinero
    #[account(mut)]
    pub buyer: Signer<'info>,

    // LA BÓVEDA (PDA): Se crea automáticamente usando la palabra "escrow" y la dirección del evento
    /// CHECK: Esta cuenta es solo para recibir los fondos, Solana confía en las seeds.
    #[account(
        mut,
        seeds = [b"escrow", event.key().as_ref()],
        bump
    )]
    pub escrow: SystemAccount<'info>,

    // Necesario para transferir los SOL
    pub system_program: Program<'info, System>,
}

// Posibles estados del evento
#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq)]
pub enum EventStatus {
    Active,
    Completed,
    Cancelled,
}

// Struct
#[account]
pub struct EventState {
    pub organizer: Pubkey,   // Llave pública (wallet) de quien crea el evento
    pub price: u64,          // Precio del boleto (en lamports)
    pub capacity: u64,       // Cupo máximo
    pub tickets_sold: u64,   // Contador de boletos (on live)
    pub status: EventStatus, // El estado actual: Activo, Completado o Cancelado
}

// Esta es la estructura que define las cuentas necesarias para crear el evento
#[derive(Accounts)]
pub struct InitializeEvent<'info> {
    // 8 bytes (discriminador interno) + 32 (Pubkey) + 8 (precio) + 8 (capacidad) + 8 (boletos vendidos) + 1 (estado) = 65 bytes
    #[account(init, payer = organizer, space = 65)]
    pub event: Account<'info, EventState>,

    // El organizador es quien firma la transacción y paga la creación de la cuenta
    #[account(mut)]
    pub organizer: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Initialize {}

#[error_code]
pub enum CustomError {
    #[msg("El evento no está activo en este momento.")]
    EventNotActive,
    #[msg("Lo sentimos, los boletos están agotados.")]
    SoldOut,
}