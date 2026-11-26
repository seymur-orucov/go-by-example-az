package main

import (
	"encoding/base64"
	"fmt"
)

func main() {
	//@step encode
	invite := []byte("Free Friday? Alien (~117 min)")
	std := base64.StdEncoding.EncodeToString(invite)
	fmt.Println(len(invite), "bytes ->", len(std), "characters")
	fmt.Println(std)

	//@step decode
	back, err := base64.StdEncoding.DecodeString(std)
	fmt.Println(string(back), err)
	_, err = base64.StdEncoding.DecodeString("Free Friday?")
	fmt.Println("error:", err)

	//@step url
	token := base64.URLEncoding.EncodeToString(invite)
	fmt.Println("https://cinema.example.com/invite/" + token)

	//@step raw
	short := base64.RawURLEncoding.EncodeToString(invite)
	fmt.Println(short)
	_, err = base64.URLEncoding.DecodeString(short)
	fmt.Println("wrong decoder:", err)
	msg, err := base64.RawURLEncoding.DecodeString(short)
	fmt.Println(string(msg), err)
}
