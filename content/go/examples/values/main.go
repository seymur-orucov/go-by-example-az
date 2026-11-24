package main

import "fmt"

func main() {
	//@step strings
	fmt.Println("Qara" + " " + "çay")

	//@step ints
	fmt.Println("iki filialda stol:", 12+8)
	fmt.Println("50 dollar, 4 nəfər:", 50/4)

	//@step floats
	fmt.Println("50 dollar, 4 nəfər:", 50.0/4)

	//@step bools
	fmt.Println("açıqdır və boş stol var:", true && false)
	fmt.Println("çay və ya kofe var:", true || false)
	fmt.Println("bağlıdır:", !true)
	fmt.Println("stol sayı 10-dan çoxdur:", 12 > 10)
}
