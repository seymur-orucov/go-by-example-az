package main

import "fmt"

func main() {
	//@step var
	var student = "Alice"
	fmt.Println("student:", student)

	//@step typed
	var history, physics int = 80, 90
	fmt.Println(history, physics)

	//@step zero
	var retakes int
	var passed bool
	var comment string
	fmt.Println(retakes, passed)
	fmt.Println("comment is empty:", comment == "")

	//@step short
	average := (history + physics) / 2
	history = 100
	fmt.Println(average, history)
}
