import React from 'react';
import { useEffect, useState } from 'react';
import {useLocation, useNavigate} from 'react-router-dom';
import axios from '../api/axios';

const PatientView = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const {patient} = location.state || {};
    console.log(patient, "HELLL");
    const [finalSurveys, setFinalSurveys] = useState([]);
    useEffect (() => {
        const getSurveys = async() => {
            const response = await axios.get(`/patients/${patient.id}/assign-survey`);
            console.log("Surveys are:", response.data);
            setFinalSurveys(response.data.allSurveys || []);
        }
        getSurveys();
    },[]);
    const openSurvey = (id, patient) => {
        navigate(`/survey/${id}`,{state: {survId: id, patient: patient } });
    }
    return (
        <div className="form-container">
            <h2 className = "form-heading">{patient.name}</h2>
            <h3 className = "form-heading">{patient.email}</h3>
            <h3 class="form-heading">Assigned Surveys:</h3>
            {finalSurveys.length > 0 ? (
                <ul>
                    {finalSurveys.map((survey) => (
                        <li key={survey.id} className="inline-block m-2">
                            <button onClick = {() => openSurvey(survey.id, patient)}
                            className={`px-4 py-2 rounded ${
                                survey.status === "Pending"
                                    ? "bg-red-500 text-white animate-pulse"
                                    : "bg-blue-500 text-white opacity-50 cursor-not-allowed"
                            }`}
                            disabled={survey.status !== "Pending"}
                            >
                                {survey.title}
                            </button>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No surveys assigned to this patient.</p>
            )}
        </div>
    );
};

export default PatientView;