package main

import "fmt"

// @step define
type Parcel struct {
	ID        string
	City      string
	WeightKg  int
	Delivered bool
}

func main() {
	box := Parcel{ID: "P-101", City: "Lisbon", WeightKg: 3}
	fmt.Println(box.City, box.WeightKg, "kg")
	fmt.Println(box)

	//@step zero
	var empty Parcel
	fmt.Println("empty:", empty.WeightKg, empty.Delivered)
	letter := Parcel{ID: "L-7", City: "Oslo"}
	fmt.Println(letter)

	//@step copy
	redirected := box
	redirected.City = "Porto"
	fmt.Println(box.City, redirected.City)
	fmt.Println("same:", box == redirected)

	//@step pointer
	ptr := &box
	ptr.Delivered = true
	fmt.Println("delivered:", box.Delivered)

	//@step slice
	route := []Parcel{box, letter, {ID: "P-102", City: "Oslo", WeightKg: 5}}
	total := 0
	for _, p := range route {
		total += p.WeightKg
	}
	fmt.Println("route:", len(route), "parcels,", total, "kg")
}
