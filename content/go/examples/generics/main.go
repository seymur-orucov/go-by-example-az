package main

import (
	"cmp"
	"fmt"
)

// @step func
func Tally[K comparable](answers []K) map[K]int {
	counts := map[K]int{}
	for _, a := range answers {
		counts[a]++
	}
	return counts
}

// @step constraint
type Stars int

func Clamp[T cmp.Ordered](v, lo, hi T) T {
	if v < lo {
		return lo
	}
	if v > hi {
		return hi
	}
	return v
}

// @step type
type Shortlist[T any] struct {
	Items []T
	Max   int
}

func (s *Shortlist[T]) Add(item T) bool {
	if len(s.Items) == s.Max {
		return false
	}
	s.Items = append(s.Items, item)
	return true
}

//@end

func main() {
	fmt.Println(Tally([]string{"pool", "spa", "pool", "gym"}))
	fmt.Println(Tally([]int{5, 4, 5, 5}))

	fmt.Println(Clamp(7, 1, 5), Clamp(-2, 1, 5))
	fmt.Println(Clamp(Stars(9), 1, 5), Clamp(4.5, 1, 5))

	ideas := Shortlist[string]{Max: 2}
	fmt.Println(ideas.Add("late checkout"), ideas.Add("bike rental"), ideas.Add("sauna"))
	fmt.Println(ideas.Items)
}
