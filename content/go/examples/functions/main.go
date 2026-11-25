package main

import "fmt"

const adultPrice = 10
const kidPrice = 6

// @step declare
func ticketPrice(age int) int {
	if age < 12 {
		return kidPrice
	}
	return adultPrice
}

// @step params
func orderTotal(adults, kids int) int {
	return adults*adultPrice + kids*kidPrice
}

// @step no-result
func printTicket(movie string, age int) {
	fmt.Println("ticket:", movie, "-", ticketPrice(age), "USD")
}

// @step copy
func discount(price int) int {
	price -= 2
	return price
}

//@end

func main() {
	fmt.Println("age 8:", ticketPrice(8), "USD")
	fmt.Println("age 35:", ticketPrice(35), "USD")
	fmt.Println("2 adults + 3 kids:", orderTotal(2, 3), "USD")
	printTicket("Space Trip", 9)

	price := 10
	newPrice := discount(price)
	fmt.Println("price:", price, "after discount:", newPrice)
}
