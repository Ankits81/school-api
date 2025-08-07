const db = require("../model/model");


function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // km
  const toRad = x => x * Math.PI / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Add School
exports.addSchool = async (req, res) => {


  const { name, address, latitude, longitude } = req.body;

  if (!name || !address || isNaN(latitude) || isNaN(longitude)) {
    return res.status(400).json({ message: 'Invalid input data' });
  }

  try {
    const [result] = await db.execute(
      'INSERT INTO schools (name, address, latitude, longitude) VALUES (?, ?, ?, ?)',
      [name, address, latitude, longitude]
    );
    res.status(201).json({ message: 'School added successfully', schoolId: result.insertId });
  } catch (err) {
  console.error('Database error:', err);                 // full error object
  console.error('Error type:', typeof err);              // check if it's an object
  console.error('Error keys:', Object.keys(err));        // see available properties
  console.error('Error JSON:', JSON.stringify(err));     // log the object safely

  res.status(500).json({ 
    message: 'Database error', 
    error: err.message || JSON.stringify(err) || 'Unknown error occurred'
  });
}


};

// List Schools by Proximity
exports.listSchools = async (req, res) => {
  console.log("recive request");
  
  const userLat = parseFloat(req.query.latitude);
  const userLon = parseFloat(req.query.longitude);

  if (isNaN(userLat) || isNaN(userLon)) {
    return res.status(400).json({ message: 'Invalid latitude or longitude' });
  }

  try {
    const [schools] = await db.execute('SELECT * FROM schools');
    const sorted = schools.map(school => ({
      ...school,
      distance: getDistance(userLat, userLon, school.latitude, school.longitude)
    })).sort((a, b) => a.distance - b.distance);

    res.json(sorted);
  } catch (err) {
    res.status(500).json({ message: 'Database error', error: err.message });
  }
};