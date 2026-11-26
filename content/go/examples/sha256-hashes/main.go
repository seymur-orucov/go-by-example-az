package main

import (
	"crypto/sha256"
	"fmt"
)

func main() {
	//@step sum
	setup := []byte("PhotoKit 3.2 setup for Windows")
	sum := sha256.Sum256(setup)
	hexSum := fmt.Sprintf("%x", sum)
	fmt.Println(len(sum), "bytes,", len(hexSum), "hex digits")
	fmt.Println(hexSum)

	//@step change
	again := sha256.Sum256([]byte("PhotoKit 3.2 setup for Windows"))
	damaged := sha256.Sum256([]byte("PhotoKit 3.2 setup for windows"))
	fmt.Println("same bytes:", sum == again)
	fmt.Println("one letter changed:", sum == damaged)
	fmt.Printf("%x\n", damaged)

	//@step stream
	h := sha256.New()
	for _, chunk := range []string{"PhotoKit 3.2 ", "setup ", "for Windows"} {
		h.Write([]byte(chunk))
	}
	downloaded := fmt.Sprintf("%x", h.Sum(nil))
	fmt.Println(downloaded)

	//@step verify
	// copied from the download page, next to the file
	published := "8b2f94cb7d917ae53270de601da5aa59d6a08517a2d9bf1d443311dd5fbd0530"
	fmt.Println("download OK:", downloaded == published)
	fmt.Println("damaged copy OK:", fmt.Sprintf("%x", damaged) == published)
}
