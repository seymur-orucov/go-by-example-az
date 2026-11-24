package main

import "fmt"

func main() {
	//@step slice
	stops := []string{"Central", "Harbor", "Old Town"}
	for i, stop := range stops {
		fmt.Println(i+1, "-", stop)
	}

	//@step blank
	minutes := []int{4, 3, 2}
	total := 0
	for _, m := range minutes {
		total += m
	}
	fmt.Println("ride:", total, "minutes")

	//@step map
	riders := map[string]int{"Central": 120, "Harbor": 80, "Old Town": 150}
	busiest, most := "", 0
	for station, n := range riders {
		if n > most {
			busiest, most = station, n
		}
	}
	fmt.Println("busiest:", busiest, most)

	//@step int
	for car := range 3 {
		fmt.Println("car", car+1, "checked")
	}
}
