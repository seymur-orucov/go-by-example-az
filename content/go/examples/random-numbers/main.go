package main

import (
	"fmt"
	"math/rand/v2"
	"slices"
)

func main() {
	//@step intn
	ops := []string{"+", "-", "*"}
	op := ops[rand.IntN(len(ops))]
	fmt.Println("operator is valid:", slices.Contains(ops, op))

	//@step range
	inRange := true
	for range 1000 {
		n := 10 + rand.IntN(90) // two-digit operand: [10, 100)
		if n < 10 || n >= 100 {
			inRange = false
		}
	}
	fmt.Println("1000 operands, all two-digit:", inRange)

	//@step shuffle
	answers := []int{91, 81, 101, 19} // options for 47 + 44, correct first
	rand.Shuffle(len(answers), func(i, j int) {
		answers[i], answers[j] = answers[j], answers[i]
	})
	fmt.Println("4 options, correct one kept:", len(answers) == 4 && slices.Contains(answers, 91))
	order := rand.Perm(5)
	slices.Sort(order)
	fmt.Println("question order, sorted:", order)

	//@step seeded
	sheet := rand.New(rand.NewPCG(3, 2026)) // worksheet No. 3 of 2026
	for range 3 {
		a, b := 10+sheet.IntN(90), 10+sheet.IntN(90)
		fmt.Printf("%d + %d = ?\n", a, b)
	}
	reprint := rand.New(rand.NewPCG(3, 2026))
	fmt.Println("reprint starts with", 10+reprint.IntN(90))
}
