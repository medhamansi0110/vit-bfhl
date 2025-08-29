const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json()); // parse JSON bodies

// TODO: Put your actual details here:
const USER_ID = "medha_mansi_01102004".toLowerCase(); // e.g. "john_doe_17091999"
const EMAIL = "medha.mansi2022@vitstudent.ac.in";
const ROLL_NUMBER = "22BCE0468";

// Helpers
const isNumericString = (s) => /^[0-9]+$/.test(s);
const isAlphaString = (s) => /^[A-Za-z]+$/.test(s);

app.post("/bfhl", (req, res) => {
  try {
    const body = req.body || {};
    const arr = Array.isArray(body.data) ? body.data : null;

    if (!arr) {
      return res.status(200).json({
        is_success: false,
        user_id: USER_ID,
        email: EMAIL,
        roll_number: ROLL_NUMBER,
        odd_numbers: [],
        even_numbers: [],
        alphabets: [],
        special_characters: [],
        sum: "0",
        concat_string: "",
        message: 'Invalid input. Expecting: { "data": [ ... ] }'
      });
    }

    const odd_numbers = [];
    const even_numbers = [];
    const alphabets = [];
    const special_characters = [];
    let sum = 0;

    // Collect letters from ALL alphabetic tokens, in encounter order
    const letterChars = [];

    for (const item of arr) {
      const token = String(item);

      if (isNumericString(token)) {
        const n = parseInt(token, 10);
        sum += n;
        if (n % 2 === 0) {
          even_numbers.push(token); // keep as string
        } else {
          odd_numbers.push(token); // keep as string
        }
      } else if (isAlphaString(token)) {
        alphabets.push(token.toUpperCase());
        for (const ch of token) letterChars.push(ch);
      } else {
        special_characters.push(token);
      }
    }

    // Build concat_string: reverse letters, alternating caps starting UPPER
    const reversed = letterChars.slice().reverse().map((ch) => ch.toUpperCase());
    const alt = reversed.map((ch, i) => (i % 2 === 0 ? ch.toUpperCase() : ch.toLowerCase()));
    const concat_string = alt.join("");

    return res.status(200).json({
      is_success: true,
      user_id: USER_ID,
      email: EMAIL,
      roll_number: ROLL_NUMBER,
      odd_numbers,
      even_numbers,
      alphabets,
      special_characters,
      sum: String(sum), // sum must be string
      concat_string
    });
  } catch (err) {
    return res.status(200).json({
      is_success: false,
      user_id: USER_ID,
      email: EMAIL,
      roll_number: ROLL_NUMBER,
      odd_numbers: [],
      even_numbers: [],
      alphabets: [],
      special_characters: [],
      sum: "0",
      concat_string: "",
      message: "Server error"
    });
  }
});

// Health-tip: keep only /bfhl route as required
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`API running on :${PORT}`));
