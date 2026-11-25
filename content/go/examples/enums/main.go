package main

import "fmt"

// @step iota
type Stage int

const (
	Idle Stage = iota
	Washing
	Rinsing
	Spinning
	Done
)

// @step string
func (s Stage) String() string {
	switch s {
	case Idle:
		return "idle"
	case Washing:
		return "washing"
	case Rinsing:
		return "rinsing"
	case Spinning:
		return "spinning"
	case Done:
		return "done"
	}
	return "unknown"
}

// @step next
func (s Stage) Next() Stage {
	if s == Done {
		return Done
	}
	return s + 1
}

//@end

func main() {
	fmt.Println(int(Idle), int(Rinsing), int(Done))

	fmt.Println(Rinsing, Stage(7))

	for s := Idle; s != Done; s = s.Next() {
		fmt.Print(s, " -> ")
	}
	fmt.Println(Done)
}
