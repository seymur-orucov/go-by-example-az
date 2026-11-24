package main

import "fmt"

func main() {
	//@step nil
	var cart []string
	fmt.Println("səbət:", cart, len(cart), cart == nil)

	//@step append
	cart = append(cart, "çörək")
	cart = append(cart, "pendir", "çay")
	fmt.Println("səbət:", cart, len(cart), cap(cart))

	//@step index
	cart[0] = "lavaş"
	fmt.Println("ilk məhsul:", cart[0])

	//@step make
	counts := make([]int, 3)
	counts[2] = 2
	fmt.Println("say:", counts)

	//@step sub
	first := cart[:2]
	first[1] = "yağ"
	fmt.Println("ilk ikisi:", first)
	fmt.Println("səbət:", cart)
}
