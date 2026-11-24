package main

import "fmt"

func main() {
	//@step value
	day := "Saturday"
	switch day {
	case "Monday":
		fmt.Println("the library is closed")
	case "Saturday":
		fmt.Println("the library is open from 10:00 to 14:00")
	default:
		fmt.Println("the library is open from 09:00 to 18:00")
	}

	//@step multi
	genre := "novella"
	switch genre {
	case "novel", "novella", "short story":
		fmt.Println("fiction shelf")
	case "dictionary", "encyclopedia":
		fmt.Println("reference shelf")
	default:
		fmt.Println("other shelves")
	}

	//@step cond
	books := 3
	switch {
	case books == 0:
		fmt.Println("no books borrowed yet")
	case books < 5:
		fmt.Println("you can borrow more books")
	default:
		fmt.Println("limit reached, return a book first")
	}
}
