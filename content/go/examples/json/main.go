package main

import (
	"encoding/json"
	"fmt"
)

// @step tags
type Parcel struct {
	ID      string   `json:"id"`
	Status  string   `json:"status"`
	WeightG int      `json:"weight_g"`
	Stops   []string `json:"stops"`
	Note    string   `json:"note,omitempty"`
	phone   string   // unexported: never leaves the program
}

//@end

func main() {
	//@step marshal
	p := Parcel{ID: "PX-2207", Status: "in transit", WeightG: 1250,
		Stops: []string{"Warsaw", "Vienna"}, phone: "+1 555 0142"}
	data, err := json.Marshal(p)
	fmt.Println(string(data), err)

	//@step indent
	pretty, _ := json.MarshalIndent(p, "", "  ")
	fmt.Println(string(pretty))

	//@step unmarshal
	body := `{"id":"PX-2207","status":"delivered","weight_g":1250,"signed_by":"R. Stone"}`
	var got Parcel
	err = json.Unmarshal([]byte(body), &got)
	fmt.Printf("%s %s %d %v %v\n", got.ID, got.Status, got.WeightG, got.Stops, err)

	err = json.Unmarshal([]byte(`{"weight_g":"heavy"}`), &got)
	fmt.Println(err)

	//@step map
	var raw map[string]any
	err = json.Unmarshal([]byte(body), &raw)
	fmt.Println(raw["signed_by"], err)
	fmt.Printf("%v %T\n", raw["weight_g"], raw["weight_g"])
}
