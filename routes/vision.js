var express = require("express");
var router = express.Router();
require("dotenv").config();
const {
  RekognitionClient,
  DetectLabelsCommand,
} = require("@aws-sdk/client-rekognition");

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
    const response = await client.send(new DetectLabelsCommand(params));

    const labels = response.Labels.map((label) => label.Name);

    res.json({
      labels: labels,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Unable to process image" });
  }

  // Your code ends here //
});

module.exports = router;
