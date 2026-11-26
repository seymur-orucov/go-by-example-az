package main

import (
	"errors"
	"fmt"
	"io/fs"
	"os"
	"path/filepath"
)

func main() {
	root, err := os.MkdirTemp("", "photos-*")
	if err != nil {
		fmt.Println(err)
		return
	}
	defer os.RemoveAll(root)

	//@step mkdir
	err = os.Mkdir(filepath.Join(root, "2025"), 0o755)
	fmt.Println("2025:", err)
	err = os.Mkdir(filepath.Join(root, "2025"), 0o755)
	fmt.Println("2025 again exists:", errors.Is(err, fs.ErrExist))
	err = os.Mkdir(filepath.Join(root, "2026", "07"), 0o755)
	fmt.Println("2026/07 parent missing:", errors.Is(err, fs.ErrNotExist))
	err = os.MkdirAll(filepath.Join(root, "2026", "07"), 0o755)
	fmt.Println("2026/07 with MkdirAll:", err)

	//@step read
	july := filepath.Join(root, "2026", "07")
	os.WriteFile(filepath.Join(july, "lake.jpg"), []byte("..."), 0o644)
	os.WriteFile(filepath.Join(july, "birthday.jpg"), []byte("..."), 0o644)
	os.WriteFile(filepath.Join(root, "2026", "albums.txt"), []byte("..."), 0o644)
	entries, err := os.ReadDir(filepath.Join(root, "2026"))
	for _, e := range entries {
		fmt.Println(e.Name(), e.IsDir())
	}

	//@step walk
	photos := 0
	err = filepath.WalkDir(root, func(path string, d fs.DirEntry, err error) error {
		if err != nil {
			return err
		}
		rel, _ := filepath.Rel(root, path)
		fmt.Println(filepath.ToSlash(rel))
		if filepath.Ext(path) == ".jpg" {
			photos++
		}
		return nil
	})
	fmt.Println("photos:", photos, err)

	//@step remove
	err = os.Remove(filepath.Join(root, "2026"))
	fmt.Println("Remove failed:", err != nil)
	err = os.RemoveAll(filepath.Join(root, "2026"))
	entries, _ = os.ReadDir(root)
	fmt.Println("RemoveAll:", err, len(entries))
}
