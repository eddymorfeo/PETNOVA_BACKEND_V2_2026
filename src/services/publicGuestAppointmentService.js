const ApiError = require("../utils/apiError");
const { getAllAppointmentTypes } = require("../models/appointmentTypeModel");
const { getAllVeterinarians } = require("../models/veterinarianModel");
const { getAllSpecies } = require("../models/speciesModel");
const { getAllBreeds } = require("../models/breedModel");
const {
  createAppointment,
  getAppointmentsByVeterinarianAndDate,
} = require("../models/appointmentModel");
const { getWorkingHoursByVeterinarianId } = require("../models/workingHourModel");
const { getTimeOffByVeterinarianAndDate } = require("../models/timeOffModel");
const { createGuestBooking } = require("../models/guestBookingModel");
const {
  enqueueGuestAppointmentConfirmationEmail,
} = require("./email/emailNotificationService");
const { createAppointmentEvent } = require("../models/appointmentEventModel");

function buildStartsAt(date, time) {
  return new Date(`${date}T${time}:00`);
}

function buildEndsAt(startsAt, minutes = 30) {
  return new Date(startsAt.getTime() + minutes * 60000);
}

function formatDateToYmd(dateValue) {
  const year = dateValue.getFullYear();
  const month = String(dateValue.getMonth() + 1).padStart(2, "0");
  const day = String(dateValue.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function formatDateToTime(dateValue) {
  const hours = String(dateValue.getHours()).padStart(2, "0");
  const minutes = String(dateValue.getMinutes()).padStart(2, "0");

  return `${hours}:${minutes}`;
}

function getTodayYmd() {
  return formatDateToYmd(new Date());
}

function normalizeText(value) {
  return String(value ?? "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "");
}

function getWeekdayCandidates(appointmentDate) {
  const jsDay = appointmentDate.getDay(); // 0 domingo - 6 sábado
  const isoDay = jsDay === 0 ? 7 : jsDay; // 1 lunes - 7 domingo

  const englishWeekdays = [
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
  ];

  const spanishWeekdays = [
    "domingo",
    "lunes",
    "martes",
    "miercoles",
    "jueves",
    "viernes",
    "sabado",
  ];

  return new Set([
    String(jsDay),
    String(isoDay),
    englishWeekdays[jsDay],
    spanishWeekdays[jsDay],
    englishWeekdays[jsDay].slice(0, 3),
    spanishWeekdays[jsDay].slice(0, 3),
  ]);
}

function matchesWeekday(workingHourWeekday, appointmentDate) {
  const normalizedWeekday = normalizeText(workingHourWeekday);
  const candidates = getWeekdayCandidates(appointmentDate);

  return candidates.has(normalizedWeekday);
}

function intervalsOverlap(leftStart, leftEnd, rightStart, rightEnd) {
  return leftStart < rightEnd && leftEnd > rightStart;
}

function isPastDate(appointmentDate) {
  return appointmentDate < getTodayYmd();
}

function isPastSlot(slotStartDate) {
  return slotStartDate.getTime() <= Date.now();
}

function ensureValidAppointmentDate(appointmentDate) {
  if (!appointmentDate) {
    throw new ApiError(400, "Debes seleccionar una fecha.");
  }

  const parsedDate = new Date(`${appointmentDate}T00:00:00`);

  if (Number.isNaN(parsedDate.getTime())) {
    throw new ApiError(400, "La fecha seleccionada no es válida.");
  }

  if (isPastDate(appointmentDate)) {
    throw new ApiError(
      400,
      "No puedes agendar una cita en una fecha anterior a la actual."
    );
  }

  return parsedDate;
}

function parseTimeValue(timeValue) {
  if (!timeValue) {
    return null;
  }

  if (typeof timeValue === "string") {
    return timeValue.slice(0, 5);
  }

  if (
    typeof timeValue === "object" &&
    timeValue.hours !== undefined &&
    timeValue.minutes !== undefined
  ) {
    const hours = String(timeValue.hours).padStart(2, "0");
    const minutes = String(timeValue.minutes).padStart(2, "0");

    return `${hours}:${minutes}`;
  }

  return String(timeValue).slice(0, 5);
}

function mapAvailableSlot(slotStartDate, slotMinutes) {
  const formattedTime = formatDateToTime(slotStartDate);

  return {
    value: formattedTime,
    label: formattedTime,
    slotMinutes,
  };
}

function buildWorkingHourSlots({
  appointmentDate,
  startTime,
  endTime,
  slotMinutes,
}) {
  const normalizedStartTime = parseTimeValue(startTime);
  const normalizedEndTime = parseTimeValue(endTime);

  if (!normalizedStartTime || !normalizedEndTime) {
    return [];
  }

  const normalizedSlotMinutes =
    Number.isFinite(Number(slotMinutes)) && Number(slotMinutes) > 0
      ? Number(slotMinutes)
      : 30;

  const slots = [];
  let currentStartDate = buildStartsAt(appointmentDate, normalizedStartTime);
  const workingHourEndDate = buildStartsAt(appointmentDate, normalizedEndTime);

  while (
    currentStartDate.getTime() + normalizedSlotMinutes * 60000 <=
    workingHourEndDate.getTime()
  ) {
    slots.push({
      slotStartDate: new Date(currentStartDate),
      slotEndDate: buildEndsAt(currentStartDate, normalizedSlotMinutes),
      slotMinutes: normalizedSlotMinutes,
    });

    currentStartDate = buildEndsAt(currentStartDate, normalizedSlotMinutes);
  }

  return slots;
}

async function listPublicAppointmentTypes() {
  return getAllAppointmentTypes();
}

async function listPublicVeterinarians() {
  return getAllVeterinarians();
}

async function listPublicSpecies() {
  const species = await getAllSpecies();

  return species.filter((item) => item.is_active !== false);
}

async function listPublicBreedsBySpecies(speciesId) {
  if (!speciesId) {
    throw new ApiError(400, "speciesId es obligatorio.");
  }

  const breeds = await getAllBreeds();

  return breeds.filter(
    (item) => item.is_active !== false && item.species_id === speciesId
  );
}

async function listPublicAvailableTimes({ veterinarianId, appointmentDate }) {
  if (!veterinarianId || !appointmentDate) {
    throw new ApiError(
      400,
      "veterinarianId y appointmentDate son obligatorios."
    );
  }

  const parsedAppointmentDate = ensureValidAppointmentDate(appointmentDate);

  const [workingHours, timeOffBlocks, reservedAppointments] = await Promise.all([
    getWorkingHoursByVeterinarianId(veterinarianId),
    getTimeOffByVeterinarianAndDate(veterinarianId, appointmentDate),
    getAppointmentsByVeterinarianAndDate(veterinarianId, appointmentDate),
  ]);

  const matchingWorkingHours = workingHours.filter((workingHour) =>
    matchesWeekday(workingHour.weekday, parsedAppointmentDate)
  );

  if (!matchingWorkingHours.length) {
    return [];
  }

  const blockedIntervals = timeOffBlocks.map((item) => ({
    startsAt: new Date(item.starts_at),
    endsAt: new Date(item.ends_at),
  }));

  const reservedIntervals = reservedAppointments.map((item) => ({
    startsAt: new Date(item.starts_at),
    endsAt: new Date(item.ends_at),
  }));

  const availableSlots = [];

  for (const workingHour of matchingWorkingHours) {
    const workingHourSlots = buildWorkingHourSlots({
      appointmentDate,
      startTime: workingHour.start_time,
      endTime: workingHour.end_time,
      slotMinutes: workingHour.slot_minutes,
    });

    for (const slot of workingHourSlots) {
      if (isPastSlot(slot.slotStartDate)) {
        continue;
      }

      const overlapsTimeOff = blockedIntervals.some((blockedInterval) =>
        intervalsOverlap(
          slot.slotStartDate,
          slot.slotEndDate,
          blockedInterval.startsAt,
          blockedInterval.endsAt
        )
      );

      if (overlapsTimeOff) {
        continue;
      }

      const overlapsReservedAppointment = reservedIntervals.some(
        (reservedInterval) =>
          intervalsOverlap(
            slot.slotStartDate,
            slot.slotEndDate,
            reservedInterval.startsAt,
            reservedInterval.endsAt
          )
      );

      if (overlapsReservedAppointment) {
        continue;
      }

      availableSlots.push(
        mapAvailableSlot(slot.slotStartDate, slot.slotMinutes)
      );
    }
  }

  const uniqueSlots = Array.from(
    new Map(availableSlots.map((slot) => [slot.value, slot])).values()
  );

  uniqueSlots.sort((left, right) => left.value.localeCompare(right.value));

  return uniqueSlots;
}

async function createPublicGuestAppointment(payload) {
  ensureValidAppointmentDate(payload.appointment.appointmentDate);

  const availableTimes = await listPublicAvailableTimes({
    veterinarianId: payload.appointment.veterinarianId,
    appointmentDate: payload.appointment.appointmentDate,
  });

  const selectedTime = availableTimes.find(
    (item) => item.value === payload.appointment.appointmentTime
  );

  if (!selectedTime) {
    throw new ApiError(
      409,
      "El horario seleccionado ya no está disponible."
    );
  }

  const startsAt = buildStartsAt(
    payload.appointment.appointmentDate,
    payload.appointment.appointmentTime
  );
  const endsAt = buildEndsAt(startsAt, selectedTime.slotMinutes || 30);

  const [appointmentTypes, veterinarians] = await Promise.all([
    getAllAppointmentTypes(),
    getAllVeterinarians(),
  ]);

  const selectedAppointmentType = appointmentTypes.find(
    (item) => item.id === payload.appointment.appointmentTypeId
  );

  const selectedVeterinarian = veterinarians.find(
    (item) => item.id === payload.appointment.veterinarianId
  );

  const appointment = await createAppointment({
    veterinarianId: payload.appointment.veterinarianId,
    appointmentTypeId: payload.appointment.appointmentTypeId,
    clientId: null,
    petId: null,
    startsAt: startsAt.toISOString(),
    endsAt: endsAt.toISOString(),
    status: "SCHEDULED",
    reason: payload.appointment.reason || null,
    bookedSource: "guest_portal",
    bookedByUserId: null,
    createdBy: null,
  });

  const guestBooking = await createGuestBooking({
    appointmentId: appointment.id,
    contactEmail: payload.contactEmail,
    contactName: payload.contactName,
    contactPhone: payload.contactPhone || null,
    invitationSentAt: null,
    convertedClientId: null,
    createdBy: null,
  });

  if (createAppointmentEvent) {
    await createAppointmentEvent({
      appointmentId: appointment.id,
      fromStatus: null,
      toStatus: "SCHEDULED",
      changedByType: "SYSTEM",
      changedById: null,
      note: "Reserva pública creada desde landing.",
      createdBy: null,
    });
  }

  await enqueueGuestAppointmentConfirmationEmail({
    toEmail: payload.contactEmail,
    contactName: payload.contactName,
    petName: payload.pet.name,
    appointmentTypeName:
      selectedAppointmentType?.name || "Consulta veterinaria",
    veterinarianName:
      selectedVeterinarian?.full_name ||
      selectedVeterinarian?.username ||
      "Profesional asignado",
    appointmentDate: payload.appointment.appointmentDate,
    appointmentTime: payload.appointment.appointmentTime,
    reason: payload.appointment.reason || "Sin motivo informado",
    createdBy: null,
  });

  return {
    appointmentId: appointment.id,
    guestBookingId: guestBooking.id,
    status: "SCHEDULED",
  };
}

module.exports = {
  createPublicGuestAppointment,
  listPublicAppointmentTypes,
  listPublicVeterinarians,
  listPublicSpecies,
  listPublicBreedsBySpecies,
  listPublicAvailableTimes,
};