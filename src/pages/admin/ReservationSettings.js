import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Loader2, PauseCircle, PlayCircle, AlertTriangle, CheckCircle2 } from 'lucide-react';
import api from '../../api';

export default function ReservationSettings() {
  const [paused, setPaused] = useState(false);
  const [timeRestrictionEnabled, setTimeRestrictionEnabled] = useState(true);
  const [reservationTimeWarningEnabled, setReservationTimeWarningEnabled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState(false);
  const [togglingTimeRestriction, setTogglingTimeRestriction] = useState(false);
  const [togglingTimeWarning, setTogglingTimeWarning] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    loadPauseStatus();
  }, []);

  const loadPauseStatus = async () => {
    setLoading(true);
    try {
      const data = await api.getReservationSettings();
      setPaused(Boolean(data.reservations_paused));
      setTimeRestrictionEnabled(data?.time_restriction_enabled !== false && data?.time_restriction_enabled !== 0);
      setReservationTimeWarningEnabled(data?.reservation_time_warning_enabled === true || data?.reservation_time_warning_enabled === 1);
    } catch (err) {
      console.error('Failed to load pause status:', err);
      setMessage({ type: 'error', text: 'Failed to load reservation settings.' });
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async () => {
    const newState = !paused;
    setToggling(true);
    setMessage(null);
    try {
      const result = await api.toggleReservationPause(newState);
      setPaused(Boolean(result.reservations_paused));
      setMessage({
        type: 'success',
        text: newState
          ? 'Reservations have been paused. Customers will see a "paused" notice.'
          : 'Reservations have been resumed. Customers can now book again.',
      });
    } catch (err) {
      console.error('Failed to toggle pause:', err);
      setMessage({ type: 'error', text: 'Failed to update reservation status. Please try again.' });
    } finally {
      setToggling(false);
    }
  };

  const handleToggleTimeRestriction = async () => {
    const newState = !timeRestrictionEnabled;
    setTogglingTimeRestriction(true);
    setMessage(null);
    try {
      const result = await api.toggleReservationTimeRestriction(newState, paused, reservationTimeWarningEnabled);
      setPaused(Boolean(result.reservations_paused));
      setTimeRestrictionEnabled(result?.time_restriction_enabled !== false && result?.time_restriction_enabled !== 0);
      setReservationTimeWarningEnabled(result?.reservation_time_warning_enabled === true || result?.reservation_time_warning_enabled === 1);
      setMessage({
        type: 'success',
        text: newState
          ? 'Reservation time restriction has been enabled.'
          : 'Reservation time restriction has been disabled.',
      });
    } catch (err) {
      console.error('Failed to toggle time restriction:', err);
      setMessage({ type: 'error', text: 'Failed to update reservation time restriction. Please try again.' });
    } finally {
      setTogglingTimeRestriction(false);
    }
  };

  const handleToggleTimeWarning = async () => {
    const newState = !reservationTimeWarningEnabled;
    setTogglingTimeWarning(true);
    setMessage(null);
    try {
      const result = await api.toggleReservationTimeWarning(newState, paused, timeRestrictionEnabled);
      setPaused(Boolean(result.reservations_paused));
      setTimeRestrictionEnabled(result?.time_restriction_enabled !== false && result?.time_restriction_enabled !== 0);
      setReservationTimeWarningEnabled(result?.reservation_time_warning_enabled === true || result?.reservation_time_warning_enabled === 1);
      setMessage({
        type: 'success',
        text: newState
          ? 'Reservation time warning has been enabled and time restriction has been disabled.'
          : 'Reservation time warning has been disabled.',
      });
    } catch (err) {
      console.error('Failed to toggle time warning:', err);
      setMessage({ type: 'error', text: 'Failed to update reservation time warning. Please try again.' });
    } finally {
      setTogglingTimeWarning(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">Reservation Settings</h1>
          <p className="text-neutral-500 text-sm mt-1">Control reservation availability</p>
        </div>
        <div className="skeleton h-48 rounded-xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">Reservation Settings</h1>
        <p className="text-neutral-500 text-sm mt-1">Control reservation availability</p>
      </div>

      {/* Status Message */}
      {message && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`flex items-center gap-3 p-4 rounded-xl border text-sm font-medium ${
            message.type === 'success'
              ? 'bg-green-500/10 border-green-500/20 text-green-600 dark:text-green-400'
              : 'bg-red-500/10 border-red-500/20 text-red-600 dark:text-red-400'
          }`}
        >
          {message.type === 'success' ? <CheckCircle2 size={18} /> : <AlertTriangle size={18} />}
          {message.text}
        </motion.div>
      )}

      {/* Pause Reservations Card */}
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-8 shadow-sm dark:shadow-none">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 transition-colors duration-300 ${
              paused
                ? 'bg-red-500/10 border border-red-500/20'
                : 'bg-green-500/10 border border-green-500/20'
            }`}>
              {paused ? (
                <PauseCircle size={28} className="text-red-500 dark:text-red-400" />
              ) : (
                <PlayCircle size={28} className="text-green-500 dark:text-green-400" />
              )}
            </div>
            <div>
              <h2 className="text-lg font-bold text-neutral-900 dark:text-white">
                Pause Reservations
              </h2>
              <p className="text-neutral-500 dark:text-neutral-400 text-sm mt-1 max-w-lg">
                When enabled, customers will see a "Reservations are paused for the day" message
                and will not be able to submit new reservations. Existing reservations are not affected.
              </p>
              <div className="mt-3 flex items-center gap-2">
                <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full ${
                  paused
                    ? 'bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20'
                    : 'bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20'
                }`}>
                  <span className={`w-2 h-2 rounded-full ${paused ? 'bg-red-500 animate-pulse' : 'bg-green-500'}`} />
                  {paused ? 'Reservations Paused' : 'Reservations Active'}
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={handleToggle}
            disabled={toggling}
            className={`px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shrink-0 ${
              paused
                ? 'bg-green-500 hover:bg-green-600 text-white shadow-lg shadow-green-500/20'
                : 'bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/20'
            }`}
          >
            {toggling ? (
              <span className="flex items-center gap-2">
                <Loader2 size={16} className="animate-spin" />
                Updating...
              </span>
            ) : paused ? (
              <span className="flex items-center gap-2">
                <PlayCircle size={16} />
                Resume Reservations
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <PauseCircle size={16} />
                Pause Reservations
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Reservation Time Restriction Card */}
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-8 shadow-sm dark:shadow-none">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 transition-colors duration-300 ${
              timeRestrictionEnabled
                ? 'bg-green-500/10 border border-green-500/20'
                : 'bg-neutral-500/10 border border-neutral-500/20'
            }`}>
              {timeRestrictionEnabled ? (
                <CheckCircle2 size={28} className="text-green-500 dark:text-green-400" />
              ) : (
                <AlertTriangle size={28} className="text-neutral-500 dark:text-neutral-400" />
              )}
            </div>
            <div>
              <h2 className="text-lg font-bold text-neutral-900 dark:text-white">
                Reservation Time Restriction
              </h2>
              <p className="text-neutral-500 dark:text-neutral-400 text-sm mt-1 max-w-lg">
                When enabled, reservations for today will only be available after the required minimum advance-booking time.
                Past and restricted time slots will be automatically disabled. Reservations for future dates will remain unaffected.
              </p>
              <div className="mt-3 flex items-center gap-2">
                <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full ${
                  timeRestrictionEnabled
                    ? 'bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20'
                    : 'bg-neutral-500/10 text-neutral-600 dark:text-neutral-400 border border-neutral-500/20'
                }`}>
                  <span className={`w-2 h-2 rounded-full ${timeRestrictionEnabled ? 'bg-green-500' : 'bg-neutral-400'}`} />
                  {timeRestrictionEnabled ? 'Restriction Enabled' : 'Restriction Disabled'}
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={handleToggleTimeRestriction}
            disabled={togglingTimeRestriction}
            className={`px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shrink-0 ${
              timeRestrictionEnabled
                ? 'bg-neutral-600 hover:bg-neutral-700 text-white'
                : 'bg-green-500 hover:bg-green-600 text-white shadow-lg shadow-green-500/20'
            }`}
          >
            {togglingTimeRestriction ? (
              <span className="flex items-center gap-2">
                <Loader2 size={16} className="animate-spin" />
                Updating...
              </span>
            ) : timeRestrictionEnabled ? (
              'Disable Restriction'
            ) : (
              'Enable Restriction'
            )}
          </button>
        </div>
      </div>

      {/* Reservation Time Warning Card */}
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-8 shadow-sm dark:shadow-none">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 transition-colors duration-300 ${
              reservationTimeWarningEnabled
                ? 'bg-amber-500/10 border border-amber-500/20'
                : 'bg-neutral-500/10 border border-neutral-500/20'
            }`}>
              <AlertTriangle size={28} className={reservationTimeWarningEnabled ? 'text-amber-500 dark:text-amber-400' : 'text-neutral-500 dark:text-neutral-400'} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-neutral-900 dark:text-white">
                Reservation Time Warning
              </h2>
              <p className="text-neutral-500 dark:text-neutral-400 text-sm mt-1 max-w-lg">
                When enabled, same-day times less than 1 hour from the restaurant-local time remain selectable, but customers see a warning with contact details and cannot submit until they choose a valid time.
              </p>
              <div className="mt-3 flex items-center gap-2">
                <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full ${
                  reservationTimeWarningEnabled
                    ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                    : 'bg-neutral-500/10 text-neutral-600 dark:text-neutral-400 border border-neutral-500/20'
                }`}>
                  <span className={`w-2 h-2 rounded-full ${reservationTimeWarningEnabled ? 'bg-amber-500' : 'bg-neutral-400'}`} />
                  {reservationTimeWarningEnabled ? 'Warning Enabled' : 'Warning Disabled'}
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={handleToggleTimeWarning}
            disabled={togglingTimeWarning}
            className={`px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shrink-0 ${
              reservationTimeWarningEnabled
                ? 'bg-neutral-600 hover:bg-neutral-700 text-white'
                : 'bg-amber-500 hover:bg-amber-600 text-white shadow-lg shadow-amber-500/20'
            }`}
          >
            {togglingTimeWarning ? (
              <span className="flex items-center gap-2">
                <Loader2 size={16} className="animate-spin" />
                Updating...
              </span>
            ) : reservationTimeWarningEnabled ? (
              'Disable Warning'
            ) : (
              'Enable Warning'
            )}
          </button>
        </div>
      </div>

      {/* Info Card */}
      <div className="bg-amber-500/5 border border-amber-500/15 rounded-xl p-6">
        <div className="flex items-start gap-3">
          <AlertTriangle size={18} className="text-amber-500 dark:text-amber-400 shrink-0 mt-0.5" />
          <div>
            <h3 className="text-amber-700 dark:text-amber-400 text-sm font-semibold mb-1">How it works</h3>
            <ul className="text-amber-600/80 dark:text-amber-400/70 text-xs space-y-1.5 list-disc list-inside">
              <li>When paused, the reservations page will display a prominent notice to customers</li>
              <li>The reservation form will be hidden and submissions will be blocked server-side</li>
              <li>Existing reservations remain unaffected — only new bookings are blocked</li>
              <li>Remember to resume reservations once you are ready to accept bookings again</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
