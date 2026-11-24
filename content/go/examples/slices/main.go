package main

import "fmt"

func main() {
	//@step nil
	var s []string
	fmt.Println("boş:", s, len(s))

	//@step make
	s = make([]string, 3)
	s[0] = "a"
	s[1] = "b"
	s[2] = "c"
	fmt.Println("make:", s, len(s))

	//@step append
	s = append(s, "d", "e")
	fmt.Println("append:", s, len(s), cap(s))

	//@step slice
	fmt.Println("kəsik:", s[1:3])

	//@step literal
	t := []int{1, 2, 3}
	fmt.Println("qısa:", t)
}
