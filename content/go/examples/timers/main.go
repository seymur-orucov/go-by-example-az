package main

import (
	"fmt"
	"time"
)

func main() {
	//@step new-timer
	eggs := time.NewTimer(100 * time.Millisecond)
	fmt.Println("eggs on the stove")
	<-eggs.C
	fmt.Println("ring: eggs are ready")

	//@step stop
	pasta := time.NewTimer(time.Second)
	tasted := make(chan struct{})
	go func() {
		time.Sleep(100 * time.Millisecond) // the cook tastes it early
		close(tasted)
	}()
	select {
	case <-pasta.C:
		fmt.Println("ring: pasta is ready")
	case <-tasted:
		fmt.Println("pasta taken out early")
		fmt.Println("pasta timer stopped:", pasta.Stop())
	}
	fmt.Println("eggs timer stopped:", eggs.Stop())

	//@step after-func
	stirred := make(chan struct{})
	time.AfterFunc(200*time.Millisecond, func() {
		fmt.Println("reminder: stir the soup")
		close(stirred)
	})
	fmt.Println("soup is simmering")
	<-stirred
}
