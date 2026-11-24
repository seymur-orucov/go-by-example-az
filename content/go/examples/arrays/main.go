package main

import "fmt"

func main() {
	//@step zero
	var rain [7]int
	fmt.Println("yağış:", rain, len(rain))

	//@step literal
	temps := [7]int{12, 14, 11, 15, 17, 16, 13}
	temps[6] = 18
	fmt.Println("temperatur:", temps)
	fmt.Println("çərşənbə:", temps[2])

	//@step loop
	warmest := temps[0]
	for i := 1; i < len(temps); i++ {
		if temps[i] > warmest {
			warmest = temps[i]
		}
	}
	fmt.Println("ən isti gün:", warmest, "dərəcə")

	//@step copy
	forecast := temps
	forecast[0] = 20
	fmt.Println("proqnoz:", forecast[0], "fakt:", temps[0])
	fmt.Println("eynidir:", forecast == temps)
}
