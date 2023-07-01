
// const multer = require("multer");
const mysql = require('mysql2');
const { uploadMiddleware } = require('../middleware/uploadMiddleware');
const session = require('express-session');

// Create a connection pool
const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'userDB',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});


// Function to check if email already exists in the database
function checkEmailExists(email) {
  return new Promise((resolve, reject) => {
    const sql = "SELECT COUNT(*) AS count FROM userDetails WHERE email = ?";
    db.query(sql, [email], (err, result) => {
      if (err) {
        reject(err);
      } else {
        const count = result[0].count;
        resolve(count > 0);
      }
    });
  });
}



module.exports.register = async(req, res) => {

    const { id, name, email, gender, phone, password , date} = req.body;
    const profilepic = req.file ? req.file.filename : 'profilepic';

    const sql =
      "INSERT INTO userDetails (id, name, email, gender, phone, password,profilepic, date,status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";

    const values = [id, name, email, gender, phone, password,profilepic, date,"pending"];

     // Check if any required fields are missing
      if (!name || !email || !gender || !phone || !password || !profilepic || !date) {
         res.status(400).send({ message: "Missing required fields" });
         return ;
      }

        // Check if the email already exists in the database
        const emailExists =await  checkEmailExists(email);

              if (emailExists) {
          res.status(409).send({ message: "Email already exists" });
          return ;
        }

    db.query(sql, values, (err, result) => {
      if (err) {
         res.status(500).send({ error: err.message });
         return ;
      }
      
      res.status(201).send(result);
      req.session.userId = session;
      return ;
    });
    return;
};

module.exports.registerWithUpload = [uploadMiddleware, module.exports.register];

module.exports.login = (req, res) => {

  const sql = "SELECT * FROM userDetails WHERE email = ? AND password = ?";

  if ( !req.body.email || ! req.body.password ) {
     res.status(400).send({ message: "Missing required fields" });
  }

  db.query(sql, [req.body.email, req.body.password], (err, data) => {
       
    if (err) {
         res.send("Error", err);
      }
      if (data.length > 0) {
         
         const sessionId = req.session.id;
         res.cookie('sessionId', sessionId);       // Set the session ID as a cookie
         res.status(200).send(data);             
         return;
      } else {
         res.send("Details Does not match");
      }
  });
};

module.exports.profile = (req, res) => {

  const sql = 'SELECT * FROM userDetails';

  db.query(sql, (err, results) => {
    if (err) {
       res.status(500).send({ error: err.message });
    }
    res.send(results);
  });
}

module.exports.fetchUser = (req,res) =>{
  
    const id = req.params.id;
  
    const sql = 'SELECT * FROM userDetails WHERE id = ?';
  
    db.query(sql, [id], (err, results) => {
      if (err) {
        console.error('Error fetching user details: ', err);
         res.status(500).send({ error: err.message });
      }
  
      if (results.length === 0) {
         res.status(404).send({ message: 'User not found' });
      }
  
      const user = results[0];
      res.send(user);
    });
}

module.exports.editUser = (req, res) => {
 
  const id = req.params.id;
  const { name, email, phone, password } = req.body;

  const profilepic = req.file ? req.file.filename : 'profilepic';

  const sql = "UPDATE userDetails SET name = ?, email = ?, phone = ?, password = ?, profilepic = ? WHERE id = ?";

   // Check if any required fields are missing
  if (!name || !email || !phone || !password || !profilepic) {
    res.status(400).send({ message: "Missing required fields" });
    return;
  }

  db.query(sql, [name, email, phone, password, profilepic, id ], (err, result) => {
    if (err) {
      res.status(500).send({ error: err.message });
      return;
    }

    if (result.affectedRows === 0) {
      res.status(404).send({ message: "User not found" });
      return;
    }

    res.status(200).send({ message: "User updated successfully" });
    return;
  });
  return;
};

module.exports.editUserUpload = [uploadMiddleware , module.exports.editUser];

module.exports.deleteUser = (req, res) => {
  const userId = req.params.id;
  const sql = 'DELETE FROM userDetails WHERE id = ?';

  db.query(sql, [userId], (err, result) => {
    if (err) {
       res.status(500).send({ error: err.message });
       return ;
    }
    res.send({ message: 'User deleted successfully.' });
    return ;
  });
}

module.exports.logout = (req, res)=>{
  
  req.session.destroy((err) => {
    if (err) {
      // Handle error if session couldn't be destroyed
       res.status(500).send({ error: 'An error occurred during logout.' });
       return ;
    }
    
    // Session destroyed successfully, respond with success message
     res.status(200).send({ message: 'Logout successful.' });
     return ;
  });
}
