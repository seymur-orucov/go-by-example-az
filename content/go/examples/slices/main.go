package main

import "fmt"

func main() {
	//@step nil
	var cart []string
	fmt.Println("cart:", cart, len(cart), cart == nil)

	//@step append
	cart = append(cart, "bread")
	cart = append(cart, "cheese", "tea")
	fmt.Println("cart:", cart, len(cart), cap(cart))

	//@step index
	cart[0] = "flatbread"
	fmt.Println("first item:", cart[0])

	//@step make
	counts := make([]int, 3)
	counts[2] = 2
	fmt.Println("counts:", counts)

	//@step sub
	first := cart[:2]
	first[1] = "butter"
	fmt.Println("first two:", first)
	fmt.Println("cart:", cart)
}
