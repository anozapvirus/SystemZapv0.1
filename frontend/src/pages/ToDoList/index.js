import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';

const useStyles = makeStyles({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    margin: '2rem'
  },
  inputContainer: {
    display: 'flex',
    width: '100%',
    marginBottom: '1rem',
    flexDirection: 'column'
  },
  input: {
    marginBottom: '1rem',
  },
  listContainer: {
    width: '100%',
    height: '100%',
    marginTop: '1rem',
    backgroundColor: '#f5f5f5',
    borderRadius: '5px',
  },
  list: {
    marginBottom: '5px'
  }
});

const ToDoList = () => {
  const classes = useStyles();

  const [task, setTask] = useState('');
  const [tasks, setTasks] = useState([]);
  const [editIndex, setEditIndex] = useState(-1);

  // Novos estados para os recados
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');

  useEffect(() => {
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const handleTaskChange = (event) => {
    setTask(event.target.value);
  };

  const handleAddTask = () => {
    if (!task.trim()) {
      return;
    }

    const now = new Date();
    const newTask = {
      text: task,
      startDate,
      endDate,
      startTime,
      endTime,
      createdAt: now,
      updatedAt: now
    };

    if (editIndex >= 0) {
      const newTasks = [...tasks];
      newTasks[editIndex] = { ...newTask, createdAt: newTasks[editIndex].createdAt };
      setTasks(newTasks);
      setEditIndex(-1);
    } else {
      setTasks([...tasks, newTask]);
    }

    setTask('');
    setStartDate('');
    setEndDate('');
    setStartTime('');
    setEndTime('');
  };

  const handleEditTask = (index) => {
    const task = tasks[index];
    setTask(task.text);
    setStartDate(task.startDate);
    setEndDate(task.endDate);
    setStartTime(task.startTime);
    setEndTime(task.endTime);
    setEditIndex(index);
  };

  const handleDeleteTask = (index) => {
    const newTasks = [...tasks];
    newTasks.splice(index, 1);
    setTasks(newTasks);
  };

  return (
    <div className={classes.root}>
      <div className={classes.inputContainer}>
        <TextField
          className={classes.input}
          label="Recado"
          value={task}
          onChange={handleTaskChange}
          variant="outlined"
        />
        <TextField
          className={classes.input}
          label="Data de Início"
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          InputLabelProps={{
            shrink: true,
          }}
          variant="outlined"
        />
        <TextField
          className={classes.input}
          label="Data de Fim"
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          InputLabelProps={{
            shrink: true,
          }}
          variant="outlined"
        />
        <TextField
          className={classes.input}
          label="Hora de Início"
          type="time"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
          InputLabelProps={{
            shrink: true,
          }}
          variant="outlined"
        />
        <TextField
          className={classes.input}
          label="Hora de Fim"
          type="time"
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
          InputLabelProps={{
            shrink: true,
          }}
          variant="outlined"
        />
        <Button variant="contained" color="primary" onClick={handleAddTask}>
          {editIndex >= 0 ? 'Salvar' : 'Adicionar'}
        </Button>
      </div>
      <div className={classes.listContainer}>
        <List>
          {tasks.map((task, index) => (
            <ListItem key={index} className={classes.list}>
              <ListItemText
                primary={task.text}
                secondary={`Início: ${task.startDate} ${task.startTime} | Fim: ${task.endDate} ${task.endTime}`}
              />
              <ListItemSecondaryAction>
                <IconButton onClick={() => handleEditTask(index)}>
                  <EditIcon />
                </IconButton>
                <IconButton onClick={() => handleDeleteTask(index)}>
                  <DeleteIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      </div>
    </div>
  );
};

export default ToDoList;
