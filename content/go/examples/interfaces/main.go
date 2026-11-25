package main

import "fmt"

// @step define
type Shipping interface {
	Price(kg int) int
}

type Courier struct {
	PerKg int
}

func (c Courier) Price(kg int) int {
	return c.PerKg * kg
}

type Locker struct{}

func (l Locker) Price(kg int) int {
	return 4
}

// @step use
func cheapest(options []Shipping, kg int) int {
	best := options[0].Price(kg)
	for _, o := range options {
		if o.Price(kg) < best {
			best = o.Price(kg)
		}
	}
	return best
}

// @step switch
func describe(s Shipping) {
	switch v := s.(type) {
	case Courier:
		fmt.Println("courier:", v.PerKg, "USD per kg")
	case Locker:
		fmt.Println("parcel locker: flat price")
	}
}

//@end

func main() {
	var s Shipping = Courier{PerKg: 2}
	fmt.Println("courier, 3 kg:", s.Price(3), "USD")
	s = Locker{}
	fmt.Println("locker, 3 kg:", s.Price(3), "USD")

	options := []Shipping{Courier{PerKg: 2}, Locker{}}
	fmt.Println("cheapest, 1 kg:", cheapest(options, 1), "USD")
	fmt.Println("cheapest, 5 kg:", cheapest(options, 5), "USD")

	for _, o := range options {
		describe(o)
	}
}
