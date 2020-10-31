#!/usr/bin/osascript
set jsonpath to POSIX file "/Users/aping1/code/github/applescript-json/json.scpt"
set json to load script (jsonpath as alias)

tell application id "com.culturedcode.ThingsMac"
	set theList to {" "}
	
	set today to (current date)
	set time of today to 0
	set todos to to dos of list "Today"
	repeat with eachToDo in todos
		set theProject to project of eachToDo
		set theArea to area of eachToDo
		set theContact to contact of eachToDo
		try
			set theProject to name of theProject as text
		end try
		try
			set theArea to name of theArea as text
		end try
		try
			set theContact to name of theContact as text
		end try
		try
			set myThis to json's createDictWith(�
			{{"id", id of eachToDo as text}, �
			{"name", name of eachToDo as text}, �
			{"creation", creation date of eachToDo}, �
			{"modification_date", modification date of eachToDo}, �
			{"due", due date of eachToDo}, �
			{"activation_date", activation date of eachToDo}, �
			{"completion_date", completion date of eachToDo}, �
			{"cancellation_date", cancellation date of eachToDo}, �
			{"status", status of eachToDo as text}, �
			{"tags", tag names of eachToDo}, �
			{"notes", notes of eachToDo as text}, �
			{"project", theProject}, �
			{"area", theArea}, �
			{"contact", theContact}})
			copy myThis to end of theList
		on error errMsg number errNum
			log errMsg & " " & errNum
		end try
	end repeat
	-- set AppleScript's text item delimiters to (return)
	return json's encodeList(theList)
end tell
