import './App.css';
import FormBuild from  './components/formBuild';
import PatientList from './components/patientList';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import FormList from './components/formList';
import PatientView from './components/patientView';
import SurveyEdit from './components/surveyEdit';

function App() {
  return (
    <div className="App">
      <Router>
        <nav>
          <a href="/formbuilder">Form Builder</a>
          <a href="/surveys">Survey List</a>
          <a href="/patient">Add Patient</a>
        </nav>
        <Routes>
          <Route path="/formbuilder" element={<FormBuild />} />
          <Route path="/surveys" element={<FormList />} />
          <Route path="/patient" element={<PatientList />} />
          <Route path="/patient/:id" element={<PatientView />} />
          <Route path="/survey/:id" element={<SurveyEdit />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
