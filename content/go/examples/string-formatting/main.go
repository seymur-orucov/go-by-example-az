package main

import (
	"fmt"
	"os"
)

type Paint struct {
	Name    string
	Liters  float64
	InStock bool
}

func main() {
	//@step general
	p := Paint{"Sea Green", 2.5, true}
	fmt.Printf("%v\n", p)
	fmt.Printf("%+v\n", p)
	fmt.Printf("%#v\n", p)
	fmt.Printf("%T\n", p)

	//@step basic
	cans := 3
	note := "matte finish "
	fmt.Printf("%d cans of %s, %.2f L each\n", cans, p.Name, p.Liters)
	fmt.Printf("in stock: %t, note: %q\n", p.InStock, note)

	//@step hex
	r, g, b := 0, 0, 128 // navy
	short := fmt.Sprintf("#%x%x%x", r, g, b)
	code := fmt.Sprintf("#%02x%02x%02x", r, g, b)
	fmt.Println(short, code, len(code))

	//@step table
	order := []Paint{p, {"Ivory", 10, true}, {"Coral", 0.75, false}}
	fmt.Printf("%-10s|%8s|\n", "PAINT", "LITERS")
	for _, o := range order {
		fmt.Printf("%-10s|%8.2f|\n", o.Name, o.Liters)
	}

	//@step fprint
	fmt.Fprintf(os.Stdout, "discount for %d cans: %d%%\n", cans, 15)
}
