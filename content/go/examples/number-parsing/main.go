package main

import (
	"errors"
	"fmt"
	"strconv"
)

// Settings come from a thermostat config file, so every value is text.
func main() {
	//@step atoi
	wake := "6"
	hour, err := strconv.Atoi(wake)
	if err != nil {
		fmt.Println(err)
		return
	}
	fmt.Println(wake+"1", hour+1)
	fmt.Println("heating starts at " + strconv.Itoa(hour-1) + ":00")

	//@step float-bool
	target, _ := strconv.ParseFloat("21.5", 64) // known-good text, see the last steps for errors
	eco, _ := strconv.ParseBool("true")
	fmt.Println("target:", target+0.5, "eco:", eco)

	//@step bases
	id, _ := strconv.ParseInt("1F4A", 16, 64) // the device id is printed in hex
	fmt.Println("device id:", id)
	fmt.Println("hex:", strconv.FormatInt(id, 16), "binary:", strconv.FormatInt(id, 2))

	//@step syntax
	_, err = strconv.Atoi("twenty")
	fmt.Println(err)
	fmt.Println("syntax error:", errors.Is(err, strconv.ErrSyntax))

	//@step range
	fan, err := strconv.ParseInt("300", 10, 8) // fan level must fit in int8
	fmt.Println(fan, err)
	fmt.Println("range error:", errors.Is(err, strconv.ErrRange))
	var numErr *strconv.NumError
	if errors.As(err, &numErr) {
		fmt.Println("bad value", numErr.Num, "in", numErr.Func)
	}
}
