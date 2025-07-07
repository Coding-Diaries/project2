const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// MySQL Connection
const db = mysql.createConnection({    host: 'localhost',
    user: 'root',
    password: 'Aarti@121',  // Make sure to use your own MySQL password
    database: 'alumni_db'   // Ensure this is the correct database name
});

db.connect((err) => {
    if (err) {
        console.error('Database Connection Failed:', err);
    } else {
        console.log('Connected to MySQL Database');
    }
});

// Add Profile Endpoint
app.post('/addProfile', (req, res) => {
    const { enrollment, name, batch, linkedin, gender, father_name, mother_name, dob, company_placed, passing_year, package } = req.body;

    if (!enrollment || !name || !batch || !linkedin || !gender || !father_name || !mother_name || !dob || !company_placed || !passing_year) {
        return res.status(400).json({ message: 'All required fields must be provided' });
    }

    const query = 'INSERT INTO profiles (enrollment, name, batch, linkedin, gender, father_name, mother_name, dob, company_placed, passing_year, package) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
    
    db.query(query, [enrollment, name, batch, linkedin, gender, father_name, mother_name, dob, company_placed, passing_year, package], (err, result) => {
        if (err) {
            console.error('Error inserting data:', err);
            return res.status(500).json({ message: 'Database error' });
        } else {
            res.json({ message: 'Profile added successfully!' });
        }
    });
});

// Fetch All Profiles Endpoint
app.get('/fetchProfiles', (req, res) => {
    const query = 'SELECT * FROM profiles';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching data:', err);
            return res.status(500).json({ message: 'Database error' });
        } else {
            res.json(results);
        }
    });
});

// **Search Profile by Name and Batch**
app.get('/searchProfile', (req, res) => {
    const { name, batch } = req.query;

    if (!name || !batch) {
        return res.status(400).json({ message: 'Please provide name and batch' });
    }

    const query = 'SELECT linkedin FROM profiles WHERE name = ? AND batch = ?';
    db.query(query, [name, batch], (err, results) => {
        if (err) {
            console.error('Error searching profile:', err);
            return res.status(500).json({ message: 'Database error' });
        } else if (results.length === 0) {
            return res.status(404).json({ message: 'Profile not found' });
        } else {
            res.json({ linkedin: results[0].linkedin }); // Return the LinkedIn URL of the matched profile
        }
    });
});

// Start Server
app.listen(3000, () => {
    console.log('Server running on port 3000');
});