package main

import "fmt"

type Playlist struct {
	Name   string
	Songs  []string
	Length Minutes
}

// @step value
func (p Playlist) Long() bool {
	return p.Length > 60
}

// @step pointer
func (p *Playlist) Add(song string, length Minutes) {
	p.Songs = append(p.Songs, song)
	p.Length += length
}

// @step own-type
type Minutes int

func (m Minutes) Split() (int, int) {
	return int(m) / 60, int(m) % 60
}

//@end

func main() {
	road := Playlist{Name: "Road trip", Songs: []string{"Open Road"}, Length: 40}
	fmt.Println(road.Name, "long:", road.Long())

	road.Add("Night Drive", 25)
	fmt.Println(len(road.Songs), "songs, long:", road.Long())

	h, m := road.Length.Split()
	fmt.Println("length:", h, "h", m, "min")
}
