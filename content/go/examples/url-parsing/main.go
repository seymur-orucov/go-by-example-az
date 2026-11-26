package main

import (
	"fmt"
	"net/url"
)

func main() {
	//@step parse
	link := "https://tester:s3cret@staging.stayfinder.example:8443/search/baku?nights=3&room=double&room=single#map"
	u, err := url.Parse(link)
	if err != nil {
		fmt.Println(err)
		return
	}
	fmt.Println("scheme:", u.Scheme)
	fmt.Println("host:", u.Host)
	fmt.Println("hostname:", u.Hostname(), "port:", u.Port())

	//@step user
	_, hasPassword := u.User.Password()
	fmt.Println("user:", u.User.Username(), "has password:", hasPassword)
	fmt.Println("log:", u.Redacted())

	//@step path
	fmt.Println("path:", u.Path)
	fmt.Println("raw query:", u.RawQuery)
	fmt.Println("fragment:", u.Fragment)

	//@step query
	params := u.Query()
	fmt.Println("nights:", params.Get("nights"))
	fmt.Println("rooms:", params["room"], "first:", params.Get("room"))
	fmt.Printf("pets: %q %v\n", params.Get("pets"), params.Has("pets"))

	//@step build
	filters := url.Values{}
	filters.Set("nights", "2")
	filters.Set("city", "New York")
	filters.Add("room", "double")
	filters.Add("room", "single")
	fmt.Println("https://stayfinder.example/search?" + filters.Encode())
	fmt.Println("note=" + url.QueryEscape("sea view & late check-in"))
}
