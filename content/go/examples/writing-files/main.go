package main

import (
	"bufio"
	"fmt"
	"os"
	"path/filepath"
)

func main() {
	dir, _ := os.MkdirTemp("", "cafe")
	defer os.RemoveAll(dir)

	//@step writefile
	menu := filepath.Join(dir, "menu.txt")
	os.WriteFile(menu, []byte("tea 2 USD\ncake 4 USD\n"), 0o644)
	err := os.WriteFile(menu, []byte("tea 3 USD\n"), 0o644)
	data, _ := os.ReadFile(menu)
	fmt.Printf("%q %v\n", data, err)

	//@step create
	f, err := os.Create(filepath.Join(dir, "sales.txt"))
	if err != nil {
		fmt.Println("create failed:", err)
		return
	}
	n, _ := f.WriteString("Monday sales\n")
	m, _ := fmt.Fprintf(f, "%-5s %3d cups\n", "tea", 48)
	fmt.Println(n, m, f.Close())

	//@step append
	orders := filepath.Join(dir, "orders.log")
	for _, item := range []string{"tea", "cake", "tea"} {
		lf, err := os.OpenFile(orders, os.O_APPEND|os.O_CREATE|os.O_WRONLY, 0o644)
		if err != nil {
			fmt.Println("open failed:", err)
			return
		}
		fmt.Fprintln(lf, "order:", item)
		lf.Close()
	}
	data, _ = os.ReadFile(orders)
	fmt.Print(string(data))

	//@step buffered
	rf, _ := os.Create(filepath.Join(dir, "receipt.txt"))
	defer rf.Close()
	w := bufio.NewWriter(rf)
	w.WriteString("cake 4 USD\n")
	before, _ := os.ReadFile(rf.Name())
	w.Flush()
	after, _ := os.ReadFile(rf.Name())
	fmt.Println(len(before), len(after))
}
