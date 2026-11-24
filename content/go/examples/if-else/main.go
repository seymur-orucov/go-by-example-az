package main

import "fmt"

func main() {
	//@step if
	temp := 4
	raining := true
	if temp < 10 && raining {
		fmt.Println("take a jacket and an umbrella")
	}

	//@step else
	if temp < 0 {
		fmt.Println("the roads are icy")
	} else {
		fmt.Println("the roads are not icy")
	}

	//@step chain
	if temp < 0 {
		fmt.Println("freezing")
	} else if temp < 15 {
		fmt.Println("cool")
	} else if temp < 25 {
		fmt.Println("mild")
	} else {
		fmt.Println("warm")
	}

	//@step init
	if feels := temp - 3; feels < 5 {
		fmt.Println("feels like:", feels, "C")
	}
}
