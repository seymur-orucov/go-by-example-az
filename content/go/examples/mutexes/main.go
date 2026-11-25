package main

import (
	"fmt"
	"sync"
	"sync/atomic"
)

// @step train
type Train struct {
	mu    sync.Mutex        // guards seats
	seats map[string]string // seat -> desk that sold it
}

// @step book
func (t *Train) Book(seat, desk string) bool {
	t.mu.Lock()
	defer t.mu.Unlock()
	if _, taken := t.seats[seat]; taken {
		return false
	}
	t.seats[seat] = desk
	return true
}

// @step sold
func (t *Train) Sold() int {
	t.mu.Lock()
	defer t.mu.Unlock()
	return len(t.seats)
}

//@end

func main() {
	//@step desks
	train := &Train{seats: map[string]string{}}
	requests := map[string][]string{
		"desk 1": {"4A", "4B", "7C"},
		"desk 2": {"4A", "5A", "7C"},
		"desk 3": {"4A", "5B", "4B"},
	}
	var refused atomic.Int64
	var wg sync.WaitGroup
	for desk, seats := range requests {
		wg.Go(func() {
			for _, seat := range seats {
				if !train.Book(seat, desk) {
					refused.Add(1)
				}
			}
		})
	}
	wg.Wait()
	fmt.Println("seats sold:", train.Sold())
	fmt.Println("requests refused:", refused.Load())
}
