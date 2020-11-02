const actions = require("./actions.mjs").default;
const config = require("./ressources/config.json");
import debug from "./debug.mjs";

const setWeather = (dispatch) => {
    actions.getWeather().then( data => {
      dispatch({type: "WEATHER", data});
      
    });
    setInterval(() => {
        actions.getWeather().then( data => {
        dispatch({type: "WEATHER", data});
      });
    }, 3600000);
  }
  
  const setName = (dispatch) => {
    actions.getName().then((res,err) => {
      if(err)
          console.error(err);
      dispatch({type: 'NAME', data: res || "inconnu" });
    });
  }  

  const setHours = (dispatch) => {
    dispatch({type: "TIME", data: actions.getHours()});
    setTimeout(() => {
      dispatch({type: "TIME", data: actions.getHours()});
      setInterval(() => {
        dispatch({type: "TIME", data: actions.getHours()})
      }, 60000);
    },60000-(Date.now()%60000));
  }

  const setThings = async (dispatch) => {
    const [today] = await Promise.all([actions.getThingsToday()]);
    var done  = today.filter(todo => !!todo.completion_date);
    var todos = today.filter(todo => !todo.completion_date);
    dispatch({type: 'UPDATE_THINGS', data: {done: done, today: todos}});
  }


  const setReminders = async (dispatch) => {
    try{
      const [todo, done] = await Promise.all([actions.getRemindersNotDone(), actions.getRemindersDone()]);
      if (!!todo || !!done) { dispatch({type: 'UPDATE_REMINDERS', data: {todo, done} || [] }); }
      else { console.warn("Reminder miss");}
    } catch(e) {
      console.warn("Reminder set failed:", e)
    }
  }

const openThingsTodo = (dispatch, id)  => {
  if (id) {
    let req={program: "things", path: "/show", options: {id: id}}
    dispatch({type: 'OPEN_THINGS', data: req})
  }
}

  const changeThingsStatus = (dispatch, todo) => {
    dispatch({type: 'CHANGE_THINGS_STATUS', data: todo});
    console.log("Changing", debug.mydump(todo));
    actions.xurlcallback({program: 'things', path: '/update', options: {id: todo.id, completed: !todo.oldStatus }});
    setThings(dispatch);
  }

  const changeReminderStatus = (dispatch, reminder) => {
    dispatch({type: 'CHANGE_REMINDER_STATUS', data: reminder || {} });
    if(reminder.done){
      actions.uncompleteReminder(reminder.name);
    }else{
      actions.completeReminder(reminder.name);
    }
    setReminders(dispatch);
  }


  export default { setName, setWeather, setHours, setReminders, changeThingsStatus, changeReminderStatus, setThings, openThingsTodo}
