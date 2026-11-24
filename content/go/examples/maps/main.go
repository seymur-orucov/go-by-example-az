package main

import "fmt"

func main() {
	//@step literal
	stock := map[string]int{"süd": 12, "un": 30}
	fmt.Println("anbar:", stock, len(stock))
	fmt.Println("süd:", stock["süd"])

	//@step set
	stock["bal"] = 8
	stock["süd"] -= 5
	fmt.Println("anbar:", stock)

	//@step missing
	fmt.Println("yağ:", stock["yağ"])
	n, ok := stock["yağ"]
	fmt.Println("yağ var?", n, ok)

	//@step delete
	delete(stock, "un")
	fmt.Println("anbar:", stock, len(stock))

	//@step make
	sold := make(map[string]int)
	sold["süd"]++
	sold["bal"]++
	sold["süd"]++
	fmt.Println("satılıb:", sold)
}
