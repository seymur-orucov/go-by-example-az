#@hide
mkdir podcast
#@hide
cd podcast
#@hide
git init -q
#@hide
echo "Ep 1: Why we started" > episodes.md
#@hide
git add episodes.md
#@hide
git commit -q -m "Add first episode"
#@hide
echo "Ep 1: Leyla, designer" > guests.txt
#@hide
git add guests.txt
#@hide
git commit -q -m "Add guest list"

#@step file
git branch
cat .git/refs/heads/main
wc -c .git/refs/heads/main

#@step create
git branch season-2
ls .git/refs/heads
cat .git/refs/heads/season-2
git log --oneline --decorate
ls

#@step commit
echo "Ep 2: Remote work" >> episodes.md
git add episodes.md
git commit -m "Add second episode"
cat .git/refs/heads/main
cat .git/refs/heads/season-2

#@step head
git switch season-2
cat .git/HEAD
echo "S2 Ep 1: Murad, teacher" >> guests.txt
git add guests.txt
git commit -m "Add season 2 guest"
git log --oneline --decorate --graph --all
