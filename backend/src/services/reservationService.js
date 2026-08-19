import { reservationRepository } from '../repositories/reservationRepository.js';
import { userRepository } from '../repositories/userRepository.js';

export const reservationService = {
  createReservation: async ({ rollNo, date, meal, reason }) => {
    if (!rollNo || !date || !meal || !reason) {
      const err = new Error('Roll number, date, meal, and reason are required');
      err.status = 400;
      throw err;
    }

    const user = await userRepository.findByRollNo(rollNo);
    if (!user) {
      const err = new Error('Student not found with this roll number');
      err.status = 404;
      throw err;
    }

    const reservations = await reservationRepository.findAll();
    const duplicate = reservations.find(
      r => r.rollNo.toLowerCase() === rollNo.toLowerCase() &&
           r.date === date &&
           r.meal === meal &&
           !['cancelled', 'rejected'].includes(r.status)
    );

    if (duplicate) {
      const err = new Error('You already have an active late plate request for this meal');
      err.status = 400;
      throw err;
    }

    const newReservation = await reservationRepository.create({
      userId: user.id,
      rollNo: user.rollNo,
      name: user.name,
      section: user.section,
      hostel: user.hostel,
      messType: user.messType,
      date,
      meal,
      reason,
      status: 'pending',
      createdAt: new Date().toISOString()
    });

    return newReservation;
  },

  getStudentReservations: async (rollNo) => {
    return await reservationRepository.findByStudent(rollNo);
  },

  getReservations: async (queryParams) => {
    return await reservationRepository.findFiltered(queryParams);
  },

  updateReservationStatus: async (id, status) => {
    const validStatuses = ['pending', 'approved', 'rejected', 'collected', 'cancelled'];
    if (!status || !validStatuses.includes(status)) {
      const err = new Error(`Valid status is required ("${validStatuses.join('", "')}")`);
      err.status = 400;
      throw err;
    }

    const updated = await reservationRepository.updateStatus(id, status);
    if (!updated) {
      const err = new Error('Reservation not found');
      err.status = 404;
      throw err;
    }

    return updated;
  }
};
