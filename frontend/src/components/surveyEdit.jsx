import React from 'react';
import { useEffect, useState } from 'react';
import {useNavigate, useLocation} from 'react-router-dom';
import axios from '../api/axios';
import ReactStars from 'react-rating-stars-component';

const SurveyEdit = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const {survId, patient} = location.state || [];
    const [questions, setQuestions] = useState([]);
    const [responses, setResponses] = useState({});

    console.log(survId, patient.id, "Hello!");
    useEffect(() => {
        const getQuestions = async() => {
            const response = await axios.get(`/surveys/${survId}`);
            console.log(response.data);
            setQuestions(response.data.questions || []);
        }
        getQuestions();
    }, [survId]);

    const handleResponseChange = (questionId, value) => {
        const question = questions.find((q) => q.id == questionId);
        setResponses((prev) => ({
            ...prev,
            [questionId]: {
                label: question.label,
                value}, 
        }));
    };
    const handleSubmit = async () => {
        try {
            console.log(responses, patient.id, survId);
            const response = await axios.post(`/patients/${patient.id}/responses`, {responses, survId});
            console.log("Submission successful:", response.data);
            const final = await axios.patch(`/patients/${patient.id}/assign-survey`, {survId});
            console.log("Status updated!", final.data);
            alert("Responses submitted successfully!");
            navigate(`/patient/${patient.id}`, { state: { patient: patient } });
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
                <div key={question.id} className="mb-10 form-container"
                style = {{display: 'flex-row', justifyContent: 'center', alignItems: 'center'}}>
                    <h1 class="form-heading">{question.label}</h1>
                        {question.options?.length > 0 ? (
                            <ul>
                            {question.options.map((option, index) => (
                                <li key={index}>
                                    <label class="label">
                                        <input
                                        type="radio"
                                        value={index}
                                        checked={responses[question.id]?.value === index}
                                        onChange = {()=> handleResponseChange(question.id, index)} />
                                        {option} 
                                    </label>
                                </li>
                            ))}
                        </ul>
                        ): question.type === 'short_answer' ? (
                            <textarea
                            class="input-field"
                            type="text"
                            placeholder="Type your answer here"
                            value={responses[question.id]?.value || ''}
                            onChange={(e) =>
                                handleResponseChange(question.id, e.target.value)
                            }
                            style={{ width: '100%', padding: '8px', fontSize: '16px' }}
                        />
                    ) : question.type === 'rating_scale' ? (
                        <div className="flex items-center justify-center w-full">
                        <ReactStars
                            count={question.stars} // Number of stars
                            value={responses[question.id]?.value || 0}
                            onChange={(newRating) =>
                                handleResponseChange(question.id, newRating)
                            }
                            size={30}
                            activeColor="#ffd700"
                        />
                        </div>
                    ) : (
                        <p>Unsupported question type</p>
                    )}
                </div>
            ))}
            <button onClick={handleSubmit} className="mt-5">
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