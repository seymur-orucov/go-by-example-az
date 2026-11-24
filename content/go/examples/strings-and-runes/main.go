package main

import (
	"fmt"
	"unicode/utf8"
)

func main() {
	//@step bytes
	city := "Şəki"
	fmt.Println(len(city), "bayt")
	fmt.Println(utf8.RuneCountInString(city), "hərf")

	//@step index
	fmt.Println(city[4], string(city[4]))
	fmt.Println(city[:2])

	//@step runes
	letters := []rune(city)
	fmt.Println(len(letters), letters[1], string(letters[1]))

	//@step range
	for i, r := range city {
		fmt.Println(i, string(r))
	}

	//@step literal
	word := "Lənkəran"
	count := 0
	for _, r := range word {
		if r == 'ə' {
			count++
		}
	}
	fmt.Println(word, "sözündə", count, "ə var")
}
