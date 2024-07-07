const mongoose = require('mongoose');

// schema
const userSchema = mongoose.Schema({
  email: {
    type: String,
    unique: true,
  },
  password: {
    type: String,
    minLength: 5,
  },
  googleId: {
    type: String,
    unique: true,
    sparse: true,
  },
});

userSchema.methods.comparePassword = function (clientPassword, cb) {
  // clientPassword = client가 입력한 password
  // this.password = db에서 가져온 password
  if (clientPassword === this.password) {
    cb(null, true);
  } else {
    cb(null, false);
  }
  return cb({ error: 'error' });
};

//model 생성
const User = mongoose.model('User', userSchema);

module.exports = User;
