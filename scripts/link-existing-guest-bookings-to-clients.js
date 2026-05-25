require('dotenv').config();

const pool = require('../src/db/db');

function buildPetNotes(petSnapshot) {
  const notes = [];

  if (petSnapshot?.age) {
    notes.push(`Edad informada en reserva publica: ${petSnapshot.age}`);
  }

  if (petSnapshot?.weightKg) {
    notes.push(`Peso informado en reserva publica: ${petSnapshot.weightKg} kg`);
  }

  if (petSnapshot?.observations) {
    notes.push(`Observaciones de reserva publica: ${petSnapshot.observations}`);
  }

  return notes.length ? notes.join('\n') : null;
}

async function createPetFromSnapshot(client, petSnapshot) {
  if (!petSnapshot?.name || !petSnapshot?.speciesId) {
    return null;
  }

  const result = await pool.query(
    `
      INSERT INTO pets (
        client_id,
        name,
        species_id,
        breed_id,
        sex,
        birth_date,
        color,
        microchip,
        is_sterilized,
        allergies,
        notes,
        is_active,
        created_by,
        updated_by,
        created_at,
        updated_at
      )
      VALUES ($1, $2, $3, $4, $5, NULL, NULL, NULL, NULL, NULL, $6, true, NULL, NULL, NOW(), NOW())
      RETURNING id
    `,
    [
      client.id,
      petSnapshot.name,
      petSnapshot.speciesId,
      petSnapshot.breedId || null,
      petSnapshot.sex || null,
      buildPetNotes(petSnapshot),
    ],
  );

  return result.rows[0];
}

async function main() {
  const result = await pool.query(`
    SELECT
      gb.id AS guest_booking_id,
      gb.appointment_id,
      gb.contact_email,
      gb.converted_client_id,
      gb.pet_snapshot,
      c.id AS client_id,
      c.full_name AS client_name,
      a.client_id AS appointment_client_id,
      a.pet_id AS appointment_pet_id
    FROM guest_bookings gb
    INNER JOIN clients c ON LOWER(c.email) = LOWER(gb.contact_email)
    INNER JOIN appointments a ON a.id = gb.appointment_id
    WHERE gb.converted_client_id IS NULL
       OR a.client_id IS NULL
    ORDER BY gb.created_at ASC
  `);

  let linkedAppointments = 0;
  let linkedGuestBookings = 0;
  let createdPets = 0;
  let skippedPets = 0;

  for (const row of result.rows) {
    let petId = row.appointment_pet_id;

    if (!petId) {
      const pet = await createPetFromSnapshot(
        { id: row.client_id },
        row.pet_snapshot,
      );

      if (pet) {
        petId = pet.id;
        createdPets++;
      } else if (row.pet_snapshot?.name) {
        skippedPets++;
        console.log(
          `Mascota no creada para ${row.contact_email}: falta speciesId en pet_snapshot (${row.pet_snapshot.name}).`,
        );
      }
    }

    if (!row.appointment_client_id || petId !== row.appointment_pet_id) {
      await pool.query(
        `
          UPDATE appointments
          SET
            client_id = COALESCE(client_id, $2),
            pet_id = COALESCE(pet_id, $3),
            updated_at = NOW()
          WHERE id = $1
        `,
        [row.appointment_id, row.client_id, petId],
      );
      linkedAppointments++;
    }

    if (!row.converted_client_id) {
      await pool.query(
        `
          UPDATE guest_bookings
          SET
            converted_client_id = $2,
            updated_at = NOW()
          WHERE id = $1
        `,
        [row.guest_booking_id, row.client_id],
      );
      linkedGuestBookings++;
    }
  }

  console.log(`Citas revisadas: ${result.rowCount}`);
  console.log(`Citas enlazadas/actualizadas: ${linkedAppointments}`);
  console.log(`Reservas invitadas convertidas: ${linkedGuestBookings}`);
  console.log(`Mascotas creadas: ${createdPets}`);
  console.log(`Mascotas omitidas por datos insuficientes: ${skippedPets}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => pool.end());
