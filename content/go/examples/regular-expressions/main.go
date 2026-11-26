package main

import (
	"fmt"
	"regexp"
)

func main() {
	//@step match
	key := regexp.MustCompile(`^[A-Z]{2,5}-\d+$`)
	for _, typed := range []string{"PAY-142", "pay-142", "PAY142", "PAY-142!"} {
		fmt.Println(typed, key.MatchString(typed))
	}

	//@step find
	commit := "fix PAY-142 and SHOP-7, tested on build A-12"
	ticket := regexp.MustCompile(`[A-Z]{2,5}-\d+`)
	fmt.Println(ticket.FindString(commit))
	fmt.Println(ticket.FindAllString(commit, -1))

	//@step groups
	parts := regexp.MustCompile(`([A-Z]{2,5})-(\d+)`)
	m := parts.FindStringSubmatch(commit)
	fmt.Printf("%d parts: %q\n", len(m), m)
	fmt.Println("project:", m[1], "number:", m[2])
	fmt.Println(parts.FindStringSubmatch("build A-12") == nil)

	//@step replace
	fmt.Println(parts.ReplaceAllString(commit, "/issues/$1/$2"))

	//@step compile
	filter := `PAY-(\d+` // typed by a user in the search box, the ) is missing
	if _, err := regexp.Compile(filter); err != nil {
		fmt.Println("bad filter:", err)
	}
}
