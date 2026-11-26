package main

import (
	"bufio"
	"fmt"
	"io"
	"os"
	"strings"
)

// @step reader
func cleanList(in io.Reader, out io.Writer) error {
	sc := bufio.NewScanner(in)
	seen := map[string]bool{}
	n := 0
	for sc.Scan() {
		//@step clean
		item := strings.ToLower(strings.TrimSpace(sc.Text()))
		if item == "" || strings.HasPrefix(item, "#") {
			continue
		}
		//@step unique
		if seen[item] {
			continue
		}
		seen[item] = true
		n++
		fmt.Fprintf(out, "%d. %s\n", n, item)
	}
	return sc.Err()
}

//@end

// Shopping items copied from a family chat.
const chat = "  Milk\n# for the weekend\neggs\n\nBread\nmilk\n  EGGS  \n"

func main() {
	//@step run
	// A real filter reads standard input: cleanList(os.Stdin, os.Stdout)
	if err := cleanList(strings.NewReader(chat), os.Stdout); err != nil {
		fmt.Fprintln(os.Stderr, "read failed:", err)
	}
}
