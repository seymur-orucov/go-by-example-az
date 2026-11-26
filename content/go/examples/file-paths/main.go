package main

import (
	"fmt"
	"path/filepath"
	"strings"
)

func main() {
	//@step join
	photo := filepath.Join("photos", "2026", "summer", "Beach.JPG")
	fmt.Println(filepath.ToSlash(photo))

	messy := filepath.Join("photos/", "/2026", "..", "2025", "./lake.png")
	fmt.Println(filepath.ToSlash(messy))

	//@step parts
	dir := filepath.Dir(photo)
	fmt.Println(filepath.ToSlash(dir), filepath.Base(photo), filepath.Ext(photo))

	//@step thumb
	name := strings.TrimSuffix(filepath.Base(photo), filepath.Ext(photo))
	thumb := filepath.Join(dir, "thumbs", name+".webp")
	fmt.Println(filepath.ToSlash(thumb))

	isJPEG := strings.ToLower(filepath.Ext(photo)) == ".jpg"
	fmt.Println(isJPEG)

	//@step rel
	rel, err := filepath.Rel("photos", thumb)
	fmt.Println(filepath.ToSlash(rel), err)

	up, _ := filepath.Rel("photos/2026", "photos/2025/lake.png")
	fmt.Println(filepath.ToSlash(up))
}
