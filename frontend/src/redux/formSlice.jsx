import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    title: '',
    questions: [],
    questionId: 1
};

const formSlice = createSlice({
    name: 'form',
    initialState,
    reducers: {
        setTitle(state, action) {
            state.title = action.payload;
        },
        addQuestion(state, action) {
            const type = action.payload;
            state.questions.push({
                id: state.questionId++,
                type,
                label: '',
                options: type === 'multiple_choice' ? ['MCQ Option 1'] : [],
            });
        },
        updateOption(state, action) {
            const { id, updates } = action.payload;
            const questionIndex = state.questions.findIndex((q) => q.id === id);
            if (questionIndex !== -1) {
                state.questions[questionIndex] = {
                    ...state.questions[questionIndex],
                    ...updates,
                };
            }
        },
        deleteQuestion(state, action) {
            const id = action.payload;
            state.questions = state.questions.filter((q) => q.id !== id);
        },
        deleteAllQuestion(state, action) {
            state.questions = [];
        }
    },
});

export const { setTitle, addQuestion, updateOption, deleteQuestion, deleteAllQuestion } = formSlice.actions;
export default formSlice.reducer;
