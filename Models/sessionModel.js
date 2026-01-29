const { default: mongoose, Schema } = require("mongoose");

const Session = mongoose.models.Session || mongoose.model('Session', {
    userId:{
        type: Schema.Types.ObjectId,
        required: true,
    },
    
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 60 * 60 * 24 * 7// TTL index (expiry in seconds will be set dynamically)
  }
})

export default Session