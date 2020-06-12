var mongoose = require('mongoose');

var LogoSchema = new mongoose.Schema({
  id: String,
  text: String, // modified
  color: String,
  fontSize: { type: Number, min: 2, max: 144 },
  backgroundColor: String,
  borderColor: String,
  borderThickness: { type: Number, min: 2, max: 40 },
  borderRadius: { type: Number, min: 2, max: 20 },
  margin: { type: Number, min: 2, max: 100 },
  padding: { type: Number, min: 2, max: 100 },
  img: String,
  dimension_horizontal: { type: Number},
  dimension_vertical: { type: Number},
  lastUpdate: { type: Date, default: Date.now },

});

module.exports = mongoose.model('Logo', LogoSchema);
