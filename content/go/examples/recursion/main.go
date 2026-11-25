package main

import (
	"fmt"
	"strings"
)

var reports = map[string][]string{
	"Ava":  {"Ben", "Cara"},
	"Ben":  {"Dev", "Emma", "Finn"},
	"Cara": {"Gia"},
}

// @step base
func goDown(floor int) {
	if floor == 0 {
		fmt.Println("ground floor")
		return
	}
	fmt.Println("floor", floor)
	goDown(floor - 1)
}

// @step result
func headcount(boss string) int {
	total := 0
	for _, name := range reports[boss] {
		total += 1 + headcount(name)
	}
	return total
}

// @step tree
func printChart(name string, level int) {
	fmt.Println(strings.Repeat("  ", level) + name)
	for _, r := range reports[name] {
		printChart(r, level+1)
	}
}

//@end

func main() {
	goDown(3)
	fmt.Println("people under Ava:", headcount("Ava"))
	fmt.Println("people under Ben:", headcount("Ben"))
	fmt.Println("people under Gia:", headcount("Gia"))
	printChart("Ava", 0)
}
