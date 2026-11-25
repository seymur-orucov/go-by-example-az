package main

import "fmt"

// @step two
func split(bill, people int) (int, int) {
	return bill / people, bill % people
}

// @step ok
func pay(balance, amount int) (int, bool) {
	if amount > balance {
		return balance, false
	}
	return balance - amount, true
}

// @step named
func withTax(subtotal int) (tax, total int) {
	tax = subtotal / 10
	total = subtotal + tax
	return
}

//@end

func main() {
	each, left := split(50, 3)
	fmt.Println("each pays:", each, "USD, left over:", left, "USD")

	balance, ok := pay(40, 25)
	fmt.Println("paid?", ok, "balance:", balance)
	balance, ok = pay(balance, 30)
	fmt.Println("paid?", ok, "balance:", balance)

	tax, total := withTax(50)
	fmt.Println("tax:", tax, "total:", total, "USD")

	//@step blank
	share, _ := split(90, 4)
	fmt.Println("next table, each pays:", share, "USD")
}
