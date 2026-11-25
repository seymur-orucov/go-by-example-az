package main

import (
	"fmt"
	"time"
)

// @step apps
func courierApp(riders []string, gap time.Duration, offers chan<- string) {
	for _, rider := range riders {
		time.Sleep(gap)
		offers <- rider
	}
}

//@end

func main() {
	//@step select
	zoom := make(chan string)
	swift := make(chan string)
	go courierApp([]string{"Aysel", "Tom"}, 100*time.Millisecond, zoom)
	go courierApp([]string{"Mark", "Nina"}, 600*time.Millisecond, swift)

	select {
	case rider := <-zoom:
		fmt.Println("first offer: ZoomEats,", rider)
	case rider := <-swift:
		fmt.Println("first offer: SwiftRide,", rider)
	}

	//@step loop
	for range 3 {
		select {
		case rider := <-zoom:
			fmt.Println("ZoomEats:", rider, "takes the next order")
		case rider := <-swift:
			fmt.Println("SwiftRide:", rider, "takes the next order")
		}
	}
	fmt.Println("all 4 orders assigned")
}
