package main

import (
	"fmt"
	"time"
)

func main() {
	//@step layout
	start := time.Date(2026, time.June, 18, 15, 30, 0, 0, time.UTC)
	fmt.Println(start.Format("02.01.2006 15:04"))
	fmt.Println(start.Format("Monday, January 2"))

	//@step predefined
	fmt.Println(start.Format(time.RFC3339))
	fmt.Println(start.Format(time.DateOnly), start.Format(time.Kitchen))

	//@step zone
	baku := time.FixedZone("UTC+4", 4*60*60)
	newYork := time.FixedZone("UTC-4", -4*60*60)
	fmt.Println("Baku:", start.In(baku).Format("15:04 -07:00"))
	fmt.Println("New York:", start.In(newYork).Format("Jan 2, 3:04 PM"))

	//@step parse
	t, err := time.Parse(time.RFC3339, "2026-06-18T19:30:00+04:00")
	fmt.Println(t.UTC(), err, t.Equal(start))

	_, err = time.Parse(time.DateOnly, "2026-06-31")
	fmt.Println(err)
	_, err = time.Parse(time.DateOnly, "18.06.2026")
	fmt.Println(err)
}
