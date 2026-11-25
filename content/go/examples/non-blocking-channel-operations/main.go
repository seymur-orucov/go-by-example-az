package main

import (
	"fmt"
	"time"
)

func main() {
	//@step try-receive
	chat := make(chan string, 1)
	go func() {
		time.Sleep(600 * time.Millisecond)
		chat <- "Rashad: rematch?"
	}()
	for frame := 1; frame <= 3; frame++ {
		select {
		case msg := <-chat:
			fmt.Println("frame", frame, "- new message:", msg)
		default:
			fmt.Println("frame", frame, "- no new messages")
		}
		time.Sleep(400 * time.Millisecond)
	}

	//@step try-send
	popups := make(chan string, 2)
	for _, note := range []string{"level up", "new skin", "daily bonus"} {
		select {
		case popups <- note:
			fmt.Println("queued:", note)
		default:
			fmt.Println("queue full, dropped:", note)
		}
	}

	//@step drain
show:
	for {
		select {
		case note := <-popups:
			fmt.Println("show:", note)
		default:
			break show
		}
	}
	fmt.Println("popups left:", len(popups))
}
