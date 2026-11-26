package main

import (
	"errors"
	"flag"
	"fmt"
	"io"
	"os"
	"strings"
)

func main() {
	//@step real
	if err := run(os.Args[1:]); err != nil {
		fmt.Println("error:", err)
	}

	//@step simulate
	lines := [][]string{
		{"add", "-priority", "3", "renew", "passport"},
		{"list", "-all"},
		{"add", "-due", "friday", "pay rent"},
		{"remove", "2"},
	}
	for _, line := range lines {
		if err := run(line); err != nil {
			fmt.Println("error:", err)
		}
	}
}

// @step dispatch
func run(args []string) error {
	if len(args) == 0 {
		return errors.New("usage: todo <add|list> [flags]")
	}
	switch args[0] {
	case "add":
		return add(args[1:])
	case "list":
		return list(args[1:])
	}
	return fmt.Errorf("unknown command %q", args[0])
}

// @step flagsets
func add(args []string) error {
	fs := flag.NewFlagSet("add", flag.ContinueOnError)
	fs.SetOutput(io.Discard)
	priority := fs.Int("priority", 1, "1 (low) to 3 (high)")
	if err := fs.Parse(args); err != nil {
		return err
	}
	fmt.Printf("added %q, priority %d\n", strings.Join(fs.Args(), " "), *priority)
	return nil
}

func list(args []string) error {
	fs := flag.NewFlagSet("list", flag.ContinueOnError)
	fs.SetOutput(io.Discard)
	all := fs.Bool("all", false, "include finished tasks")
	if err := fs.Parse(args); err != nil {
		return err
	}
	fmt.Println("listing tasks, finished too:", *all)
	return nil
}
