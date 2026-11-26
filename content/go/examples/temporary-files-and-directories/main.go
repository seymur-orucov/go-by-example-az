package main

import (
	"errors"
	"fmt"
	"io/fs"
	"os"
	"path/filepath"
	"strings"
)

func main() {
	//@step dir
	dir, err := os.MkdirTemp("", "export-*")
	if err != nil {
		fmt.Println(err)
		return
	}
	defer os.RemoveAll(dir)
	again, _ := os.MkdirTemp("", "export-*")
	defer os.RemoveAll(again)
	fmt.Println("prefix:", strings.HasPrefix(filepath.Base(dir), "export-"))
	fmt.Println("unique:", dir != again)

	//@step file
	f, err := os.CreateTemp(dir, "orders-*.csv")
	if err != nil {
		fmt.Println(err)
		return
	}
	fmt.Fprintln(f, "id,total_usd")
	fmt.Fprintln(f, "A-17,42.50")
	f.Close()
	base := filepath.Base(f.Name())
	fmt.Println("name:", strings.HasPrefix(base, "orders-"), strings.HasSuffix(base, ".csv"))

	//@step rename
	final := filepath.Join(dir, "orders.csv")
	err = os.Rename(f.Name(), final)
	entries, _ := os.ReadDir(dir)
	fmt.Println(len(entries), entries[0].Name(), err)
	data, _ := os.ReadFile(final)
	fmt.Print(string(data))

	//@step cleanup
	thumbs := func() string {
		tmp, _ := os.MkdirTemp("", "thumbs-*")
		defer os.RemoveAll(tmp)
		os.WriteFile(filepath.Join(tmp, "a17.png"), []byte("..."), 0o644)
		return tmp
	}()
	_, err = os.Stat(thumbs)
	fmt.Println("thumbs removed:", errors.Is(err, fs.ErrNotExist))
}
