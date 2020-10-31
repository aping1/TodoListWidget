import { css } from "uebersicht";
import styles from "../styles.mjs";
import dispatchers from "../dispatchers.mjs";

const {text} = styles;

export const Task = (props) => {

    const reminderButtonHandler = () => {
      dispatchers.changeReminderStatus(props.dispatch, {done: props.done, name: `${props.children}`, id: props.id})
    }
  
    return (
      <div className={`${css({display: "flex", alignItems: "center", marginBottom: "10px"})}`}>
        <button onClick={reminderButtonHandler} className={`${css({
          width: "15px",
          height: "15px",
          borderRadius: "8px",
          border: "1px solid",
          borderColor: props.color,
          backgroundColor: props.done ? props.color : "transparent",
          })}`}></button>
        <p className={`${css({marginLeft: "20px", textAlign: "left"})} ${text}`}>{props.children}</p>
      </div>
    )
  }

export const ThingsTask = (props) => {

    const thingsClick = () => {
      dispatchers.openThingsTodo(props.dispatch, props.id)
    }
    const thingsButtonHandler = () => {
      dispatchers.changeThingsStatus(props.dispatch, {name: `${props.name}`, id: props.id, oldStatus: props.status})
    }
    return (
      <div className={`${css({display: "flex", alignItems: "center", marginBottom: "10px"})}`}>
        <button onClick={thingsButtonHandler} className={`${css({
          width: "15px",
          height: "15px",
          borderRadius: "8px",
          border: "1px solid",
          borderColor: props.color,
          backgroundColor: !!props.completion_date ? props.color : "transparent"})}`}></button>
        <p className={`${css({marginLeft: "20px", textAlign: "left", textDecoration: "none"})} ${text}`} onClick={thingsClick}>
        {props.children}
        </p>
      </div>
    )
  }
