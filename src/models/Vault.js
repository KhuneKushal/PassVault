import mongoose from 'mongoose';

const vaultSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  encryptedData: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt timestamp before saving
vaultSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

const Vault = mongoose.models.Vault || mongoose.model('Vault', vaultSchema);

export default Vault;