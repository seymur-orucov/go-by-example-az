package main

import "fmt"

func main() {
	//@step strings
	fmt.Println("go" + "lang")

	//@step numbers
	fmt.Println("1+1 =", 1+1)
	fmt.Println("7/2 =", 7/2)
	fmt.Println("7.0/2 =", 7.0/2)

	//@step bools
	fmt.Println(true && false)
	fmt.Println(true || false)
	fmt.Println(!true)
}
