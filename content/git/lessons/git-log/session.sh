#@hide
mkdir reading-list
#@hide
cd reading-list
#@hide
git init -q
#@hide
printf "%s\n" "The Hobbit" "Dune" > books.txt
#@hide
git add books.txt
#@hide
git commit -q -m "Start reading list"
#@hide
echo "Project Hail Mary" >> books.txt
#@hide
git commit -q -am "Add Project Hail Mary"

#@step log
git log

#@step show
printf "%s\n" "The Hobbit" "Dune (read)" "Project Hail Mary" > books.txt
git commit -am "Mark Dune as read"
git show

#@step new-file
echo "Dune: the desert planet is the main character." > notes.md
git add notes.md
git commit -m "Add notes on Dune"
git show

#@step order
git log
