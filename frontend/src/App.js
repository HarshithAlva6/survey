import './App.css';
import FormBuild from  './components/formBuild';
import PatientList from './components/patientList';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import FormList from './components/formList';
import PatientView from './components/patientView';
import SurveyEdit from './components/surveyEdit';
import Navbar from './components/NavBar';

function App() {
  return (
    <div className="App">
      <Router> 
      <Navbar />
      <div class="pt-16">
        <Routes>
          <Route path="/formbuilder" element={<FormBuild />} />
          <Route path="/surveys" element={<FormList />} />
          <Route path="/patient" element={<PatientList />} />
          <Route path="/patient/:id" element={<PatientView />} />
          <Route path="/survey/:id" element={<SurveyEdit />} />
        </Routes>
      </div>
      </Router>
    </div>
  );
}

export default App;
