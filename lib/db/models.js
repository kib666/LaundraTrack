import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

// User Schema
const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      required: false,
      trim: true,
    },
    role: {
      type: String,
      enum: ['customer', 'staff', 'admin', 'superadmin'],
      default: 'customer',
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'active'],
      default: 'pending',
    },
    profileImage: String,
    address: String,
    city: String,
    state: String,
    zipCode: String,
    isActive: {
      type: Boolean,
      default: true,
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    approvedAt: Date,
    rejectionReason: String,
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Remove password from response
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

// Order Schema
const orderSchema = new mongoose.Schema(
  {
    trackingNumber: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    staffId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    status: {
      type: String,
      enum: [
        'pending',
        'confirmed',
        'in_progress',
        'ready_for_pickup',
        'picked_up',
        'delivered',
        'cancelled',
      ],
      default: 'pending',
    },
    items: [
      {
        name: String,
        quantity: Number,
        price: Number,
      },
    ],
    totalAmount: {
      type: Number,
      required: true,
    },
    description: String,
    notes: String,
    pickupDate: Date,
    deliveryDate: Date,
    preferredDate: {
      type: Date,
    },
    pickupAddress: {
      type: String,
      trim: true,
    },
    deliveryAddress: {
      type: String,
      trim: true,
    },
    fulfillmentType: {
      type: String,
      enum: ['pickup', 'delivery'],
      default: 'pickup',
    },
    weight: {
      type: Number,
      min: 0,
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'refunded'],
      default: 'pending',
    },
    paymentMethod: String,
    serviceType: {
      type: String,
      enum: ['wash', 'dry-clean', 'iron', 'combo'],
      default: 'wash',
    },
  },
  { timestamps: true }
);

// Appointment Schema
const appointmentSchema = new mongoose.Schema(
  {
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    type: {
      type: String,
      enum: ['pickup', 'delivery'],
      required: true,
    },
    status: {
      type: String,
      enum: ['available', 'booked', 'completed', 'cancelled'],
      default: 'available',
    },
    date: {
      type: Date,
      required: true,
    },
    timeSlot: {
      type: String,
      required: true,
      enum: ['08:00-10:00', '10:00-12:00', '14:00-16:00', '16:00-18:00'],
    },
    notes: String,
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
    },
  },
  { timestamps: true }
);

// Create models
const User = mongoose.models.User || mongoose.model('User', userSchema);
const Order = mongoose.models.Order || mongoose.model('Order', orderSchema);
const Appointment = mongoose.models.Appointment || mongoose.model('Appointment', appointmentSchema);

export { User, Order, Appointment };
