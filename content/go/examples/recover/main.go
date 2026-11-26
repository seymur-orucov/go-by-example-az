package main

import "fmt"

var sizes = map[string]int{"small": 1, "large": 3}

// @step unwind
func feedPaper(size string) int {
	defer fmt.Println("paper tray closed")
	price, ok := sizes[size]
	if !ok {
		panic("unknown size " + size)
	}
	return price
}

// @step recover
func printPhoto(size string) {
	defer func() {
		if r := recover(); r != nil {
			fmt.Println("skipped:", r)
		}
	}()
	price := feedPaper(size)
	fmt.Println("printed", size, "for", price, "USD")
}

// @step to-error
func pick(album []string, i int) (photo string, err error) {
	defer func() {
		if r := recover(); r != nil {
			err = fmt.Errorf("pick failed: %v", r)
		}
	}()
	return album[i], nil
}

//@end

func main() {
	printPhoto("poster")
	printPhoto("small")
	fmt.Println("kiosk still running")

	album := []string{"lake", "beach", "forest"}
	photo, err := pick(album, 1)
	fmt.Println(photo, err)
	_, err = pick(album, 5)
	fmt.Println(err)
}
