package main

import (
	"errors"
	"fmt"
)

// @step type
type BookingError struct {
	Room string
	Hour int
	Err  error
}

func (e *BookingError) Error() string {
	return fmt.Sprint(e.Room, " at ", e.Hour, ":00: ", e.Err)
}

// @step unwrap
func (e *BookingError) Unwrap() error {
	return e.Err
}

//@end

var ErrBusy = errors.New("room is busy")

func book(room string, hour int) error {
	if hour < 8 || hour > 20 {
		return &BookingError{Room: room, Hour: hour, Err: errors.New("outside opening hours")}
	}
	if room == "Orion" && hour == 14 {
		return &BookingError{Room: room, Hour: hour, Err: ErrBusy}
	}
	return nil
}

func main() {
	err := book("Orion", 14)
	fmt.Println(err)
	fmt.Println("busy:", errors.Is(err, ErrBusy))

	//@step as
	err = fmt.Errorf("weekly plan: %w", book("Lyra", 22))
	fmt.Println(err)
	var be *BookingError
	if errors.As(err, &be) {
		fmt.Println("room:", be.Room, "hour:", be.Hour)
	}
}
