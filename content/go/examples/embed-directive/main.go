package main

import (
	"embed"
	"encoding/json"
	"fmt"
)

// @step directive
var (
	//go:embed banner.txt
	banner string

	//go:embed config.json
	configData []byte

	//go:embed menu
	menus embed.FS
)

//@end

func main() {
	//@step string
	fmt.Print(banner)

	//@step bytes
	type config struct {
		Currency   string `json:"currency"`
		TaxPercent int    `json:"tax_percent"`
	}
	var cfg config
	err := json.Unmarshal(configData, &cfg)
	fmt.Println(cfg.Currency, cfg.TaxPercent, err)

	//@step fs
	entries, _ := menus.ReadDir("menu")
	for _, e := range entries {
		fmt.Println(e.Name())
	}
	drinks, _ := menus.ReadFile("menu/drinks.txt")
	fmt.Print(string(drinks))
	_, err = menus.ReadFile("menu/_draft.txt")
	fmt.Println(err)
}
