package main

import "fmt"

func main() {
	//@step value
	day := "şənbə"
	switch day {
	case "bazar ertəsi":
		fmt.Println("kitabxana bağlıdır")
	case "şənbə":
		fmt.Println("kitabxana 10:00-dan 14:00-dək açıqdır")
	default:
		fmt.Println("kitabxana 09:00-dan 18:00-dək açıqdır")
	}

	//@step multi
	genre := "povest"
	switch genre {
	case "roman", "povest", "hekayə":
		fmt.Println("bədii ədəbiyyat rəfi")
	case "lüğət", "ensiklopediya":
		fmt.Println("məlumat rəfi")
	default:
		fmt.Println("digər rəflər")
	}

	//@step cond
	books := 3
	switch {
	case books == 0:
		fmt.Println("hələ kitab götürməyib")
	case books < 5:
		fmt.Println("daha kitab götürə bilərsiniz")
	default:
		fmt.Println("limit dolub, əvvəl kitab qaytarın")
	}
}
