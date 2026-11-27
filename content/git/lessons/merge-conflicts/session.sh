#@hide
mkdir club
#@hide
cd club
#@hide
git init -q
#@hide
printf "%s\n" "Day: Friday" "Time: 18:00" "Place: Library" > agenda.md
#@hide
git add .
#@hide
git commit -q -m "Add meeting agenda"
#@hide
git switch -q -c ayla-time
#@hide
sed -i 's/18:00/19:00/' agenda.md
#@hide
git -c user.name="Ayla Karimova" -c user.email="ayla@example.com" commit -q -am "Move meeting to 19:00"
#@hide
git switch -q main
#@hide
sed -i 's/18:00/17:30/' agenda.md
#@hide
git commit -q -am "Move meeting to 17:30"

#@step conflict
git merge ayla-time #@fail
git status

#@step abort
git merge --abort
git status
cat agenda.md

#@step markers
git merge ayla-time #@fail
cat agenda.md

#@step resolve
printf "%s\n" "Day: Friday" "Time: 18:30" "Place: Library" > agenda.md
git add agenda.md
git status

#@step finish
git commit --no-edit
git log --oneline --graph
