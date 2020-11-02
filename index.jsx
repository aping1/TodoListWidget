import { css } from "uebersicht";
// NOTE: 1. create an emitter that takes dispatch in dispatcher.mj, dont forget to export it at the
import dispatchers from "./dispatchers.mjs";

import debug from "./debug.mjs";

import actions from "./actions.mjs";
import config from "./ressources/config.json";
import styles from "./styles.mjs";
import { Weather } from "./components/Weather.jsx";
import { ListContainer, ThingsListContainer } from "./components/ListContainer.jsx";

// importdd styles
const {
  Header,
  Title,
  Main,
  DateContainer,
  ToDoContainer,
  AddReminder,
  text} = styles;


// assets you might import (bootstrap?)
// TODO: Add bootstrap 
export const className = `
    @import url('https://fonts.googleapis.com/css2?family=Raleway:wght@100&display=swap');
    @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@100;300;400;500;700;900&display=swap');
    left: 1vw;;
    top: 20px;
    width: 20vw;
    height: 95vh;
    border-radius: 20px;
    overflow: hidden;
`

//NOTE: 2. define the new shape of your state 
//NOTE: If you change this you will have to manually refresh state
//NOTE: something like: exe "set makeprg=" . '"osascript <<< ' .  escape( 'tell application id "tracesOf.Uebersicht" to refresh widget id "' . expand('%:p:h:t') . '"', '"') . '"'
export const initialState = {
    name: "...",
    time: undefined,
    weather: undefined,
    reminders:{
      todo:[],
      done:[]
    },
    things:{
      done:[],
      today:[]
    }
}
// NOTE: There are two use cases
// polling actions
// handler buttons

// NOTE: 3. bind dispacho your handler
export const init = (dispatch) => {
  actions.setCurrentPath().then(()=>{
    dispatchers.setWeather(dispatch);
    dispatchers.setName(dispatch);
    dispatchers.setHours(dispatch);
    dispatchers.setReminders(dispatch);
    dispatchers.setThings(dispatch);
  })
}

// NOTE: 4. create a case for your type which will update or pass on the previous state
// the Case needs to match what is  emitted by ./dispatchers.mjs
export const updateState = (event, previousState) => {
    let newState = {...previousState}
    switch(event.type) {
      case 'TIME': return {...previousState, time: event.data}
      case 'NAME': return {...previousState, name: event.data};
      case 'UPDATE_REMINDERS':{
        return {...newState, reminders: {done: event.data.done, todo: event.data.todo}};
      }
      case 'UPDATE_THINGS':{
        // add any elements that are local
        if (!previousState.things || !previousState.things.done){
          newState.things = {done: event.data.done, today: event.data.today};
        } else {
          newState.things = {done: newState.things.done, today: event.data.today};
        }
        return {...newState}
      }
      case 'OPEN_THINGS':{
        try {
          actions.xurlcallback(event.data)
        } catch (e){
          console.warn(`Failed to call xurl for id: ${event.data} {e.message})`)
        }
        return {...newState}
      }
      case 'CHANGE_THINGS_STATUS':{
        // if old statss is open.. filter today, add to done
        if(event.data) {
        let direction = event.data.oldStatus
        // if we're leaving  today
        let listWhereFilter = direction ?  newState.things.done : newState.things.today ;
        let listWherePush = direction ? newState.things.today :newState.things.done ;
        // get todo with this id
        let oldTodos = [...listWhereFilter]
               .filter(t => event.data.id == t.id)
               .map((t) => { t.status = direction ? "modified" : "open"; return t});
        if (oldTodos.length > 0) { 
          // take it out off the old list
          listWhereFilter = listWhereFilter.filter(t => oldTodos[0].id != t.id)
          // Push the todo
          listWherePush.push(oldTodos[0])
        }
        newState.things.done = direction ? listWhereFilter : listWherePush;
        newState.things.today = direction ? listWherePush : listWhereFilter;
        }
        return {...newState};
      }
      case 'CHANGE_REMINDER_STATUS':{
        const reminder = event.data;
        let listWhereFilter = reminder.done ? newState.reminders.done : newState.reminders.todo;
        let listWherePush = reminder.done ? newState.reminders.todo : newState.reminders.done;
        listWhereFilter = listWhereFilter.filter((_, index) => reminder.id != index);
        listWherePush.push(reminder.name)
        newState.reminders.todo = reminder.done ? listWherePush : listWhereFilter;
        newState.reminders.done = reminder.done ? listWhereFilter : listWherePush;
        return {...newState};
      }
      case 'WEATHER':
        if(!event.data.weather)
          return previousState;
        updateStyle(event.data.sys.sunrise,event.data.sys.sunset);
        return {...previousState, weather: {
          icon: event.data.weather[0].icon,
          description: event.data.weather[0].description,
          temp: event.data.main.temp,
          temp_felt: event.data.main.feels_like,
        }};
      default: {
        return previousState;
      }
    }
}

//NOTE: bind a handler to OnClick
const addReminderHandler = (dispatch)=>{
  actions.createReminder().then(() =>{
    dispatchers.setReminders(dispatch)
  });
}

// NOTE: tell it how to render
// NOTE: Rember that the props have to matchi waht is in components/*.jsx
export const render = ({name, weather, time, reminders, things}, dispatch) => {
  return (
    <div className={css({height: "100%", padding: "5px",display:"flex", flexDirection: "column", backgroundImage: `url("${current_background}")`, backgroundSize: "cover"})}>
      <Header>
        <Title>{config.title}<br/>{name}</Title>
        <Weather weather={weather}/>
      </Header>
      <Main>
        <DateContainer>
          <p className={`${css({marginTop: "6px"})} ${text}`}>{actions.getDate()}</p>
          <p className={`${text}`}>{!!weather ? weather.description : "~"}</p>
          <p className={`${css({margin: "4px 0", fontWeight: 500, fontSize: "19px"})} ${text}`}>{time}</p>
        </DateContainer>
        <ToDoContainer>
          <AddReminder onClick={addReminderHandler.bind(this,dispatch)}>
            <svg fill={current_activeColor} height="10px" viewBox="0 0 448 448" width="10px" xmlns="http://www.w3.org/2000/svg">
              <path d="m272 184c-4.417969 0-8-3.582031-8-8v-176h-80v176c0 4.417969-3.582031 8-8 8h-176v80h176c4.417969 0 8 3.582031 8 8v176h80v-176c0-4.417969 3.582031-8 8-8h176v-80zm0 0"/>
            </svg>
          </AddReminder>
          { !!things && !!things.today ?
          <ThingsListContainer
            dispatch={dispatch}
            todos={things.today}
            done={false}
            sentences={{plural: config.todo.uncompletedTasksTitle + "in Things", singular: config.todo.uncompletedTaskTitle + 'in Things'}}
            color={current_activeColor}
          /> : ""}
          { !!things && !!things.done ?
          <ThingsListContainer
            dispatch={dispatch}
            todos={things.done}
            done={true}
            sentences={{plural: "Things " + config.todo.completedTasksTitle, singular: "Thing " + config.todo.completedTaskTitle}}
            color={current_activeColor}
          /> : ""}
          <ListContainer
            dispatch={dispatch}
            reminders={reminders ? reminders.todo : []}
            done={false}
            sentences={{plural: config.todo.uncompletedTasksTitle, singular: config.todo.uncompletedTaskTitle}}
            color={current_activeColor}
          />
        </ToDoContainer>
      </Main>
    </div>
  )
}

let current_background = "./TodoListWidget/pictures/backgrounds/day.png";
let current_activeColor = "#2B91E3";
const updateStyle = (sunrise, sunset) => {
  const now = Date.now();
  const hours = 1000 * 60 * 60;
  sunrise *= 1000;
  sunset *= 1000;
  if(now >= sunset || now < sunrise){
    current_background = config.styles.backgroundSunset;
    current_activeColor = "#6A46A8";
  }else if((now >= sunrise && now < sunrise + 2*hours) || now >= sunset - 2*hours){
    current_background = config.styles.backgroundSunrise;
    current_activeColor = "#65E4DD";
  }else{
    current_background = config.styles.backgroundDay;
    current_activeColor = "#2B91E3";
  }
}

