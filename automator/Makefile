SRCS = $(wildcard *.applescript)
OBJS=$(SRCS:.applescript=.scpt)

%.scpt: %.applescript
	osacompile -o $@ $<

all: $(OBJS)

clean:
	rm -v *.scpt

.PHONY: clean
