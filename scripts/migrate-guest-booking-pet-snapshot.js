require('dotenv').config();

const pool = require('../src/db/db');

async function main() {
  await pool.query(`
    ALTER TABLE guest_bookings
    ADD COLUMN IF NOT EXISTS pet_snapshot jsonb
  `);

  const backfillResult = await pool.query(`
    UPDATE guest_bookings gb
    SET pet_snapshot = (
      SELECT jsonb_build_object(
        'name', eo.payload->>'petName',
        'speciesId', NULL,
        'breedId', NULL,
        'sex', NULL,
        'age', NULL,
        'weightKg', NULL,
        'observations', NULL
      )
      FROM email_outbox eo
      WHERE eo.template = 'guest_appointment_confirmation'
        AND eo.payload->>'invitationToken' = gb.id::text
        AND eo.payload ? 'petName'
      ORDER BY eo.created_at DESC
      LIMIT 1
    )
    WHERE gb.pet_snapshot IS NULL
      AND EXISTS (
        SELECT 1
        FROM email_outbox eo
        WHERE eo.template = 'guest_appointment_confirmation'
          AND eo.payload->>'invitationToken' = gb.id::text
          AND eo.payload ? 'petName'
      )
  `);

  console.log(`guest_bookings.pet_snapshot listo. Backfill: ${backfillResult.rowCount} filas.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => pool.end());
