const express = require('express');

const app = express();
const PORT = 8000;

// ROUTES

app.listen(PORT, () => console.log(`Server started at PORT: ${PORT}`));