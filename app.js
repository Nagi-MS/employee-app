// Task1: initiate app and run server at 3000
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const path=require('path');
app.use(express.static(path.join(__dirname+'/dist/FrontEnd')));
// (added) same folder with the other casing, so it also works on case-sensitive systems (Linux)
app.use(express.static(path.join(__dirname+'/dist/Frontend')));
// Task2: create mongoDB connection 

// Replace with your MongoDB Atlas connection string (or set MONGODB_URI env variable)
const MONGODB_URI = process.env.MONGODB_URI ||
    'mongodb+srv://<username>:<password>@<cluster>.mongodb.net/employeeDB?retryWrites=true&w=majority';

mongoose.connect(MONGODB_URI)
    .then(() => console.log('Connected to MongoDB Atlas'))
    .catch((err) => console.log('MongoDB connection error:', err.message));

const employeeSchema = new mongoose.Schema({
    name: String,
    location: String,
    position: String,
    salary: Number
});
const Employee = mongoose.model('Employee', employeeSchema);

//Task 2 : write api with error handling and appropriate api mentioned in the TODO below







//TODO: get data from db  using api '/api/employeelist'
app.get('/api/employeelist', async (req, res) => {
    try {
        const employees = await Employee.find();
        res.status(200).send(employees);
    } catch (error) {
        res.status(500).send({ message: 'Failed to fetch employees', error: error.message });
    }
});



//TODO: get single data from db  using api '/api/employeelist/:id'
app.get('/api/employeelist/:id', async (req, res) => {
    try {
        const employee = await Employee.findById(req.params.id);
        if (!employee) {
            return res.status(404).send({ message: 'Employee not found' });
        }
        res.status(200).send(employee);
    } catch (error) {
        res.status(500).send({ message: 'Failed to fetch employee', error: error.message });
    }
});



//TODO: send data from db using api '/api/employeelist'
//Request body format:{name:'',location:'',position:'',salary:''}
app.post('/api/employeelist', async (req, res) => {
    try {
        const { name, location, position, salary } = req.body;
        const employee = new Employee({ name, location, position, salary });
        const saved = await employee.save();
        res.status(201).send(saved);
    } catch (error) {
        res.status(500).send({ message: 'Failed to add employee', error: error.message });
    }
});



//TODO: delete a employee data from db by using api '/api/employeelist/:id'
app.delete('/api/employeelist/:id', async (req, res) => {
    try {
        const deleted = await Employee.findByIdAndDelete(req.params.id);
        if (!deleted) {
            return res.status(404).send({ message: 'Employee not found' });
        }
        res.status(200).send({ message: 'Employee deleted successfully' });
    } catch (error) {
        res.status(500).send({ message: 'Failed to delete employee', error: error.message });
    }
});



//TODO: Update  a employee data from db by using api '/api/employeelist'
//Request body format:{name:'',location:'',position:'',salary:''}
app.put('/api/employeelist', async (req, res) => {
    try {
        const { _id, name, location, position, salary } = req.body;
        const updated = await Employee.findByIdAndUpdate(
            _id,
            { $set: { name, location, position, salary } },
            { new: true }
        );
        if (!updated) {
            return res.status(404).send({ message: 'Employee not found' });
        }
        res.status(200).send(updated);
    } catch (error) {
        res.status(500).send({ message: 'Failed to update employee', error: error.message });
    }
});


//! dont delete this code. it connects the front end file.
app.get('/*', function (req, res) {
    res.sendFile(path.join(__dirname + '/dist/Frontend/index.html'));
});

app.listen(3000, () => {
    console.log('Server running on port 3000');
});

