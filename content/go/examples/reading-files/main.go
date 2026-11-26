package main

import (
	"bufio"
	"errors"
	"fmt"
	"io"
	"io/fs"
	"os"
	"path/filepath"
)

func main() {
	// Prepare a file to read: a temporary folder and a bus route in it.
	dir, _ := os.MkdirTemp("", "bus")
	defer os.RemoveAll(dir)
	path := filepath.Join(dir, "route-12.txt")
	os.WriteFile(path, []byte("Route 12\nHarbor\nOld Town\nStadium\n"), 0o644)

	//@step whole
	data, err := os.ReadFile(path)
	if err != nil {
		fmt.Println("read failed:", err)
		return
	}
	fmt.Printf("%d bytes\n%s", len(data), data)

	//@step missing
	_, err = os.ReadFile(filepath.Join(dir, "route-99.txt"))
	fmt.Println(err != nil, errors.Is(err, fs.ErrNotExist))

	//@step open
	f, err := os.Open(path)
	if err != nil {
		fmt.Println("open failed:", err)
		return
	}
	defer f.Close()

	buf := make([]byte, 5)
	n, err := f.Read(buf)
	fmt.Println(n, string(buf[:n]), err)

	//@step lines
	f.Seek(0, io.SeekStart)
	sc := bufio.NewScanner(f)
	sc.Scan() // skip the "Route 12" header
	for i := 1; sc.Scan(); i++ {
		fmt.Println("stop", i, sc.Text())
	}
	if err := sc.Err(); err != nil {
		fmt.Println("scan failed:", err)
	}
}
