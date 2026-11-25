package main

import (
	"fmt"
	"time"
)

func main() {
	pulse := []int{84, 92, 101, 124, 137, 131, 118}

	//@step new-ticker
	warmUp := time.NewTicker(100 * time.Millisecond)
	for i := range 3 {
		<-warmUp.C
		fmt.Println("warm-up pulse:", pulse[i])
	}

	//@step stop
	warmUp.Stop()
	select {
	case <-warmUp.C:
		fmt.Println("extra reading")
	case <-time.After(300 * time.Millisecond):
		fmt.Println("warm-up over, watch is quiet")
	}

	//@step stop-channel
	readings := make(chan int)
	finish := make(chan struct{})
	go func() {
		workout := time.NewTicker(200 * time.Millisecond)
		defer workout.Stop()
		for i := 3; ; i++ {
			select {
			case <-workout.C:
				readings <- pulse[i]
			case <-finish:
				close(readings)
				return
			}
		}
	}()
	count := 0
	for p := range readings {
		fmt.Println("workout pulse:", p)
		count++
		if count == 3 {
			close(finish) // the runner taps "finish"
		}
	}
	fmt.Println("readings saved:", count)
}
