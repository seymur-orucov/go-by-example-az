package main

import "fmt"

func main() {
	//@step literal
	stock := map[string]int{"milk": 12, "flour": 30}
	fmt.Println("stock:", stock, len(stock))
	fmt.Println("milk:", stock["milk"])

	//@step set
	stock["honey"] = 8
	stock["milk"] -= 5
	fmt.Println("stock:", stock)

	//@step missing
	fmt.Println("butter:", stock["butter"])
	n, ok := stock["butter"]
	fmt.Println("butter in stock?", n, ok)

	//@step delete
	delete(stock, "flour")
	fmt.Println("stock:", stock, len(stock))

	//@step make
	sold := make(map[string]int)
	sold["milk"]++
	sold["honey"]++
	sold["milk"]++
	fmt.Println("sold:", sold)
}
