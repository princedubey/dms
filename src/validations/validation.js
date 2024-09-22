import Joi from "joi";

// Define Joi validation schema for Extraction data
export const extractionValidationSchema = Joi.object({
  deal_name: Joi.string().allow(""),
  total_deal_amount: Joi.array().items(Joi.string().allow("")),
  start_date: Joi.string().allow(""),
  end_date: Joi.string().allow(""),
  description: Joi.string().allow(""),
  campaign_objective: Joi.string().allow(""),
  campaign_kpis: Joi.array().items(Joi.string().allow("")),
  target_audience: Joi.array().items(Joi.string().allow("")),
  geo_targeting: Joi.array().items(Joi.string().allow("")),
  assets_available: Joi.string().allow(""),
  viewability: Joi.string().allow(""),
  ad_fraud_monitoring: Joi.string().allow(""),
  ad_blocking: Joi.string().allow(""),
});