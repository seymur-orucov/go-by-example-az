package main

import (
	"fmt"
	"time"
)

func main() {
	//@step date
	departs := time.Date(2026, time.March, 14, 8, 45, 0, 0, time.UTC)
	fmt.Println("departs:", departs)
	fmt.Println(departs.Year(), departs.Month(), departs.Day(), departs.Weekday())

	//@step duration
	journey := 2*time.Hour + 35*time.Minute
	fmt.Println("journey:", journey, "=", journey.Minutes(), "minutes")

	//@step add-sub
	arrives := departs.Add(journey)
	fmt.Println("arrives:", arrives)
	actual := time.Date(2026, time.March, 14, 11, 32, 0, 0, time.UTC)
	fmt.Println("delay:", actual.Sub(arrives))

	//@step add-date
	nextTrain := departs.AddDate(0, 0, 7)
	fmt.Println("next train:", nextTrain, nextTrain.Weekday())

	//@step compare
	onPlatform := time.Date(2026, time.March, 14, 8, 47, 0, 0, time.UTC)
	fmt.Println("caught the train:", onPlatform.Before(departs))
	fmt.Println("late by:", onPlatform.Sub(departs))
	fmt.Println("arrived on time:", actual.Equal(arrives))
}
