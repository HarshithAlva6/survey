require('dotenv').config();
const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const Survey = require('./models/Survey');
const Patient = require('./models/Patient');
const Response = require('./models/Response');

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

//const surveys = [];
//const patients = [];
//const patientRes = {};

app.get('/api/surveys', async (req,res) => {
  const surveys = await Survey.find().sort({ _id: -1 });
  if(!surveys) {
    return res.status(404).json({ error: 'No Surveys found' });
  }
  res.status(200).json(surveys);
});

app.get('/api/surveys/:id', async (req,res) => {
  const {id} = req.params;
  //const survey = surveys.find((sur) => sur.id == id);
  const survey = await Survey.findById(id);
  if (!survey) {
    return res.status(404).json({ error: 'Survey not found' });
}
res.status(200).json(survey);
});

app.post('/api/surveys', async (req, res) => {
  const { title, questions } = req.body; 
  //const surId = surveys.length + 1;
  const newSurveys = new Survey({title, questions});
  await newSurveys.save();
  //const newSurveys = {id: surId.toString(), title, questions};
  //surveys.push(newSurveys);
  console.log('Received Survey Data:', newSurveys );
  res.status(201).json({
      message: 'Survey received successfully!',
      survey: newSurveys,
  });
});

app.get('/api/patients', async (req,res) => {
  const patients = await Patient.find();
  if(!patients) {
    return res.status(404).json({ error: 'No Patients found' });
  }
  res.status(200).json(patients);
});

app.get('/api/patients/responses', async (req,res) =>{
  const patientRes = await Response.find().sort({ _id: -1 });
  return res.status(200).json({
    message: `Responses fetched for patients`,
    data: {
      responses: patientRes
    }
  });
})

app.get('/api/patients/:id', async (req,res) => {
  const {id} = req.params;
  //const patient = patients.find((pat) => pat.id == id);
  const patient = await Patient.findById(id);
  if (!patient) {
    return res.status(404).json({ error: 'Patient not found' });
}
res.status(200).json(patient);
});

app.post('/api/patients', async (req, res) => {
  const {name, email} = req.body;
  //const existingPatient = patients.find(
  //  (patient) => patient.name === name && patient.email === email
  //);
  const existingPatient = await Patient.findOne({name, email});
if (existingPatient) {
    return res.status(200).json({
        message: 'Patient already exists with the same name and email!',
        patient: existingPatient
    });
}
  //const patient = {id: patients.length+1, name, email, assignedSurveys: []};
  //patients.push(patient);
  const patient = new Patient({name, email});
  await patient.save();
  res.status(201).json({
    message: 'Patient recieved successfully!',
    patient: patient
  });
})

app.get('/api/patients/:id/assign-survey', async (req, res) => {
  const { id } = req.params; 
  //const patient = patients.find((pat) => pat.id == id);
  const patient = await Patient.findById(id);
  if (!patient.assignedSurveys || patient.assignedSurveys.length === 0) {
    return res.status(200).json({
        message: 'No surveys assigned to this patient',
        allSurveys: [],
    });
  }
  const assignedSurveyDetails = await Promise.all(
    patient.assignedSurveys.map(async ({ surveyId, status }) => {
        const survey = await Survey.findById(surveyId);
        return survey ? { ...survey.toObject(), status } : null; // Ensure `survey` is converted to a plain object
    })
  );
  const filteredSurveys = assignedSurveyDetails.filter((survey) => survey !== null);

  res.status(200).json({
      message: 'Surveys retrieved successfully',
      allSurveys: filteredSurveys,
  });
}); 

app.post('/api/patients/:id/assign-survey', async (req, res) => {
  const { id } = req.params; 
  const { surveyId } = req.body; 

  //if (!patientRes[id]) {
  //  patientRes[id] = {};
  //}
  //if (!patientRes[id][surveyId]) {
  //  patientRes[id][surveyId] = {};
  //}
  //const patient = patients.find((pat) => pat.id == id);
  const patient = await Patient.findById(id);
  if (!patient) {
    return res.status(404).json({ error: 'Patient not found' });
  }

  //const survey = surveys.find((sur) => sur.id == surveyId);
  const survey = await Survey.findById(surveyId);
  if (!survey) {
    return res.status(404).json({ error: 'Survey not found' });
  }

  if (patient.assignedSurveys.includes(surveyId)) {
    return res.status(200).json({ message: 'Survey already assigned to the patient', patient });
  }
  patient.assignedSurveys.push({
    surveyId,
    status: "Pending"});
  await patient.save();

  let newResponse = new Response({ finalRes: new Map() });
  newResponse.finalRes.set(id, {
    surveyId,
    responses: {
      placeholder: true, 
    },
  });
  
  await newResponse.save();
  
  // Log the saved document
  console.log("Saved Document:", await Response.findById(newResponse._id));
  

  res.status(200).json({
    message: `Survey with ID ${surveyId} assigned to patient with ID ${id}`,
    data: newResponse
  });
});

app.patch('/api/patients/:id/assign-survey', async (req, res) => {
  const { id } = req.params; 
  const { survId } = req.body; 

  //const patient = patients.find((pat) => pat.id == id);
  const patient = await Patient.findById(id);
  const assignedSurvey = patient.assignedSurveys.find((survey) => survey.surveyId == survId);
  assignedSurvey.status = "Completed";

  await patient.save();
  res.status(200).json({
      message: `Survey with ID ${survId} has been marked as Completed for patient with ID ${id}`,
      patient,
  });
});

app.post('/api/patients/:id/responses', async (req,res) =>{
  const { id } = req.params;
  const {responses, survId} = req.body;

  //patientRes[id][survId] = {
  //  responses
  //}
  let response = await Response.findOne({
    [`finalRes.${id}.surveyId`]: survId, // Dynamically match `id` and `surveyId`
  });  
  console.log(response, "Came?");
  if (!response) {
    response = new Response({ finalRes: new Map() });
  }

  // Ensure the `id` exists in `finalRes`
  if (!response.finalRes.has(id)) {
    response.finalRes.set(id, {
      surveyId: survId,
      responses: {}, // Initialize an empty `responses` object
    });
  }
  const entry = response.finalRes.get(id);
  console.log(entry, "ENTRY")
  entry.responses = {
    ...entry.responses,
    ...responses,      
  };
  if (entry.responses.placeholder) {
    delete entry.responses.placeholder;
  }
  console.log(entry, "ENTRY2")
  response.finalRes.set(id, entry);
  response.finalRes = new Map(response.finalRes);

  response.markModified('finalRes');
  await response.save();
  console.log(response);
  return res.status(201).json({
    message: `Responses recorded for patient ID ${id}`,
    data: {
      id,
      survId, 
      responses
    },
  });
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
