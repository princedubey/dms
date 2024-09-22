const mongoose = require('mongoose');

const extractionSchema = new mongoose.Schema({
  deal_name: {
    type: String,
    default: ""
  },
  total_deal_amount: {
    type: [String], // Array of strings for currency values
    default: [""]
  },
  start_date: {
    type: String,
    default: ""
  },
  end_date: {
    type: String,
    default: ""
  },
  description: {
    type: String,
    default: ""
  },
  campaign_objective: {
    type: String,
    default: ""
  },
  campaign_kpis: {
    type: [String], // Array of strings for KPIs
    default: [""]
  },
  target_audience: {
    type: [String], // Array of strings for target audience
    default: [""]
  },
  geo_targeting: {
    type: [String], // Array of strings for geographic targeting
    default: [""]
  },
  assets_available: {
    type: String,
    default: ""
  },
  viewability: {
    type: String,
    default: ""
  },
  ad_fraud_monitoring: {
    type: String,
    default: ""
  },
  ad_blocking: {
    type: String,
    default: ""
  }
}, {
  timestamps: true,
  versionKey: false,
});

// Avoid re-defining the model
const Extraction = mongoose.models.Extraction || mongoose.model('Extraction', extractionSchema, 'extraction');

module.exports = Extraction;
