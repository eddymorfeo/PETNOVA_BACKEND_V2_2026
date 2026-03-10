const pool = require('../db/db');

const createPetVaccination = async ({
  petId,
  vaccineId,
  appliedAt,
  nextDueAt,
  consultationId,
  createdBy,
}) => {
  const query = `
    INSERT INTO pet_vaccinations (
      pet_id,
      vaccine_id,
      applied_at,
      next_due_at,
      consultation_id,
      created_by,
      updated_by,
      created_at,
      updated_at
    )
    VALUES ($1, $2, $3, $4, $5, $6, $6, NOW(), NOW())
    RETURNING
      id,
      pet_id,
      vaccine_id,
      applied_at,
      next_due_at,
      consultation_id,
      created_by,
      updated_by,
      created_at,
      updated_at
  `;

  const result = await pool.query(query, [
    petId,
    vaccineId,
    appliedAt,
    nextDueAt || null,
    consultationId || null,
    createdBy,
  ]);

  return result.rows[0];
};

const findPetVaccinationById = async (petVaccinationId) => {
  const query = `
    SELECT
      pv.id,
      pv.pet_id,
      pv.vaccine_id,
      pv.applied_at,
      pv.next_due_at,
      pv.consultation_id,
      pv.created_by,
      pv.updated_by,
      pv.created_at,
      pv.updated_at,
      vc.name AS vaccine_name,
      p.name AS pet_name
    FROM pet_vaccinations pv
    INNER JOIN pets p ON p.id = pv.pet_id
    LEFT JOIN vaccines_catalog vc ON vc.id = pv.vaccine_id
    WHERE pv.id = $1
    LIMIT 1
  `;

  const result = await pool.query(query, [petVaccinationId]);
  return result.rows[0] || null;
};

const getAllPetVaccinations = async () => {
  const query = `
    SELECT
      pv.id,
      pv.pet_id,
      pv.vaccine_id,
      pv.applied_at,
      pv.next_due_at,
      pv.consultation_id,
      pv.created_by,
      pv.updated_by,
      pv.created_at,
      pv.updated_at,
      p.name AS pet_name,
      vc.name AS vaccine_name
    FROM pet_vaccinations pv
    INNER JOIN pets p ON p.id = pv.pet_id
    LEFT JOIN vaccines_catalog vc ON vc.id = pv.vaccine_id
    ORDER BY pv.created_at DESC
  `;

  const result = await pool.query(query);
  return result.rows;
};

const updatePetVaccinationById = async (petVaccinationId, data, updatedBy) => {
  const fields = [];
  const values = [];
  let index = 1;

  if (data.vaccineId !== undefined) {
    fields.push(`vaccine_id = $${index++}`);
    values.push(data.vaccineId);
  }

  if (data.appliedAt !== undefined) {
    fields.push(`applied_at = $${index++}`);
    values.push(data.appliedAt);
  }

  if (data.nextDueAt !== undefined) {
    fields.push(`next_due_at = $${index++}`);
    values.push(data.nextDueAt);
  }

  if (data.consultationId !== undefined) {
    fields.push(`consultation_id = $${index++}`);
    values.push(data.consultationId);
  }

  fields.push(`updated_by = $${index++}`);
  values.push(updatedBy);

  fields.push(`updated_at = NOW()`);

  values.push(petVaccinationId);

  const query = `
    UPDATE pet_vaccinations
    SET ${fields.join(', ')}
    WHERE id = $${index}
    RETURNING
      id,
      pet_id,
      vaccine_id,
      applied_at,
      next_due_at,
      consultation_id,
      created_by,
      updated_by,
      created_at,
      updated_at
  `;

  const result = await pool.query(query, values);
  return result.rows[0] || null;
};

const deletePetVaccinationById = async (petVaccinationId) => {
  const query = `
    DELETE FROM pet_vaccinations
    WHERE id = $1
    RETURNING
      id,
      pet_id,
      vaccine_id,
      applied_at,
      next_due_at,
      consultation_id,
      created_by,
      updated_by,
      created_at,
      updated_at
  `;

  const result = await pool.query(query, [petVaccinationId]);
  return result.rows[0] || null;
};

module.exports = {
  createPetVaccination,
  findPetVaccinationById,
  getAllPetVaccinations,
  updatePetVaccinationById,
  deletePetVaccinationById,
};