package main

import (
	"bytes"
	"crypto/sha256"
	"encoding/base64"
	"fmt"
)

func main() {
	//@step encode
	sum := sha256.Sum256([]byte("invite 1021"))
	std := base64.StdEncoding.EncodeToString(sum[:])
	fmt.Println(len(sum), "bytes ->", len(std), "characters")
	fmt.Println(std)

	//@step decode
	back, err := base64.StdEncoding.DecodeString(std)
	fmt.Println(bytes.Equal(back, sum[:]), err)
	_, err = base64.StdEncoding.DecodeString("invite 1021")
	fmt.Println("error:", err)

	//@step url
	token := base64.URLEncoding.EncodeToString(sum[:])
	fmt.Println("https://cinema.example.com/invite/" + token)

	//@step raw
	short := base64.RawURLEncoding.EncodeToString(sum[:])
	fmt.Println(short)
	_, err = base64.URLEncoding.DecodeString(short)
	fmt.Println("wrong decoder:", err)
	back, err = base64.RawURLEncoding.DecodeString(short)
	fmt.Println(bytes.Equal(back, sum[:]), err)
}
