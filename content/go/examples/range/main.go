package main

import "fmt"

func main() {
	//@step slice
	stops := []string{"Gənclik", "Sahil", "İçərişəhər"}
	for i, stop := range stops {
		fmt.Println(i+1, "-", stop)
	}

	//@step blank
	minutes := []int{4, 3, 2}
	total := 0
	for _, m := range minutes {
		total += m
	}
	fmt.Println("yol:", total, "dəqiqə")

	//@step map
	riders := map[string]int{"Gənclik": 120, "Sahil": 80, "İçərişəhər": 150}
	busiest, most := "", 0
	for station, n := range riders {
		if n > most {
			busiest, most = station, n
		}
	}
	fmt.Println("ən sıx:", busiest, most)

	//@step int
	for car := range 3 {
		fmt.Println("vaqon", car+1, "yoxlanıldı")
	}
}
