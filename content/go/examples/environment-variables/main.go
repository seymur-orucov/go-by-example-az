package main

import (
	"fmt"
	"os"
	"slices"
	"strings"
)

func main() {
	//@step getenv
	port := os.Getenv("KIOSK_PORT")
	fmt.Printf("KIOSK_PORT: %q\n", port)
	if port == "" {
		port = "8080"
	}
	fmt.Println("listening on port", port)

	//@step setenv
	os.Setenv("KIOSK_PORT", "9090")
	os.Setenv("KIOSK_CURRENCY", "USD")
	fmt.Println(os.Getenv("KIOSK_PORT"), os.Getenv("KIOSK_CURRENCY"))

	//@step lookup
	os.Setenv("KIOSK_GREETING", "")
	v, ok := os.LookupEnv("KIOSK_GREETING")
	fmt.Printf("greeting: %q set: %v\n", v, ok)
	v, ok = os.LookupEnv("KIOSK_REGION")
	fmt.Printf("region: %q set: %v\n", v, ok)

	//@step unset
	os.Unsetenv("KIOSK_GREETING")
	_, ok = os.LookupEnv("KIOSK_GREETING")
	fmt.Println("greeting set:", ok)

	//@step environ
	var kiosk []string
	for _, kv := range os.Environ() {
		if strings.HasPrefix(kv, "KIOSK_") {
			kiosk = append(kiosk, kv)
		}
	}
	slices.Sort(kiosk)
	fmt.Println(kiosk)
	name, value, _ := strings.Cut(kiosk[0], "=")
	fmt.Println(name, "->", value)
}
