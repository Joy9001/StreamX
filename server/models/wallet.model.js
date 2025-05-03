import mongoose from 'mongoose';

const walletSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    unique: true
  },
  type: {
    type: String,
    enum: ['Editor', 'Owner'],
    required: true
  },
  balance: {
    type: Number,
    default: 1000,
    required: true
  },
});

const Wallet = mongoose.model('Wallet', walletSchema);

export default Wallet; 