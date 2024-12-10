const mongoose = require('mongoose');

const PatientSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    assignedSurveys: [
        {
            surveyId: { type: String, ref: 'Survey', required: true },
            status: { type: String, enum: ['Pending', 'Completed'], default: 'Pending' },
        },
    ],
});

module.exports = mongoose.model('Patient', PatientSchema);
