package main

import (
	"log"
	"log/slog"
	"os"
)

func main() {
	//@step std
	log.SetOutput(os.Stdout)
	log.SetFlags(0)
	log.Println("order 1042 received")
	log.Printf("order %d paid: %d cents", 1042, 1850)

	//@step custom
	pay := log.New(os.Stdout, "payments: ", 0)
	pay.Println("card declined for order 1043")

	//@step slog
	opts := &slog.HandlerOptions{ReplaceAttr: dropTime}
	logger := slog.New(slog.NewTextHandler(os.Stdout, opts))
	logger.Info("order shipped", "order", 1042, "carrier", "DHL")
	logger.Debug("cache hit", "key", "order:1042")

	//@step json
	opts = &slog.HandlerOptions{Level: slog.LevelWarn, ReplaceAttr: dropTime}
	jl := slog.New(slog.NewJSONHandler(os.Stdout, opts)).With("service", "orders")
	jl.Info("order shipped", "order", 1044)
	jl.Warn("stock low", "item", "mug", "left", 2)
}

// @step drop-time
func dropTime(groups []string, a slog.Attr) slog.Attr {
	if a.Key == slog.TimeKey && len(groups) == 0 {
		return slog.Attr{}
	}
	return a
}
