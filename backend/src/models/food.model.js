const mongoose = require ('mongoose');

const foodPartnerSchema = new mongoose.Schema (
  {
    name: {
      type: String,
      required: true,
    },
    video: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    foodPartner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'foodPartner',
      required: true,
    },
  },
  {timestamps: true}
);

const fooditemModel = mongoose.model ('fooditem', foodPartnerSchema);

module.exports = fooditemModel;
