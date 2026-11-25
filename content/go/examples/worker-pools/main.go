package main

import (
	"fmt"
	"time"
)

type Car struct {
	Slot  int // place in the queue
	Plate string
	Full  bool // a full wash also cleans the inside
}

type Wash struct {
	Car
	Price int // USD
}

// @step worker
func bay(cars <-chan Car, washes chan<- Wash) {
	for car := range cars {
		time.Sleep(60 * time.Millisecond) // washing takes a while
		price := 10
		if car.Full {
			price = 25
		}
		washes <- Wash{car, price}
	}
}

// @step pool
func washAll(queue []Car, bays int) []Wash {
	cars := make(chan Car, len(queue))
	washes := make(chan Wash, len(queue))
	for range bays {
		go bay(cars, washes)
	}
	for _, car := range queue {
		cars <- car
	}
	close(cars)

	//@step collect
	done := make([]Wash, len(queue))
	for range len(queue) {
		w := <-washes
		done[w.Slot] = w
	}
	return done
}

//@end

func main() {
	queue := []Car{
		{0, "TX-4821", false}, {1, "NY-1093", true}, {2, "CA-7756", false},
		{3, "FL-3302", true}, {4, "WA-6418", false}, {5, "OH-2287", false},
	}

	//@step results
	total := 0
	for _, w := range washAll(queue, 3) {
		fmt.Println(w.Plate, "washed for", w.Price, "USD")
		total += w.Price
	}
	fmt.Println("total:", total, "USD")

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
