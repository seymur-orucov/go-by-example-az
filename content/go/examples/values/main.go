package main

import "fmt"

func main() {
	//@step strings
	fmt.Println("Black" + " " + "tea")

	//@step ints
	fmt.Println("tables in two branches:", 12+8)
	fmt.Println("50 dollars, 4 people:", 50/4)

	//@step floats
	fmt.Println("50 dollars, 4 people:", 50.0/4)

	//@step bools
	fmt.Println("open and a free table:", true && false)
	fmt.Println("tea or coffee available:", true || false)
	fmt.Println("closed:", !true)
	fmt.Println("more than 10 tables:", 12 > 10)
}
