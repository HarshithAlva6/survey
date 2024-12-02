import React, {useState} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setTitle, addQuestion, updateOption, deleteQuestion, deleteAllQuestion } from '../redux/formSlice';
import '../App.css';
import axios from '../api/axios'; 
import ReactStars from 'react-rating-stars-component';

const FormBuild = () => {
    const dispatch = useDispatch();
    const { title, questions } = useSelector((state) => state.form);
    const [rating, setRating] = useState(0);
    
    const handleSurvey = async() => {
        console.log(title, questions);
        const response = await axios.post('/surveys', { title, questions });
        console.log('Survey saved successfully:', response.data);
        alert('Survey Saved!');
        dispatch(deleteAllQuestion());
    }

    const handleRatingChange = (newRating) => {
        setRating(newRating);
    }
    return(
        <div>
            <h1>Create Survey Form for Patients</h1>
        <input type="text"
        placeholder='Survey Title'
        value={title}
        onChange = {(e) => dispatch(setTitle(e.target.value))}
        />
        <div>
            <button onClick = {() => dispatch(addQuestion('multiple_choice'))}>Add Multiple Choice Option</button>
            <button onClick = {() => dispatch(addQuestion('short_answer'))}>Add Short Answer Option</button>
            <button onClick = {() => dispatch(addQuestion('rating_scale'))}>Add Rating Scale Option</button>
        </div>
        <ul>
            {questions.map((q) => {
                return (
                <li key={q.id}>
                    <input type="text"
                    placeholder="What is the Question?"
                    value={q.label}
                    onChange={(e) => dispatch(updateOption({ id: q.id, updates: { label: e.target.value } }))}
                    />
                    {q.type === 'multiple_choice' && (
                        <div>
                            {q.options.map((opt, index) => (
                                <input
                                    key={index}
                                    type="text"
                                    value={opt}
                                    onChange={(e) =>
                                        dispatch(updateOption({
                                            id: q.id,
                                            updates: {
                                                options: q.options.map((o, i) =>
                                                    i === index ? e.target.value : o
                                                ),
                                            },
                                        }))
                                    }
                                />
                            ))}
                            <button
                                onClick={() =>
                                    dispatch(updateOption({
                                        id: q.id,
                                        updates: {
                                            options: [...q.options, `MCQ Option ${q.options.length + 1}`],
                                        },
                                    }))
                                }
                            >
                                Add Option
                            </button>
                        </div>
                    )}
                    {q.type === "rating_scale" && (
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',    
                        }}>
                        <ReactStars
                            count={5}
                            value={rating}
                            onChange={handleRatingChange}
                            size={50}
                            activeColor="#ffd700"
                        />
                    </div>
                    )}
                    <button onClick={() => dispatch(deleteQuestion(q.id))}>Delete</button>
                </li>
                );
            })}
        </ul>
        <button onClick={handleSurvey}>Save Survey</button>     
        </div>
    )
}
export default FormBuild;