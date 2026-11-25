package main

import "fmt"

// @step embed
type Address struct {
	City   string
	Street string
}

func (a Address) Label() string {
	return a.Street + ", " + a.City
}

type Customer struct {
	Name string
	Address
}

// @step override
type Warehouse struct {
	Code string
	Address
}

func (w Warehouse) Label() string {
	return "warehouse " + w.Code + ": " + w.Address.Label()
}

// @step interface
type Labeler interface {
	Label() string
}

//@end

func main() {
	mia := Customer{
		Name:    "Mia",
		Address: Address{City: "Lyon", Street: "12 Silk Street"},
	}
	fmt.Println(mia.Name, "lives in", mia.City)
	fmt.Println(mia.Label())

	depot := Warehouse{Code: "W2", Address: Address{City: "Lyon", Street: "4 Port Road"}}
	fmt.Println(depot.Label())
	fmt.Println(depot.Address.Label())

	stickers := []Labeler{mia, depot}
	for _, s := range stickers {
		fmt.Println("sticker:", s.Label())
	}
}
