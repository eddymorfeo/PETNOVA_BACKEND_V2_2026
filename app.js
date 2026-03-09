require('dotenv').config();

const express = require('express');

const app = express();
const port = Number(process.env.PORT || 3003);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'PETNOVA backend running correctly'
  });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});