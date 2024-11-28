import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    title: '',
    questions: [],
};

const formSlice = createSlice({
    name: 'form',
    initialState,
    reducers: {
        setTitle: (state, action) => {
            state.title = action.payload;
        },
        addQuestion: (state, action) => {
            state.questions.push(action.payload);
        },
        updateQuestion: (state, action) => {
            const { id, updates } = action.payload;
            const question = state.questions.find((q) => q.id === id);
            if (question) {
                Object.assign(question, updates);
            }
        },
        deleteQuestion: (state, action) => {
            state.questions = state.questions.filter(
                (q) => q.id !== action.payload
            );
        },
    },
});

export const { setTitle, addQuestion, updateQuestion, deleteQuestion } =
    formSlice.actions;
export default formSlice.reducer;
