var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var bcrypt = require('bcrypt');

var userSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, minlength: 5, required: true },
    isAdmin: { type: Boolean, required: true },
    isBlocked: { type: Boolean, required: true, default: false },
    cart: { type: [Schema.Types.ObjectId], ref: 'Product' },
    
  },{ timestamps: true }
);

// in order to hash it we use bcrypt npm package
// custom pre save hooks to hash the password
// if there is a password, the only if condition excute
userSchema.pre('save', function(next) {
  if(this.password && this.isModified('password')) {
      console.log(this, 'before hashing')
    bcrypt.hash(this.password, 10, (err, hashed) => { // take the plain password
      // second argument takes a salt round, it basically a random string(secret) which is used to hash the password
      if (err) return next(err);
      this.password = hashed;
      // console.log(this, 'after hashing');
      next();
    }); 
  } else {
    next();//call next because excution doesn't hold on presave hooks 
  }
});

// Method to verify the paswword 
userSchema.methods.verifyPassword = function(password, cb) {
    // second password is going to hash version of password
    bcrypt.compare(password, this.password, (err, result) => {
      return cb(err, result);
    })
}

module.exports = mongoose.model('User', userSchema);