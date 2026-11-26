package main

import (
	"encoding/xml"
	"fmt"
)

// @step tags
type Invoice struct {
	XMLName  xml.Name `xml:"invoice"`
	Number   string   `xml:"number,attr"`
	Currency string   `xml:"currency,attr"`
	Buyer    string   `xml:"buyer>name"`
	Country  string   `xml:"buyer>country"`
	Items    []string `xml:"item"`
	Total    int      `xml:"total"`
}

//@end

func main() {
	//@step marshal
	inv := Invoice{Number: "INV-0318", Currency: "USD", Buyer: "Maple Street Books",
		Country: "Canada", Items: []string{"desk lamp", "office chair"}, Total: 240}
	data, err := xml.MarshalIndent(inv, "", "  ")
	if err != nil {
		fmt.Println(err)
		return
	}
	fmt.Println(xml.Header + string(data))

	//@step unmarshal
	reply := `<invoice number="INV-0319" currency="USD">
  <buyer><name>Harbor Cafe</name></buyer>
  <total>95</total>
</invoice>`
	var got Invoice
	err = xml.Unmarshal([]byte(reply), &got)
	fmt.Println(got.Number, got.Buyer, got.Total, len(got.Items), err)

	//@step root
	err = xml.Unmarshal([]byte(`<receipt number="R-77"></receipt>`), &got)
	fmt.Println(err)
}
