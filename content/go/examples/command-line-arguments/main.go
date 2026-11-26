package main

import (
	"errors"
	"fmt"
	"os"
	"strconv"
)

func main() {
	//@step os-args
	fmt.Println("count:", len(os.Args))
	fmt.Println("given:", os.Args[1:])

	//@step real
	avg, err := average(os.Args[1:])
	if err != nil {
		fmt.Println("error:", err)
	} else {
		fmt.Println("average:", avg)
	}

	//@step simulate
	// The same as running: ./grades 78 92 85
	fmt.Println(average([]string{"78", "92", "85"}))
	// The same as running: ./grades 78 ninety
	fmt.Println(average([]string{"78", "ninety"}))
}

// @step convert
func average(scores []string) (int, error) {
	if len(scores) == 0 {
		return 0, errors.New("usage: grades SCORE...")
	}
	sum := 0
	for _, s := range scores {
		n, err := strconv.Atoi(s)
		if err != nil {
			return 0, fmt.Errorf("bad score %q", s)
		}
		sum += n
	}
	return sum / len(scores), nil
}
