package main

import (
	"fmt"
	"testing"
)

// @step code
// ShippingCents returns the delivery fee in US cents: $4.99 up to 2 kg,
// plus $1.50 for every started kilogram above that; express doubles it.
func ShippingCents(weightG int, express bool) int {
	fee := 499
	if weightG > 2000 {
		fee += (weightG - 2000 + 999) / 1000 * 150
	}
	if express {
		fee *= 2
	}
	return fee
}

// @step test
func TestShippingLight(t *testing.T) {
	got := ShippingCents(500, false)
	if got != 499 {
		t.Errorf("ShippingCents(500, false) = %d, want 499", got)
	}
}

// @step table
func TestShippingCents(t *testing.T) {
	cases := []struct {
		name    string
		weightG int
		express bool
		want    int
	}{
		{"limit", 2000, false, 499},
		{"one gram over", 2001, false, 649},
		{"express", 3500, true, 1598},
	}
	for _, c := range cases {
		t.Run(c.name, func(t *testing.T) {
			got := ShippingCents(c.weightG, c.express)
			if got != c.want {
				t.Errorf("got %d, want %d", got, c.want)
			}
		})
	}
}

// @step bench
func BenchmarkShippingCents(b *testing.B) {
	for b.Loop() {
		ShippingCents(3500, true)
	}
}

//@end

func main() {
	//@step run
	r := testing.Benchmark(BenchmarkShippingCents)
	fmt.Println("benchmark ran:", r.N > 0, "allocs/op:", r.AllocsPerOp())

	tests := []testing.InternalTest{
		{Name: "TestShippingLight", F: TestShippingLight},
		{Name: "TestShippingCents", F: TestShippingCents},
	}
	all := func(pattern, name string) (bool, error) { return true, nil }
	testing.Main(all, tests, nil, nil)
}
