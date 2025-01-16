import React from 'react';
import {assignSurvey, setPatients} from '../redux/patientSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import axios from '../api/axios';

const FormList = () => {
    const dispatch = useDispatch();
    const patients = useSelector((state) => state.patients.patients);
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
        console.log(filteredPatients, surveys)
        const response = await axios.post(`/patients/${patientId}/assign-survey`, { surveyId });
        alert(response.data.message);

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
    <div className = "form-container2" style={{ display: 'flex', gap: '20px' }}>
        <div style={{ flex: 1 }}>
        <h2 className="form-heading">List of Surveys</h2>
        {surveys.map((survey) => (
            <div className="question-card" key={survey._id} style={{border: '1px solid black'}}>
                <h4 className="form-heading">{survey.title}</h4>
                <p className = "label">{survey.questions.length} Questions to Answer</p>
                <label>Assign a Patient below</label>
                <div style={{position: 'relative'}}>
                    <input className="input-field" type="text"
                    placeholder="Search Patient"
                    value={searchTerm[survey._id] || ''}
                    onChange={(e) => handleSearch(e, survey._id)}
                    style={{width: '100%'}}/>
                {searchTerm[survey._id] && filteredPatients[survey._id]?.length > 0 && (
                    <ul style={{
                        position: 'absolute',
                        background: '#fff',
                        border: '1px solid #ccc',
                        width: '100%',
                        margin: 0,
                        padding: 0,
                    }}>
                        {filteredPatients[survey._id].map((patient, index) => (
                            <li key={index}
                            onClick={() => handleSelect(survey._id, patient._id)}
                            style = {{padding: '5px', cursor: 'pointer'}}
                            >{patient.name}</li>
                        ))}
                    </ul>
                    )}
                </div>
            </div>
        ))}
        </div>
        <div style={{ flex: 1 }}>
        <h2 className = "form-heading">Survey Responses</h2>
        {responses ? (
        Object.entries(responses).map(([responseKey, allSurveys]) => {    
        return (
        <div className="question-card" key={responseKey} style={{ border: '1px solid black', margin: '10px' }}>
            {Object.entries(allSurveys.finalRes).map(([patientId, surveyData]) => {
            const patientName = patients.find((p) => String(p._id) === String(patientId))?.name;
            const surveyTitle = surveys.find((s) => String(s._id) === String(surveyData.surveyId))?.title;
            console.log("SurveyTit", surveyTitle);
            console.log(allSurveys.finalRes, surveys, patientName);
            return (
                <div key={surveyData.surveyId}
                    className={`p-6 rounded-lg shadow-md mb-6 ${
                        surveyData.responses && Object.keys(surveyData.responses).length > 0 && !surveyData.responses?.placeholder
                            ? 'bg-green-50 border-green-400'
                            : 'bg-red-50 border-red-400'}`}>
                <h5 className="text-xl font-bold mb-4">{surveyTitle} - {patientName}'s Response</h5>
                    {surveyData.responses && Object.keys(surveyData.responses).length > 0 && !surveyData.responses?.placeholder ? (
                        <>
                            <ul className="space-y-3">
                                {Object.entries(surveyData.responses).map(([questionId, { label, value }]) => (
                                    <li key={questionId}
                                        className="p-4 bg-white rounded-lg shadow-sm">
                                        <strong className="block text-gray-700">{label}:</strong>
                                        <span className="text-gray-900">{value}</span>
                                    </li>
                                ))}
                            </ul>
                            <p className="mt-4 text-green-600 font-bold text-center">Completed</p>
                        </>
                    ) : (
                        <p className="mt-4 text-red-600 font-bold text-center">Pending</p>
                    )}
                </div>
            )})}
        </div>
        )})
        ) : (
            <p>No responses available yet.</p>
        )}
        </div>
        </div>
    );
}
export default FormList;