/**
 * TypeScript Type Definitions
 * (Using JSDoc for type hints in JavaScript projects)
 */

/**
 * @typedef {Object} User
 * @property {string} id - User ID
 * @property {string} email - User email
 * @property {string} firstName - First name
 * @property {string} lastName - Last name
 * @property {string} phone - Phone number
 * @property {'admin'|'staff'|'customer'} role - User role
 * @property {boolean} isActive - Is user active
 * @property {Date} createdAt - Created timestamp
 * @property {Date} updatedAt - Updated timestamp
 */

/**
 * @typedef {Object} Order
 * @property {string} id - Order ID
 * @property {string} trackingNumber - Tracking number
 * @property {string} customerId - Customer ID
 * @property {string} staffId - Assigned staff ID
 * @property {'pending'|'confirmed'|'in_progress'|'ready_for_pickup'|'picked_up'|'delivered'|'cancelled'} status - Order status
 * @property {number} totalAmount - Total amount
 * @property {string} description - Order description
 * @property {Date} pickupDate - Pickup date
 * @property {Date} deliveryDate - Delivery date
 * @property {string} pickupAddress - Pickup address
 * @property {string} deliveryAddress - Delivery address
 * @property {Date} createdAt - Created timestamp
 * @property {Date} updatedAt - Updated timestamp
 */

/**
 * @typedef {Object} Appointment
 * @property {string} id - Appointment ID
 * @property {string} customerId - Customer ID
 * @property {'available'|'booked'|'completed'|'cancelled'} status - Appointment status
 * @property {Date} date - Appointment date
 * @property {string} timeSlot - Time slot
 * @property {'pickup'|'delivery'} type - Appointment type
 * @property {string} notes - Additional notes
 * @property {Date} createdAt - Created timestamp
 * @property {Date} updatedAt - Updated timestamp
 */

/**
 * @typedef {Object} APIResponse
 * @property {boolean} success - Is request successful
 * @property {any} data - Response data
 * @property {string} message - Response message
 * @property {string} [error] - Error message if any
 */

/**
 * @typedef {Object} LoginRequest
 * @property {string} email - User email
 * @property {string} password - User password
 */

/**
 * @typedef {Object} RegisterRequest
 * @property {string} email - User email
 * @property {string} password - User password
 * @property {string} firstName - First name
 * @property {string} lastName - Last name
 * @property {string} phone - Phone number
 * @property {'admin'|'staff'|'customer'} role - User role
 */

export {};