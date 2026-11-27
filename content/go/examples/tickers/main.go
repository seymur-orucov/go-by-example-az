package main

import (
	"fmt"
	"time"
)

func main() {
	//@step new-ticker
	warmUp := time.NewTicker(100 * time.Millisecond)
	for _, p := range []int{84, 92, 101} {
		<-warmUp.C
		fmt.Println("warm-up pulse:", p)
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
		for n := 1; ; n++ {
			select {
			case <-workout.C:
				readings <- n
			case <-finish:
				close(readings)
				return
			}
		}
	}()
	count := 0
	for n := range readings {
		fmt.Println("workout reading:", n)
		count++
		if count == 3 {
			close(finish) // the runner taps "finish"
		}
	}
	fmt.Println("readings saved:", count)
}
