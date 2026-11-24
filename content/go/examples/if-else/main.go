package main

import "fmt"

func main() {
	//@step if
	temp := 4
	raining := true
	if temp < 10 && raining {
		fmt.Println("gödəkçə və çətir götür")
	}

	//@step else
	if temp < 0 {
		fmt.Println("yollar buz bağlayıb")
	} else {
		fmt.Println("yollar buz bağlamayıb")
	}

	//@step chain
	if temp < 0 {
		fmt.Println("dondurucu")
	} else if temp < 15 {
		fmt.Println("sərin")
	} else if temp < 25 {
		fmt.Println("mülayim")
	} else {
		fmt.Println("isti")
	}

	//@step init
	if feels := temp - 3; feels < 5 {
		fmt.Println("hiss olunan:", feels, "dərəcə")
	}
}
