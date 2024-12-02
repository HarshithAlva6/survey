import React from 'react';
import { useEffect, useState } from 'react';
import {useLocation, useNavigate} from 'react-router-dom';
import axios from '../api/axios';

const PatientView = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const {uniqueId} = location.state || {};
    console.log(uniqueId, "HELLL");
    const [finalSurveys, setFinalSurveys] = useState([]);
    useEffect (() => {
        const getSurveys = async() => {
            console.log(uniqueId, typeof uniqueId);
            const response = await axios.get(`/patients/${uniqueId}/assign-survey`);
            console.log("Surveys are:", response.data);
            setFinalSurveys(response.data.allSurveys || []);
        }
        getSurveys();
    },[]);
    const openSurvey = (id, patientId) => {
        navigate(`/survey/${id}`,{state: {survId: id, patId: patientId} });
    }
    return (
        <div>
            <h2>Patient ID: {uniqueId}</h2>
            <h3>Assigned Surveys:</h3>
            {finalSurveys.length > 0 ? (
                <ul>
                    {finalSurveys.map((survey) => (
                        <li key={survey.id}><button onClick = {() => openSurvey(survey.id, uniqueId)}>{survey.title}</button></li>
                    ))}
                </ul>
            ) : (
                <p>No surveys assigned to this patient.</p>
            )}
        </div>
    );
};

export default PatientView;