// ===== CONSTANTS - Dễ dàng thay đổi và sync với database =====
export const SEAT_TYPES = {
  VIP: { id: 'VIP', label: 'VIP', price: 100000, color: 'amber' },
  STANDARD: { id: 'STANDARD', label: 'Standard', price: 65000, color: 'rose' }
};

export const SEAT_STATUS = {
  AVAILABLE: 'available',
  SELECTED: 'selected',
  BOOKED: 'booked'
};