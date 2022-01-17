require("dotenv").config();

const express = require("express");
const { GoogleSpreadsheet } = require("google-spreadsheet");
const cors = require("cors");
const app = express();
app.use(express.json());
app.use(cors());
const workbook = new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID);

app.post("/", async (req, res) => {
  try {
    await workbook.useServiceAccountAuth({
      client_email: process.env.CLIENT_EMAIL,
      private_key: process.env.PRIVATE_KEY,
    });

    await workbook.loadInfo();

    const worksheet = workbook.sheetsByIndex[0];
    await worksheet.addRows([
      {
        Name: req.body.name,
        Email: req.body.email,
        Phone: req.body.phone,
        City: req.body.city,
        Experience: req.body.experience,
      },
    ]);

    res.json({
      message: "Application submitted successfully.",
    });
  } catch (_) {
    res.status(500).json({
      message: "The form could not be submitted. Please try again later.",
    });
  }
});

app.listen(8000);
