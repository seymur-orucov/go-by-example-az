package main

import (
	"fmt"
	"slices"
)

func main() {
	//@step numbers
	bibs := []int{318, 42, 1207, 96, 555}
	slices.Sort(bibs)
	fmt.Println("bibs:", bibs)

	minutes := []float64{251.5, 198.25, 312, 205.75}
	slices.Sort(minutes)
	fmt.Println("fastest:", minutes[0], "slowest:", minutes[len(minutes)-1])

	//@step strings
	registered := []string{"Mila", "eva", "Zoe", "Bruno"}
	slices.Sort(registered)
	fmt.Println("registered:", registered)

	//@step clone
	finish := []string{"Omar", "Lena", "Bruno", "Ines"} // order they crossed the line
	names := slices.Clone(finish)
	slices.Sort(names)
	fmt.Println("podium:", finish[:3])
	fmt.Println("certificates:", names)
	fmt.Println(slices.IsSorted(finish), slices.IsSorted(names))

	//@step search
	i, found := slices.BinarySearch(bibs, 555)
	fmt.Println("bib 555:", i, found)
	i, found = slices.BinarySearch(bibs, 100)
	fmt.Println("bib 100:", i, found)
}
