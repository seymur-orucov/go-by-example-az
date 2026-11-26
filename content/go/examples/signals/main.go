package main

import (
	"fmt"
	"os"
	"os/signal"
	"syscall"
)

// @step simulate
// pressCtrlC stands in for the user: on Ctrl+C the OS sends os.Interrupt
// and signal.Notify puts it into the channel. Here we put it there ourselves.
func pressCtrlC(sigs chan<- os.Signal) {
	sigs <- os.Interrupt
}

//@end

func main() {
	//@step notify
	sigs := make(chan os.Signal, 1)
	signal.Notify(sigs, os.Interrupt, syscall.SIGTERM)
	defer signal.Stop(sigs)

	//@step loop
	queue := []string{"invoice-17.pdf", "menu.pdf", "poster.pdf", "flyer.pdf"}
	var sig os.Signal
	printed := 0
	for _, doc := range queue {
		select {
		case sig = <-sigs:
		default:
		}
		if sig != nil {
			break
		}
		fmt.Println("printed", doc)
		printed++
		if doc == "menu.pdf" {
			pressCtrlC(sigs) // the shop owner loses patience
		}
	}

	//@step shutdown
	if sig != nil {
		fmt.Println("received", sig, "- shutting down")
		fmt.Println("saved for later:", queue[printed:])
	}
}
