const mongoose = require('mongoose');

const ResponseSchema = new mongoose.Schema({
    finalRes: {
        type: Map, 
        of: new mongoose.Schema({
            surveyId: { type: String, required: true },
            responses: { type: Object, default: {} }, 
        }),
        default: () => new Map(), 
    },

},{minimize: false});

module.exports = mongoose.model('Response', ResponseSchema);

