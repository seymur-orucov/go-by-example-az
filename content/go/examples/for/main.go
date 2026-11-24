package main

import "fmt"

func main() {
	//@step classic
	for month := 1; month <= 3; month++ {
		fmt.Println("month", month, "- 120 USD deposited")
	}

	//@step condition
	balance, months := 0, 0
	for balance < 500 {
		balance += 120
		months++
	}
	fmt.Println(balance, "USD saved in", months, "months")

	//@step forever
	for {
		balance -= 200
		fmt.Println("left:", balance, "USD")
		if balance < 200 {
			break
		}
	}

	//@step skip
	for month := 1; month <= 5; month++ {
		if month == 3 {
			continue
		}
		fmt.Println("month", month, "- payment received")
	}
}
