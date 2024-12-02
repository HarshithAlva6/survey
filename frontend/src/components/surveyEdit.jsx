import React from 'react';
import { useEffect, useState } from 'react';
import {useLocation} from 'react-router-dom';
import axios from '../api/axios';
import ReactStars from 'react-rating-stars-component';

const SurveyEdit = () => {
    const location = useLocation();
    const {survId, patId} = location.state || [];
    const [questions, setQuestions] = useState([]);
    const [responses, setResponses] = useState({});

    console.log(survId, patId, "Hello!");
    useEffect(() => {
        const getQuestions = async() => {
            const response = await axios.get(`/surveys/${survId}`);
            console.log(response.data);
            setQuestions(response.data.questions || []);
        }
        getQuestions();
    }, [survId]);

    const handleResponseChange = (questionId, value) => {
        setResponses((prev) => ({
            ...prev,
            [questionId]: value, 
        }));
    };
    const handleSubmit = async () => {
        try {
            console.log(responses, patId, survId);
            const response = await axios.post(`/patients/${patId}/responses`, {responses, survId});
            console.log("Submission successful:", response.data);
            alert("Responses submitted successfully!");
        } catch (error) {
            console.error("Error submitting responses:", error);
            alert("Failed to submit responses. Please try again.");
        }
    };
    return(
    <>
    {questions.length > 0 ? (
        <>
            {questions.map((question) => (
                <div key={question.id} className="mb-20">
                    <h1>{question.label}</h1>
                        {question.options?.length > 0 ? (
                            <ul>
                            {question.options.map((option, index) => (
                                <li key={index}>
                                    <label>
                                        <input
                                        type="radio"
                                        value={index}
                                        checked={responses[question.id] === index}
                                        onChange = {()=> handleResponseChange(question.id, index)} />
                                        {option} 
                                    </label>
                                </li>
                            ))}
                        </ul>
                        ): question.type === 'short_answer' ? (
                            <input
                            type="text"
                            placeholder="Type your answer here"
                            value={responses[question.id] || ''}
                            onChange={(e) =>
                                handleResponseChange(question.id, e.target.value)
                            }
                            style={{ width: '100%', padding: '8px', fontSize: '16px' }}
                        />
                    ) : question.type === 'rating_scale' ? (
                        // Rating Scale Questions
                        <ReactStars
                            count={5} // Number of stars
                            value={responses[question.id] || 0}
                            onChange={(newRating) =>
                                handleResponseChange(question.id, newRating)
                            }
                            size={30}
                            activeColor="#ffd700"
                        />
                    ) : (
                        <p>Unsupported question type</p>
                    )}
                </div>
            ))}
            <button onClick={handleSubmit} className="mt-20">
                Submit Responses
            </button>

        </>
    ) : (
        <p>No questions under this Survey</p>
    )}
    </>
    );
};
export default SurveyEdit;