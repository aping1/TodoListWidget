#!/usr/bin/osascript
tell application "Reminders"
	set listName to display dialog "In which list should I add a reminder?" default answer "Reminders" with icon note buttons {"Cancel", "Continue"} default button "Continue"
	set reminderName to display dialog "Name of reminder to add?" default answer "Reminder" with icon note buttons {"Cancel", "Continue"} default button "Continue"
	
	
	set curDate to current date
	set myList to list listName
	tell myList
		set newReminder to make new reminder
		set name of newReminder to text returned of reminderName
		set allday due date of newReminder to curDate
	end tell
	quit
end tell
