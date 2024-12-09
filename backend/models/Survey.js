const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
    id: { type: Number, required: true },
    type: { type: String, required: true, enum: ['multiple_choice', 'short_answer', 'rating_scale'] },
    label: { type: String, required: true },
    options: { type: [String], default: [] }, 
    stars: { type: Number, default: null }
  });

const SurveySchema = new mongoose.Schema({
    title: { type: String, required: true },
    questions: { type: [QuestionSchema], required: true },
});

module.exports = mongoose.model('Survey', SurveySchema);
