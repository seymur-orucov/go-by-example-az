package main

import "fmt"

func main() {
	//@step classic
	for month := 1; month <= 3; month++ {
		fmt.Println("ay", month, "- hesaba 120 USD qoyuldu")
	}

	//@step condition
	balance, months := 0, 0
	for balance < 500 {
		balance += 120
		months++
	}
	fmt.Println(months, "aya", balance, "USD yığıldı")

	//@step forever
	for {
		balance -= 200
		fmt.Println("qalıq:", balance, "USD")
		if balance < 200 {
			break
		}
	}

	//@step skip
	for month := 1; month <= 5; month++ {
		if month == 3 {
			continue
		}
		fmt.Println("ay", month, "- ödəniş alındı")
	}
}
