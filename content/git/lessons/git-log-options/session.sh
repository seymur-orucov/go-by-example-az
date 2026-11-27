#@hide
mkdir game-night
#@hide
cd game-night
#@hide
git init -q
#@hide
printf "%s\n" "# Game night" "Every Friday" > rules.md
#@hide
git add rules.md
#@hide
GIT_AUTHOR_DATE="2026-01-05T18:00:00Z" GIT_COMMITTER_DATE="2026-01-05T18:00:00Z" git commit -q -m "Add game night rules"
#@hide
printf "%s\n" "chips" "lemonade" > snacks.txt
#@hide
git add snacks.txt
#@hide
GIT_AUTHOR_DATE="2026-01-06T18:30:00Z" GIT_COMMITTER_DATE="2026-01-06T18:30:00Z" git -c user.name="Ayla Karimova" -c user.email="ayla@example.com" commit -q -m "Add snack list"
#@hide
echo "Games: Uno, Jenga" >> rules.md
#@hide
GIT_AUTHOR_DATE="2026-01-08T19:00:00Z" GIT_COMMITTER_DATE="2026-01-08T19:00:00Z" git commit -q -am "Add the game list"
#@hide
echo "pizza" >> snacks.txt
#@hide
GIT_AUTHOR_DATE="2026-01-09T17:00:00Z" GIT_COMMITTER_DATE="2026-01-09T17:00:00Z" git -c user.name="Ayla Karimova" -c user.email="ayla@example.com" commit -q -am "Add pizza to snacks"
#@hide
echo "Start: 7 pm" >> rules.md
#@hide
GIT_AUTHOR_DATE="2026-01-11T10:00:00Z" GIT_COMMITTER_DATE="2026-01-11T10:00:00Z" git commit -q -am "Set the start time"
#@hide
sed -i "s/pizza/tacos/" snacks.txt
#@hide
GIT_AUTHOR_DATE="2026-01-12T20:00:00Z" GIT_COMMITTER_DATE="2026-01-12T20:00:00Z" git commit -q -am "Swap the main snack"

#@step oneline
git log --oneline
git log --oneline --graph

#@step author
git log --author="Ayla"

#@step dates
git log --since="2026-01-10"
git log --oneline --since="2026-01-07" --until="2026-01-10"

#@step path
git log --oneline -- snacks.txt
git log -p -1 -- snacks.txt

#@step search
git log --oneline -S "pizza"
git log --oneline --author="Sam" -- rules.md
