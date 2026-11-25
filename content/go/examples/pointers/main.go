package main

import "fmt"

func main() {
	//@step address
	free := 12
	p := &free
	fmt.Println("free spots:", *p)
	*p = 11
	fmt.Println("after one car:", free)

	//@step param
	parkCopy(free)
	fmt.Println("after parkCopy:", free)
	park(&free)
	fmt.Println("after park:", free)

	//@step nil
	var vip *int
	fmt.Println("vip level:", vip, vip == nil)

	//@step new
	vip = new(int)
	fmt.Println("new vip level:", *vip)
	*vip = 4
	park(vip)
	fmt.Println("vip spots:", *vip)
}

func parkCopy(spots int) {
	spots--
}

func park(spots *int) {
	*spots--
}
