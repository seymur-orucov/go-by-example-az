package main

import (
	"errors"
	"fmt"
)

var shelf = map[string]bool{"Dune": false}

// @step new
func lateFee(days int) (int, error) {
	if days < 0 {
		return 0, errors.New("days cannot be negative")
	}
	return days * 2, nil
}

// @step sentinel
var (
	ErrNotFound = errors.New("book not found")
	ErrOnLoan   = errors.New("book is on loan")
)

func checkOut(title string) error {
	onLoan, ok := shelf[title]
	if !ok {
		return ErrNotFound
	}
	if onLoan {
		return ErrOnLoan
	}
	shelf[title] = true
	return nil
}

// @step wrap
func borrow(title string) error {
	if err := checkOut(title); err != nil {
		return fmt.Errorf("borrow %s: %w", title, err)
	}
	return nil
}

//@end

func main() {
	fee, err := lateFee(3)
	fmt.Println("fee:", fee, "USD, error:", err)
	if _, err := lateFee(-2); err != nil {
		fmt.Println("error:", err)
	}

	err = checkOut("Dune")
	fmt.Println("Dune:", err)
	err = checkOut("Dune")
	fmt.Println("Dune again:", err, err == ErrOnLoan)

	err = borrow("Atlas")
	fmt.Println(err)
	fmt.Println(err == ErrNotFound, errors.Is(err, ErrNotFound))
}
