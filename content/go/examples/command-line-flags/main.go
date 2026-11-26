package main

import (
	"flag"
	"fmt"
	"io"
)

func main() {
	//@step define
	city := flag.String("city", "Baku", "city to show")
	days := flag.Int("days", 1, "number of days")
	wind := flag.Bool("wind", false, "show wind speed")

	//@step parse
	flag.Parse()
	fmt.Println(*city, *days, *wind, flag.Args())

	//@step simulate
	// The same as running: ./weather -city Oslo -days=3 -wind tomorrow
	flag.CommandLine.Parse([]string{"-city", "Oslo", "-days=3", "-wind", "tomorrow"})
	fmt.Println(*city, *days, *wind, flag.Args())

	//@step errors
	fs := flag.NewFlagSet("weather", flag.ContinueOnError)
	fs.SetOutput(io.Discard)
	fs.Int("days", 1, "number of days")
	fmt.Println(fs.Parse([]string{"-days", "many"}))
	fmt.Println(fs.Parse([]string{"-hours", "6"}))
}
