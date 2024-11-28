import React, {useState, useRef} from 'react';
const FormBuild = () => {
    const questionId = useRef(1);
    const [questions, setQuestions] = useState([]);
    const [title, setTitle] = useState();
    const addQuestion = (type) => {
        const newQuestion = {
            id: questionId.current++,
            type: type,
            label: '',
            options: type === 'multiple_choice' ? ['MCQ Option 1'] : [],
        };
        setQuestions([...questions, newQuestion])
    };
    const updateOption = (id, updates) => {
        setQuestions(questions.map(q => q.id === id ? { ...q, ...updates } : q));
    };
    const deleteQuestion = (id) => {
        setQuestions(questions.filter(q => (q.id !== id)));
    };
    return(
        <div>
            <h1>Create Survey Form for Patients</h1>
        <input type="text"
        placeholder='Survey Title'
        value={title}
        onChange = {(e) => setTitle(e.target.value)}
        />
        <button onClick = {() => addQuestion('multiple_choice')}>Add Multiple Choice Option</button>
        <button onClick = {() => addQuestion('short_answer')}>Add Short Answer Option</button>
        <button onClick = {() => addQuestion('rating_scale')}>Add Rating Scale Option</button>
        <ul>
            {questions.map((q) => {
                return (
                <li key={q.id}>
                    <input type="text"
                    placeholder="What is the Question?"
                    value={q.label}
                    onChange={(e) => updateOption(q.id, {...q, label: e.target.value})}
                    />
                    {q.type == 'multiple_choice' && (
                        <div>
                            {q.options.map((opt, index) => (
                                <input
                                    key={index}
                                    type="text"
                                    value={opt}
                                    onChange={(e) =>
                                        updateOption(q.id, {
                                            options: q.options.map((o, i) =>
                                            i === index ? e.target.value : o
                                        )})
                                    }
                                />
                            ))}
                            <button
                                onClick={() =>
                                    updateOption(q.id, { 
                                        options: [...q.options, `MCQ Option ${q.options.length + 1}`]
                                    })
                                }
                            >
                                Add Option
                            </button>
                        </div>
                    )}
                    <button onClick={() => deleteQuestion(q.id)}>Delete</button>
                </li>
                );
            })}
        </ul>
        <button onClick={() => {
                    console.log({ title: title, questions });
                    alert('Survey Saved!');
                }}>Save Survey</button>     
        </div>
    )
}
export default FormBuild;