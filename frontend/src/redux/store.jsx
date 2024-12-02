import { configureStore } from '@reduxjs/toolkit';
import formReducer from './formSlice';
import patientReducer from './patientSlice';

export const store = configureStore({
    reducer: {
        form: formReducer,
        patients: patientReducer
    }
});
