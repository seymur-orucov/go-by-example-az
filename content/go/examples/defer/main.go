package main

import "fmt"

// @step basic
func shift(baker string) {
	fmt.Println(baker, "opens the bakery")
	defer fmt.Println(baker, "locks the door")
	fmt.Println(baker, "bakes bread")
}

// @step order
func closeUp() {
	for _, room := range []string{"oven", "kitchen", "shop"} {
		defer fmt.Println("lights off:", room)
	}
	fmt.Println("closing up")
}

// @step args
func countLoaves() {
	loaves := 10
	defer fmt.Println("at defer:", loaves)
	defer func() { fmt.Println("at the end:", loaves) }()
	loaves = 25
	fmt.Println("now:", loaves)
}

// @step early
func sell(stock map[string]int, item string) bool {
	defer fmt.Println("receipt for", item)
	if stock[item] == 0 {
		return false
	}
	stock[item]--
	return true
}

//@end

func main() {
	shift("Nora")
	closeUp()
	countLoaves()
	stock := map[string]int{"croissant": 1}
	fmt.Println("sold:", sell(stock, "croissant"))
	fmt.Println("sold:", sell(stock, "croissant"))
}
