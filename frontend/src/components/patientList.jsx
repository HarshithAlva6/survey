import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addPatient } from '../redux/patientSlice';
import axios from '../api/axios';
import {data, useNavigate} from 'react-router-dom';

const PatientList = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    // Local state to hold form inputs
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');

    const handleAddPatient = async () => {
        if (!name || !email) {
            setError('Name and Email are required!');
            return;
        }

        // Dispatch action to Redux store
        await dispatch(addPatient({ name, email }));
        const response = await axios.post("/patients", { name, email});
        console.log("Patient response recieved", response.data.patient);
        // Reset form and error state
        setName('');
        setEmail('');
        setError('');
        alert(response.data.message);
        openView(response.data.patient);
    };

    const openView = (patient) => {
        navigate(`/patient/${patient._id}`, { state: { patient: patient } });
    };

    return (
        <div className="form-container">
            <h2 className="form-heading">Patient Details</h2>
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    handleAddPatient();
                }}
                className="space-y-4"
            >
                {error && <p className="error-message">{error}</p>}

                <div>
                    <label htmlFor="name" className="label">Name</label>
                    <input
                        id="name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter patient name"
                        className="input-field"
                    />
                </div>

                <div>
                    <label htmlFor="email" className="label">Email</label>
                    <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter patient email"
                        className="input-field"
                    />
                </div>

                <button
                    type="submit"
                    className="button">
                    Log In / Register
                </button>
            </form>
        </div>
    );
};

export default PatientList;
