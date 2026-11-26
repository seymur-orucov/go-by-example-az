package main

import (
	"fmt"
	"os"
	"os/exec"
	"strconv"
	"syscall"
)

func main() {
	//@step lookpath
	shell, err := exec.LookPath("sh")
	if err != nil {
		fmt.Println("no shell:", err)
		return
	}

	//@step args
	script := `echo "worker $JOB, same pid: $([ $$ = $LAUNCHER_PID ] && echo yes || echo no)"`
	args := []string{"sh", "-c", script}
	env := append(os.Environ(),
		"JOB=nightly-backup",
		"LAUNCHER_PID="+strconv.Itoa(os.Getpid()))

	//@step exec
	defer fmt.Println("launcher: cleanup") // never printed
	fmt.Println("launcher: handing over to sh")
	err = syscall.Exec(shell, args, env)
	fmt.Println("exec failed:", err) // reached only if Exec fails
}
