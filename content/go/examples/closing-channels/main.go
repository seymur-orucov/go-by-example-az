package main

import "fmt"

// @step close
func teacher(points []int, questions chan<- int) {
	for _, p := range points {
		questions <- p
	}
	close(questions)
}

//@end

func main() {
	//@step ok
	questions := make(chan int)
	go teacher([]int{0, 5, 10}, questions) // the warm-up question is worth 0 points

	total := 0
	for {
		p, ok := <-questions
		if !ok {
			break
		}
		fmt.Println("answered a question worth", p, "points")
		total += p
	}
	fmt.Println("no more questions, score:", total)

	//@step zero
	p, ok := <-questions
	fmt.Println("after close:", p, ok)

	//@step send-closed
	defer func() {
		fmt.Println("late question:", recover())
	}()
	questions <- 20
}
