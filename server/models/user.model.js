const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
    maxlength: 30
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    validate: {
      validator: function(v) {
        const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return emailRegex.test(v);
      },
      message: props => `${props.value} is not a valid email address!`
    },
  },
  password: {
    type: String,
    required: true,
    minlength: 5,
    select: false // when querying the user, the password won't be returned unless explicitly asked for
  },
  profilePic:{type:String,default:"https://cdn3.iconfinder.com/data/icons/3d-printing-icon-set/512/User.png"}
},{timestamps:true,versionKey:false});

// Hash the password before saving it to the database
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
}

);

const UserModel = mongoose.model('User', userSchema);

module.exports = {UserModel};
