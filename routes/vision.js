var express = require("express");
var router = express.Router();
require("dotenv").config();
const {
  RekognitionClient,
  DetectLabelsCommand,
} = require("@aws-sdk/client-rekognition");

const common_errors = {
  CredentialsProviderError: 'Error loading credentials from provider chain',
  ThrottlingError: 'Request was throttled, please retry with exponential backoff',
  AccessDeniedException: 'The credentials used do not have permission to perform this action',
  ValidationException: 'The input parameters failed validation checks',
  ResourceNotFoundException: 'The requested resource was not found',  
  ServiceUnavailableError: 'The service is temporarily unavailable, please retry',
  NotImplementedException: 'The requested feature is not implemented for this service',
  InvalidS3ObjectException: 'The S3 object specified is invalid or improperly formatted',
  ImageTooLargeException: 'Input image size exceeds allowed limit for Rekognition',
  ProvisionedThroughputExceededException: 'Request rate too high for provisioned throughput levels' 
}

router.post("/classify", async function (req, res, next) {
  // DON'T return the hardcoded response after implementing the backend
  // let response = ["shoe", "red", "nike"];

  // Your code starts here //

  const { data } = req.files.file;
  
  const client = new RekognitionClient({ region: "ap-southeast-1" });

  const params = {
    Image: {
      Bytes: data,
    },
    MaxLabels: 5,
    MinConfidence: 85,
  };

  try {
    const detect_obj = new DetectLabelsCommand(params);

    const response = await client.send(detect_obj);

    const labels = response.Labels.map((label) => label.Name);

    res.json({
      labels: labels,
    });
  } catch (err) {
    const message = common_errors[err.name];
    res.status(500).json({ error: message || "Unable to process image" });
  }

  // Your code ends here //
});

module.exports = router;
