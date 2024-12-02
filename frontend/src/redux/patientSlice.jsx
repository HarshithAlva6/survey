import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    patients: [], 
    patientId: 1
};

const patientSlice = createSlice({
    name: 'patients',
    initialState,
    reducers: {
        addPatient(state, action) {
            const { name, email } = action.payload;
            state.patients.push({
                id: (state.patients.length + 1).toString(), 
                name,
                email,
                assignedSurveys: []
            });
        },
        setPatients(state, action) {
            state.patients = action.payload; 
            console.log(state.patients);
        },
        assignSurvey(state, action) {
            const { patientId, surveyId } = action.payload;
            const patient = state.patients.find((patient) => patient.id == patientId);
            if (patient) {
                patient.assignedSurveys.push(surveyId);
            }
        },
        deletePatient(state, action) {
            const patientId = action.payload;

            state.patients = state.patients.filter((patient) => patient.id !== patientId);
        },
    },
});

export const { addPatient, setPatients, assignSurvey, deletePatient } = patientSlice.actions;
export default patientSlice.reducer;
