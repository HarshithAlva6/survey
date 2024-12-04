import React from 'react';
import {assignSurvey, setPatients} from '../redux/patientSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import axios from '../api/axios';

const FormList = () => {
    const dispatch = useDispatch();
    const patients = useSelector((state) => state.patients.patients);
    console.log("HERE!!!!!", patients);
    const assignedSurveys = useSelector((state) => state.patients.assignedSurveys);
    const [surveys, setSurveys] = useState([]);
    const [searchTerm, setSearchTerm] = useState({});
    const [filteredPatients, setFilteredPatients] = useState({});
    const [responses, setResponses] = useState({});
    useEffect(() => {
        const fetchSurveys = async() => {
            try {
                const response = await axios.get('/surveys');
                console.log('All Surveys:', response.data);
                setSurveys(response.data);
            } catch (error) {
                console.error('Error fetching surveys:', error);
            }
        };
        const fetchPatients = async() => {
            try {
                const response = await axios.get('/patients');
                console.log('All Patients:', response.data);
                dispatch(setPatients(response.data || []));
                setFilteredPatients(response.data || []);
            } catch (error) {
                if (error.response && error.response.status === 404) {
                    console.warn('No patients found.');
                    setPatients([]); 
                    setFilteredPatients([]);
                } else {
                    console.error('Error fetching patients:', error);
                }
            }
        }

        const fetchResponses = async() => {
            try {
                const response = await axios.get('/patients/responses');
                console.log("All responses", response.data.data.responses);
                setResponses(response.data.data.responses);
            } catch(error) {
                if (error.response && error.response.status === 404) {
                    console.warn('No responses yet.');
                } else {
                    console.error('Error fetching responses:', error);
                }
            }
        }
        fetchSurveys();
        fetchPatients();
        fetchResponses();
    }, [dispatch]);

    const handleSearch = (e, surveyId) => {
        const term = e.target.value;
        setSearchTerm((prev) => ({ ...prev, [surveyId]: term || '' }));
        setFilteredPatients((prev) => ({
            ...prev,
            [surveyId]: patients.filter((patient) =>
                patient.name.toLowerCase().startsWith(term.toLowerCase())
            ),
        }));
        console.log(assignedSurveys, patients);
    };

    const handleSelect = async(surveyId, patientId) => {
        const response = await axios.post(`/patients/${patientId}/assign-survey`, { surveyId });
        console.log('Survey assigned successfully:', response.data);

        dispatch(assignSurvey({patientId: patientId, surveyId: surveyId}));
        const updatedResponses = await axios.get('/patients/responses');
        console.log("Updated responses after assignment:", updatedResponses.data.data.responses);
        setResponses(updatedResponses.data.data.responses);
        setFilteredPatients((prev) => ({
            ...prev,
            [surveyId]: []
        }));
    }
    return(
    <div className = "form-container">
        <h2 className="form-heading">List of Surveys</h2>
        {surveys.map((survey) => (
            <div className="question-card" key={survey.id} style={{border: '1px solid black', margin: '10px'}}>
                <h4 className="form-heading">{survey.title}</h4>
                <p className = "label">{survey.questions.length} Questions to Answer</p>
                <label>Assign a Patient below</label>
                <div style={{position: 'relative'}}>
                    <input className="input-field" type="text"
                    placeholder="Search Patient"
                    value={searchTerm[survey.id] || ''}
                    onChange={(e) => handleSearch(e, survey.id)}
                    style={{width: '100%'}}/>
                {searchTerm[survey.id] && filteredPatients[survey.id]?.length > 0 && (
                    <ul style={{
                        position: 'absolute',
                        background: '#fff',
                        border: '1px solid #ccc',
                        width: '100%',
                        margin: 0,
                        padding: 0,
                    }}>
                        {filteredPatients[survey.id].map((patient, index) => (
                            <li key={index}
                            onClick={() => handleSelect(survey.id, patient.id)}
                            style = {{padding: '5px', cursor: 'pointer'}}
                            >{patient.name}</li>
                        ))}
                    </ul>
                    )}
                </div>
            </div>
        ))}
        <h2 className = "form-heading">Survey Responses</h2>
        {responses ? (
        Object.entries(responses).map(([patientId, allSurveys]) => {
        const patientName = patients.find((p) => p.id == patientId).name;
        return (
        <div className="question-card" key={patientId} style={{ border: '1px solid black', margin: '10px' }}>
            {Object.entries(allSurveys).map(([surveyId, surveyData]) => {
            const surveyTitle = surveys.find((s) => s.id == surveyId).title;
            return (
                <div key={surveyId} className = "question-card" >
                    <h5 className = "form-heading">{surveyTitle} - {patientName} Response</h5>
                    {surveyData.responses && Object.keys(surveyData.responses).length > 0 ? (
                    <>
                    <ul>
                        {Object.entries(surveyData.responses).map(([questionId, {label, value}]) => (
                            <li key={questionId}>
                                <strong>{label}: </strong> {value}
                            </li>
                        ))}
                    </ul>
                    <p className="text-green-500 font-bold">Completed</p>
                    </>
                    ):(
                        <p className="text-red-500 font-bold">Pending</p>
                    )}
                </div>
            )})}
        </div>
        )})
        ) : (
            <p>No responses available yet.</p>
        )}
        </div>
    );
}
export default FormList;