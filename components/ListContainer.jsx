import { css } from "uebersicht";
import styles from "../styles.mjs";
import {Task, ThingsTask} from "../components/Task.jsx";

const {text} = styles;

export const ListContainer = ({reminders, done, sentences:{plural, singular}, color, dispatch}) => {
    return (
        <div>
            <p className={`${css({margin: "10px 0", fontSize: "11px"})} ${text}`}>
                {!!reminders && reminders.length > 1 ?
                `${reminders.length} ${plural}` :   
                `${reminders.length} ${singular}`
                }
            </p>
            <div className={`${css({marginLeft: "10px"})}`}>
            {reminders.map((reminder,index) => (
                <Task
                    done={done}
                    dispatch={dispatch}
                    key={index}
                    id={index}
                    color={color}
                >
                    {reminder}
                </Task>
            ))} 
            </div>
        </div>
    )
}

export const ThingsListContainer = ({todos, done, sentences:{plural, singular}, color, dispatch}) => {
    // for more info on things:// callback
    // https://culturedcode.com/things/support/articles/2803573/ 
    return (
        <div>
            <p className={`${css({margin: "10px 0", fontSize: "11px"})} ${text}`}>
                {todos.length > 1 ?
                `${todos.length} ${plural}` :   
                `${todos.length} ${singular}`
                }
            </p>
            <div className={`${css({marginLeft: "10px"})}`}>
            {todos.map((todo,index) => (
                <ThingsTask
                    name={todo.name}
                    status={done}
                    dispatch={dispatch}
                    key={index}
                    id={todo.id}
                    color={color}>
                        {todo.name}
                </ThingsTask>
            ))}
            </div>
        </div>
    )
}
