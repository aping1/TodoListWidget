#!/usr/bin/osascript

on run argv
tell application id "com.culturedcode.ThingsMac"
	set taskId to item 1 of argv 
	set toDoToComplete to to do named taskId
	set status of toDoToComplete to open
end tell
end run 
