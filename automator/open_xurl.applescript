#! /usr/bin/osascript

on run (arguments)
	set {oldTID, AppleScript's text item delimiters} to {AppleScript's text item delimiters, space}
	set target to (arguments as text)
	do shell script "open " & target
	set AppleScript's text item delimiters to oldTID
end run
