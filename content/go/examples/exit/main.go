package main

import (
	"fmt"
	"os"
)

// @step code
func backup(needGB, freeGB int) int {
	defer fmt.Println("backup: lock released")
	if freeGB < needGB {
		fmt.Fprintf(os.Stderr, "error: need %d GB, only %d GB free\n", needGB, freeGB)
		return 1
	}
	fmt.Println("backup: done")
	return 0
}

//@end

func main() {
	//@step defer
	defer fmt.Println("main: temp folder removed")

	//@step run
	fmt.Println("first run:", backup(20, 50))
	code := backup(40, 25)

	//@step exit
	fmt.Println("exiting with code", code)
	os.Exit(code)
}
