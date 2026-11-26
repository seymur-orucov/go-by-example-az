package main

import (
	"errors"
	"fmt"
	"io"
	"os"
	"os/exec"
	"strings"
)

// @step helper
// printLabel is the helper program: address on stdin, shipping label on stdout.
func printLabel(service string) {
	data, _ := io.ReadAll(os.Stdin)
	addr := strings.TrimSpace(string(data))
	if addr == "" {
		fmt.Fprintln(os.Stderr, "no address on stdin")
		os.Exit(3) // ends the process at once with exit code 3
	}
	fmt.Printf("[%s] %s\n", strings.ToUpper(service), strings.ToUpper(addr))
}

//@end

func main() {
	//@step self
	if os.Getenv("LABEL_HELPER") == "1" {
		printLabel(os.Args[1])
		return
	}
	self, err := os.Executable()
	if err != nil {
		fmt.Println(err)
		return
	}

	//@step output
	cmd := exec.Command(self, "express")
	cmd.Env = append(os.Environ(), "LABEL_HELPER=1")
	cmd.Stdin = strings.NewReader("12 Harbor Road, Bristol")
	out, err := cmd.Output()
	fmt.Printf("%q %v\n", out, err)

	//@step exit-code
	cmd = exec.Command(self, "standard")
	cmd.Env = append(os.Environ(), "LABEL_HELPER=1")
	_, err = cmd.Output()
	var exitErr *exec.ExitError
	if errors.As(err, &exitErr) {
		fmt.Println("exit code:", exitErr.ExitCode())
		fmt.Printf("stderr: %s", exitErr.Stderr)
	}

	//@step not-found
	err = exec.Command("label-printer-9000").Run()
	fmt.Println("not found:", errors.Is(err, exec.ErrNotFound))
}
