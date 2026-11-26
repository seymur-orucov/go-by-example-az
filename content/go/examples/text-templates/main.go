package main

import (
	"fmt"
	"os"
	"text/template"
)

type Visit struct {
	Patient string
	Doctor  string
	Time    string
	Fasting bool
	Bring   []string
}

func main() {
	visits := []Visit{
		{"Nora", "Dr. Silva", "09:30", true, []string{"ID card", "lab results"}},
		{"Omar", "Dr. Brandt", "14:15", false, nil},
	}

	//@step parse
	greet := template.Must(template.New("greet").Parse(
		"Hi {{.Patient}}, see {{.Doctor}} at {{.Time}}.\n"))
	send := func(t *template.Template) {
		for _, v := range visits {
			if err := t.Execute(os.Stdout, v); err != nil {
				fmt.Println("error:", err)
			}
		}
	}
	send(greet)

	//@step if
	food := template.Must(template.New("food").Parse(
		"{{.Patient}}: {{if .Fasting}}no food after midnight{{else}}eat as usual{{end}}\n"))
	send(food)

	//@step range
	items := template.Must(template.New("items").Parse(
		"{{.Patient}} brings:{{range .Bring}} [{{.}}]{{else}} nothing{{end}}\n"))
	send(items)

	//@step trim
	letter := template.Must(template.New("letter").Parse(`Dear {{.Patient}},
{{- range .Bring}}
please bring your {{.}}.
{{- end}}
See you at {{.Time}}.
`))
	send(letter)
}
