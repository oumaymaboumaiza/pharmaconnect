const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const adminRoutes = require('./routes/adminRoutes');
const pharmacyRoutes = require('./routes/pharmacyRoutes');
const doctorRoutes = require('./routes/doctorRoutes');
const supplierRoutes = require('./routes/supplierRoutes');
const userRoutes = require('./routes/userRoutes');
const ordonnanceRoutes = require('./routes/ordonnanceRoutes');




dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/',userRoutes);

app.use('/api/admin', adminRoutes); // ✅ routes admin
app.use('/api/pharmacy', pharmacyRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/suppliers', supplierRoutes);
app.use('/api/ordonnances', ordonnanceRoutes); 

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

app.get('/', (req, res) => {
  res.send('Bienvenue sur l’API PharmaConnect 👨‍⚕️💊');
});