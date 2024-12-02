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
        openView(response.data.patient.id);
    };

    const openView = (id) => {
        navigate(`/patient/${id}`, { state: { uniqueId: id } });
    };

    return (
        <div className="p-6 max-w-md mx-auto bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-center mb-6">Add Patient</h2>
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    handleAddPatient();
                }}
                className="space-y-4"
            >
                {error && <p className="text-red-500 text-sm">{error}</p>}

                <div>
                    <label htmlFor="name" className="block text-black-700 font-large">NAME</label>
                    <input
                        id="name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter patient name"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                </div>

                <div>
                    <label htmlFor="email" className="block text-black-700 font-large">EMAIL</label>
                    <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter patient email"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                </div>

                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600 transition">
                    Register Patient
                </button>
            </form>
        </div>
    );
};

export default PatientList;
