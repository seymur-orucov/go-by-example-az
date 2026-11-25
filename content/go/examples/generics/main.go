package main

import (
	"cmp"
	"fmt"
)

// @step problem
func maxFloat(xs []float64) float64 {
	best := xs[0]
	for _, x := range xs {
		if x > best {
			best = x
		}
	}
	return best
}

// @step generic
func Max[T cmp.Ordered](xs []T) T {
	best := xs[0]
	for _, x := range xs {
		if x > best {
			best = x
		}
	}
	return best
}

// @step comparable
func Count[T comparable](xs []T, want T) int {
	n := 0
	for _, x := range xs {
		if x == want {
			n++
		}
	}
	return n
}

// @step type
type Log[T any] struct {
	items []T
}

func (l *Log[T]) Add(v T) {
	l.items = append(l.items, v)
}

func (l *Log[T]) Latest() (T, bool) {
	if len(l.items) == 0 {
		var zero T
		return zero, false
	}
	return l.items[len(l.items)-1], true
}

//@end

func main() {
	temps := []float64{19.5, 22.0, 21.5}
	humidity := []int{40, 55, 48}
	fmt.Println("max temp:", maxFloat(temps))

	fmt.Println("max temp:", Max(temps), "max humidity:", Max(humidity))

	doors := []string{"open", "close", "open"}
	motion := []bool{false, true, false, false}
	fmt.Println("door opened:", Count(doors, "open"), "motion:", Count(motion, true))

	var readings Log[float64]
	fmt.Println(readings.Latest())
	readings.Add(21.5)
	fmt.Println(readings.Latest())
}
