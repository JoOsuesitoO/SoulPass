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
    // Aquí le decimos a Solana: "Crea una nueva cuenta (init), el organizador paga (payer), 
    // y reserva este espacio en bytes (space)".
    // 8 bytes (discriminador interno) + 32 (Pubkey) + 8 (precio) + 8 (capacidad) + 8 (boletos vendidos) + 1 (estado) = 65 bytes
    #[account(init, payer = organizer, space = 65)]
    pub event: Account<'info, EventState>,

    // El organizador es quien firma la transacción y paga la creación de la cuenta (mut significa que su saldo cambiará)
    #[account(mut)]
    pub organizer: Signer<'info>,

    // Este es un programa nativo de Solana necesario para crear cuentas nuevas
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Initialize {}
