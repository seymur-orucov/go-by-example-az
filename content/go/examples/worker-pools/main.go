package main

import (
	"fmt"
	"time"
)

type Car struct {
	Slot  int // place in the queue
	Plate string
}

// @step worker
func bay(cars <-chan Car, washes chan<- Car) {
	for car := range cars {
		time.Sleep(60 * time.Millisecond) // washing takes a while
		washes <- car
	}
}

// @step pool
func washAll(plates []string, bays int) []string {
	cars := make(chan Car, len(plates))
	washes := make(chan Car, len(plates))
	for range bays {
		go bay(cars, washes)
	}
	for i, p := range plates {
		cars <- Car{i, p}
	}
	close(cars)

	//@step collect
	done := make([]string, len(plates))
	for range len(plates) {
		car := <-washes
		done[car.Slot] = car.Plate
	}
	return done
}

//@end

func main() {
	queue := []string{"TX-4821", "NY-1093", "CA-7756", "FL-3302", "WA-6418", "OH-2287"}

	//@step results
	for _, plate := range washAll(queue, 3) {
		fmt.Println(plate, "washed")
	}

	//@step speed
	start := time.Now()
	washAll(queue, 1)
	oneBay := time.Since(start)

	start = time.Now()
	washAll(queue, 3)
	threeBays := time.Since(start)
	fmt.Println("1 bay takes over 300ms:", oneBay > 300*time.Millisecond)
	fmt.Println("3 bays are faster:", threeBays < oneBay)
}
