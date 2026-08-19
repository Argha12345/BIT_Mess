import { reservationService } from '../services/reservationService.js';

export const createReservation = async (req, res, next) => {
  try {
    const reservation = await reservationService.createReservation(req.body);
    res.status(201).json({
      message: 'Late plate reserved successfully',
      reservation
    });
  } catch (error) {
    next(error);
  }
};

export const getStudentReservations = async (req, res, next) => {
  try {
    const { rollNo } = req.params;
    const reservations = await reservationService.getStudentReservations(rollNo);
    res.json(reservations);
  } catch (error) {
    next(error);
  }
};

export const getReservations = async (req, res, next) => {
  try {
    const reservations = await reservationService.getReservations(req.query);
    res.json(reservations);
  } catch (error) {
    next(error);
  }
};

export const updateReservationStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const updated = await reservationService.updateReservationStatus(id, status);
    res.json({
      message: `Reservation status updated to ${status}`,
      reservation: updated
    });
  } catch (error) {
    next(error);
  }
};
