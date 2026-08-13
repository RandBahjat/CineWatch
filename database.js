const mongoose = require('mongoose');

// The connection string provided by the user
const MONGO_URI = "mongodb+srv://randbahjat88_db_user:RIiS8vh91Jqz3sRl3@cluster0.kw7xzpk.mongodb.net/cinewatch?retryWrites=true&w=majority&appName=Cluster0";

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to MongoDB database successfully');
}).catch((err) => {
  console.error('Error connecting to MongoDB:', err);
});

// Define the User schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  email: { type: String, unique: true },
  password_hash: { type: String, required: true },
  avatar: { type: String, default: '??' },
  favorites: { type: Array, default: [] },
  continueWatching: { type: Object, default: {} },
  created_at: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

module.exports = { User };
