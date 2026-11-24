package main

import (
	"fmt"
	"math"
)

// @step declare
const s string = "sabit"

//@end

func main() {
	//@step use
	fmt.Println(s)

	//@step untyped
	const n = 500000000
	const d = 3e20 / n
	fmt.Println(d)

	//@step convert
	fmt.Println(int64(d))
	fmt.Println(math.Sin(n))
}
