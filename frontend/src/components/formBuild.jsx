import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setTitle, addQuestion, setQuestion, updateOption, deleteQuestion, deleteAllQuestion } from '../redux/formSlice';
import '../App.css';
import axios from '../api/axios'; 
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

/*Create Enum */
const ItemType = {
    QUESTION: "question",
  };

  const DraggableQuestion = ({ question, index, moveQuestion, handleDelete }) => {
    const dispatch = useDispatch();
    const [{ isDragging }, dragRef] = useDrag({
      type: ItemType.QUESTION,
      item: { index },
      collect: (monitor) => {
        return {
          isDragging: monitor.isDragging(),
        };
      },
    });
  
    const [, dropRef] = useDrop({
      accept: ItemType.QUESTION,
      hover: (draggedItem) => {
        if(!draggedItem) return;
        if (draggedItem.index !== index) {
          moveQuestion(draggedItem.index, index);
          draggedItem.index = index;
        }
      }
    });

    return (
        <li
          ref={(node) => dragRef(dropRef(node))}
          style={{
            opacity: isDragging ? 0.75 : 1,
            border: "1px solid #ddd",
            padding: "10px",
            marginBottom: "10px",
            backgroundColor: "#fff",
            cursor: "move",
          }}
          className = "question-card"
        >
          <input
            type="text"
            placeholder={`${question.type} question?`}
            value={question.label}
            className = "input-field"
            onChange={(e) =>
              handleDelete(question.id, { label: e.target.value })
            }
          />
          {question.type === "multiple_choice" && (
            <div>
              {question.options.map((opt, index) => (
                <div class = "flex items-center space-x-4 w-full">
                <input
                  key={index}
                  type="text"
                  value={opt}
                  className = "input-field"
                  onChange={(e) =>
                    handleDelete(question.id, {
                      options: question.options.map((o, i) =>
                        i === index ? e.target.value : o
                      ),
                    })
                  }
                />
                <button
                  className="button-delete"
                  onClick={() =>
                    handleDelete(question.id, {
                        options: question.options.filter((_, i) => i !== index),
                      },
                  )}
                >
                  Delete
                </button>
                </div>
              ))}
              <button
              className = "button-add"
                onClick={() =>
                  handleDelete(question.id, {
                    options: [
                      ...question.options,
                      `MCQ Option ${question.options.length + 1}`,
                    ],
                  })
                }
              >
                Add Option
              </button>
              <button class="button-delete ml-4" onClick={() => dispatch(deleteQuestion(question.id))}>Delete</button>
            </div>
          )}
            <div style={{display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'}} class="space-x-4">
            {question.type === "rating_scale" && (
              <input
                type="number"
                min="1"
                max="10"
                value={question.stars}
                className="input-field ml-4"
                onChange={(e) =>
                  handleDelete(question.id,{
                    stars: Number(e.target.value) 
                  })
                }
                placeholder="Number of stars"
              />
              )}
              {question.type !== "multiple_choice" && <button class="button-delete" onClick={() => dispatch(deleteQuestion(question.id))}>Delete</button>}
            </div>
        </li>
      );
    };
    

const FormBuild = () => {
    const dispatch = useDispatch();
    const { title, questions } = useSelector((state) => state.form);
    
    const moveQuestion = (dragIndex, hoverIndex) => {
        const updatedQuestions = [...questions];
        const [movedItem] = updatedQuestions.splice(dragIndex, 1);
        updatedQuestions.splice(hoverIndex, 0, movedItem);
        dispatch(setQuestion(updatedQuestions))
    
        dispatch(updateOption({ id: null, updates: { questions: updatedQuestions } }));
      };

    const handleSurvey = async() => {
        console.log(title, questions);
        if (!title || questions.some((q) => !q.label)) {
          alert("Survey Title or MCQ Questions missing");
          return;
        }
        const response = await axios.post('/surveys', { title, questions });
        console.log('Survey saved successfully:', response.data);
        alert('Survey Saved!');
        dispatch(deleteAllQuestion());
    }

    return(
        <DndProvider backend={HTML5Backend}>
        <div className = "form-container">
            <h1 className="form-heading">Create Survey Form for Patients</h1>
        <input type="text"
        placeholder='Survey Title'
        className="input-field"
        value={title}
        onChange = {(e) => dispatch(setTitle(e.target.value))}
        />
        <div className="flex space-x-4 mb-4">
            <button className = "button-add" onClick = {() => dispatch(addQuestion('multiple_choice'))}>Add Multiple Choice Option</button>
            <button className = "button-add" onClick = {() => dispatch(addQuestion('short_answer'))}>Add Short Answer Option</button>
            <button className = "button-add" onClick = {() => dispatch(addQuestion('rating_scale'))}>Add Rating Scale Option</button>
        </div>
        <ul>
            {questions.map((q, index) => (
            <DraggableQuestion
            key={q.id}
            question={q}
            index={index}
            moveQuestion={moveQuestion}
            handleDelete={(id, updates) =>
              dispatch(updateOption({ id, updates }))
            }
          />
            ))}
        </ul>
        <button className = "button-save" onClick={handleSurvey}>Save Survey</button>     
        </div>
    </DndProvider>
    );
}
export default FormBuild;