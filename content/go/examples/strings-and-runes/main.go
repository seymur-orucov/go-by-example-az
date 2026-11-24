package main

import (
	"fmt"
	"unicode/utf8"
)

func main() {
	//@step bytes
	city := "Zürich"
	fmt.Println(len(city), "bytes")
	fmt.Println(utf8.RuneCountInString(city), "letters")

	//@step index
	fmt.Println(city[3], string(city[3]))
	fmt.Println(city[:3])

	//@step runes
	letters := []rune(city)
	fmt.Println(len(letters), letters[1], string(letters[1]))

	//@step range
	for i, r := range city {
		fmt.Println(i, string(r))
	}

	//@step literal
	word := "Frühstück"
	count := 0
	for _, r := range word {
		if r == 'ü' {
			count++
		}
	}
	fmt.Println(word, "has", count, "ü")
}
