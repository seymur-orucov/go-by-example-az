package main

import "fmt"

// @step send-only
func fill(flavors []string, filled chan<- string) {
	for _, f := range flavors {
		filled <- f + " juice"
	}
}

// @step receive-only
func label(n int, filled <-chan string, labeled chan<- string) {
	for range n {
		bottle := <-filled
		labeled <- bottle + " [labeled]"
	}
}

//@end

func main() {
	//@step convert
	flavors := []string{"apple", "cherry", "mango"}
	filled := make(chan string)
	labeled := make(chan string)

	go fill(flavors, filled)
	go label(len(flavors), filled, labeled)
	for range len(flavors) {
		fmt.Println("packed:", <-labeled)
	}
}
