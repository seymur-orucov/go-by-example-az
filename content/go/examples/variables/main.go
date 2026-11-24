package main

import "fmt"

func main() {
	//@step var
	var a = "salam"
	fmt.Println(a)

	//@step typed
	var b, c int = 1, 2
	fmt.Println(b, c)

	//@step zero
	var d int
	var e bool
	var f string
	fmt.Println(d, e)
	fmt.Println("f boşdur:", f == "")

	//@step short
	g := "alma"
	g = "armud"
	fmt.Println(g)
}
