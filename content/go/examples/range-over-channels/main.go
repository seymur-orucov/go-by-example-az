package main

import "fmt"

// @step station
func station(temps []int, readings chan<- int) {
	for _, t := range temps {
		readings <- t
	}
	close(readings)
}

//@end

func main() {
	//@step range
	readings := make(chan int)
	go station([]int{14, 16, 15, 19, 18}, readings)

	count := 0
	for t := range readings {
		fmt.Println("display:", t, "C")
		count++
	}
	fmt.Println("station off after", count, "readings")

	//@step drain
	night := make(chan int, 3)
	night <- 12
	night <- 10
	night <- 9
	close(night)
	for t := range night {
		fmt.Println("night log:", t, "C")
	}
}
