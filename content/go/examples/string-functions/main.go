package main

import (
	"fmt"
	"strings"
)

func main() {
	//@step clean
	raw := "  Lena.Park@Uni-Mail.EDU \n"
	email := strings.ToLower(strings.TrimSpace(raw))
	fmt.Println("[" + email + "]")
	fmt.Println(len(raw), len(email))

	//@step search
	at := strings.Index(email, "@")
	fmt.Println(strings.Contains(email, "@"), at)
	fmt.Println("domain:", email[at+1:])
	fmt.Println("student:", strings.HasSuffix(email, ".edu"))

	//@step split
	tags := strings.Split("#go, #cloud ,#databases", ",")
	for i, t := range tags {
		tags[i] = strings.Trim(t, " #")
	}
	fmt.Println(len(tags), strings.Join(tags, " / "))
	name := strings.Fields("  Lena   Park ")
	fmt.Println(len(name), strings.ToUpper(strings.Join(name, " ")))

	//@step replace
	phone := "555-010-4477"
	digits := strings.ReplaceAll(phone, "-", "")
	fmt.Println(digits, strings.Replace(phone, "-", " ", 1))
	masked := strings.Repeat("*", len(digits)-4) + digits[len(digits)-4:]
	fmt.Println("phone:", masked)

	//@step fold
	code := "EarlyBird26"
	fmt.Println(code == "EARLYBIRD26", strings.EqualFold(code, "EARLYBIRD26"))
}
