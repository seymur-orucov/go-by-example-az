package main

import "fmt"

func countIf(orders []string, keep func(string) bool) int {
	n := 0
	for _, o := range orders {
		if keep(o) {
			n++
		}
	}
	return n
}

func main() {
	//@step literal
	price := func(size string) int {
		if size == "large" {
			return 5
		}
		return 4
	}
	fmt.Println("large latte:", price("large"), "USD")

	//@step capture
	milk := 1
	withMilk := func(size string) int {
		return price(size) + milk
	}
	fmt.Println("small with milk:", withMilk("small"), "USD")
	milk = 2
	fmt.Println("after price change:", withMilk("small"), "USD")

	//@step pass
	orders := []string{"latte", "tea", "latte", "mocha"}
	want := "latte"
	fmt.Println("lattes:", countIf(orders, func(o string) bool {
		return o == want
	}))

	//@step card
	card := newCard()
	fmt.Println(card(), card(), card())
	other := newCard()
	fmt.Println("other card:", other())
}

func newCard() func() string {
	cups := 0
	return func() string {
		cups++
		if cups%3 == 0 {
			return "free"
		}
		return "paid"
	}
}
