#@hide
mkdir server ayla
#@hide
git init -q --bare server/study-notes.git
#@hide
git clone -q ~/server/study-notes.git ayla/study-notes
#@hide
cd ayla/study-notes
#@hide
printf "%s\n" "# Biology" "- cells" > biology.md
#@hide
git add biology.md
#@hide
git -c user.name="Ayla Karimova" -c user.email="ayla@example.com" commit -q -m "Add biology notes"
#@hide
git push -q
#@hide
cd ~
#@hide
git clone -q ~/server/study-notes.git
#@hide
cd ayla/study-notes
#@hide
printf "%s\n" "# History" "- 1914: World War I starts" > history.md
#@hide
git add history.md
#@hide
git -c user.name="Ayla Karimova" -c user.email="ayla@example.com" commit -q -m "Add history notes"
#@hide
git push -q
#@hide
cd ~/study-notes

#@step tracking
git branch -a
git log --oneline --graph --all --decorate
git status

#@step fetch
git fetch
git status
git log --oneline --graph --all --decorate
ls

#@step merge
git merge origin/main
git status

#@step pull
#@hide
cd ~/ayla/study-notes
#@hide
echo "- 1945: World War II ends" >> history.md
#@hide
git -c user.name="Ayla Karimova" -c user.email="ayla@example.com" commit -q -am "Add 1945 to history"
#@hide
git push -q
#@hide
cd ~/study-notes
git pull
git log --oneline --graph --all --decorate

#@step diverged
#@hide
cd ~/ayla/study-notes
#@hide
echo "- mitosis" >> biology.md
#@hide
git -c user.name="Ayla Karimova" -c user.email="ayla@example.com" commit -q -am "Add mitosis"
#@hide
git push -q
#@hide
cd ~/study-notes
echo "- 1991: USSR dissolves" >> history.md
git commit -q -am "Add 1991 to history"
git pull #@fail
git pull --no-rebase --no-edit
#@hide
git commit -q --amend -m "Merge branch 'main' of /home/sam/server/study-notes"
git log --oneline --graph --all --decorate
git status
