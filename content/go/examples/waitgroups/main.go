package main

import (
	"fmt"
	"sync"
	"time"
)

var servers = []string{"web-1", "web-2", "web-3", "db-1"}

// @step done
func check(i int, name string, up []bool, wg *sync.WaitGroup) {
	defer wg.Done()
	time.Sleep(100 * time.Millisecond) // waiting for the server to answer
	up[i] = name != "web-3"            // web-3 does not answer
}

//@end

func main() {
	//@step wait
	up := make([]bool, len(servers))
	var wg sync.WaitGroup
	start := time.Now()
	for i, name := range servers {
		wg.Add(1)
		go check(i, name, up, &wg)
	}
	wg.Wait()
	fmt.Println("health:", up)
	fmt.Println("faster than one by one:", time.Since(start) < 400*time.Millisecond)

	//@step go
	updated := make(chan string)
	for i, name := range servers {
		if !up[i] {
			continue
		}
		wg.Go(func() {
			time.Sleep(100 * time.Millisecond) // uploading the release
			updated <- name
		})
	}

	//@step close
	go func() {
		wg.Wait()
		close(updated)
	}()
	count := 0
	for range updated {
		count++
	}
	fmt.Println("updated", count, "of", len(servers), "servers")
}
