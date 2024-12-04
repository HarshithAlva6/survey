require('dotenv').config();
const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 5000;

// MongoDB Connection
const mongoURI = process.env.MONGO_URI; // Load the URI from the .env file
mongoose.connect(mongoURI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Error connecting to MongoDB:', err));
  
app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
    res.send('Welcome to the homepage!');
});

const surveys = [];
const patients = [];
const patientRes = {};

app.get('/api/surveys', (req,res) => {
  if(!surveys) {
    return res.status(404).json({ error: 'No Surveys found' });
  }
  res.status(200).json(surveys);
});

app.get('/api/surveys/:id', (req,res) => {
  const {id} = req.params;
  const survey = surveys.find((sur) => sur.id == id);
  if (!survey) {
    return res.status(404).json({ error: 'Survey not found' });
}
res.status(200).json(survey);
});

app.post('/api/surveys', (req, res) => {
  const { title, questions } = req.body; 
  const surId = surveys.length + 1;
  const newSurveys = {id: surId.toString(), title, questions};
  console.log('Received Survey Data:', newSurveys );
  surveys.push(newSurveys);
  res.status(201).json({
      message: 'Survey received successfully!',
      surveys: surveys,
      survey: newSurveys,
  });
});

app.get('/api/patients', (req,res) => {
  if(!patients) {
    return res.status(404).json({ error: 'No Patients found' });
  }
  res.status(200).json(patients);
});

app.get('/api/patients/responses', (req,res) =>{
  return res.status(200).json({
    message: `Responses fetched for patients`,
    data: {
      responses: patientRes
    },
  });
})

app.get('/api/patients/:id', (req,res) => {
  const {id} = req.params;
  const patient = patients.find((pat) => pat.id == id);
  if (!patient) {
    return res.status(404).json({ error: 'Patient not found' });
}
res.status(200).json(patient);
});
app.post('/api/patients', (req, res) => {
  const {name, email} = req.body;
  const existingPatient = patients.find(
    (patient) => patient.name === name && patient.email === email
);
if (existingPatient) {
    return res.status(200).json({
        message: 'Patient already exists with the same name and email!',
        patient: existingPatient
    });
}
  const patient = {id: patients.length+1, name, email, assignedSurveys: []};
  patients.push(patient);
  res.status(201).json({
    message: 'Patient recieved successfully!',
    patients: patients,
    patient: patient
  });
})

app.get('/api/patients/:id/assign-survey', (req, res) => {
  const { id } = req.params; 
  console.log(id);
  const patient = patients.find((pat) => pat.id == id);
  console.log(patient, patient.assignedSurveys);

  if (!patient.assignedSurveys || patient.assignedSurveys.length === 0) {
    return res.status(200).json({
        message: 'No surveys assigned to this patient',
        allSurveys: [],
    });
  }
    const assignedSurveyDetails = patient.assignedSurveys.map(({surveyId, status}) => {
    const survey = surveys.find((sur) => sur.id == surveyId);
    return survey ? { ...survey, status } : null;
  }).filter((survey) => survey !== null);
    res.status(200).json({
        message: 'Surveys retrieved successfully',
        allSurveys: assignedSurveyDetails,
    });
}); 

app.post('/api/patients/:id/assign-survey', (req, res) => {
  const { id } = req.params; 
  const { surveyId } = req.body; 

  if (!patientRes[id]) {
    patientRes[id] = {};
  }
  if (!patientRes[id][surveyId]) {
    patientRes[id][surveyId] = {};
  }
  const patient = patients.find((pat) => pat.id == id);
  if (!patient) {
    return res.status(404).json({ error: 'Patient not found' });
  }

  const survey = surveys.find((sur) => sur.id == surveyId);
  if (!survey) {
    return res.status(404).json({ error: 'Survey not found' });
  }

  if (patient.assignedSurveys.includes(surveyId)) {
    return res.status(200).json({ message: 'Survey already assigned to the patient', patient });
  }
  patient.assignedSurveys.push({
    surveyId,
    status: "Pending"});

  res.status(200).json({
    message: `Survey with ID ${surveyId} assigned to patient with ID ${id}`,
    patient,
  });
});

app.patch('/api/patients/:id/assign-survey', (req, res) => {
  const { id } = req.params; 
  const { survId } = req.body; 

  const patient = patients.find((pat) => pat.id == id);
  const assignedSurvey = patient.assignedSurveys.find((survey) => survey.surveyId == survId);
  assignedSurvey.status = "Completed";

  res.status(200).json({
      message: `Survey with ID ${survId} has been marked as Completed for patient with ID ${id}`,
      patient,
  });
});

app.post('/api/patients/:id/responses', (req,res) =>{
  const { id } = req.params;
  const {responses, survId} = req.body;

  patientRes[id][survId] = {
    responses
  }
  console.log(patientRes);
  return res.status(201).json({
    message: `Responses recorded for patient ID ${id}`,
    data: {
      id,
      survId, 
      responses,
      patientRes: patientRes
    },
  });
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
