#@hide
mkdir setlist
#@hide
cd setlist
#@hide
git init -q
#@hide
printf "%s\n" "1. Night Drive" "2. Paper Moon" "3. Slow River" > songs.txt
#@hide
printf "%s\n" "2 guitars" "1 bass" "drum kit" > gear.txt
#@hide
git add .
#@hide
git commit -q -m "Add the main set"
#@hide
git switch -q -c encore
#@hide
echo "4. Encore: Last Train" >> songs.txt
#@hide
git commit -q -am "Add an encore song"
#@hide
echo "5. Encore: Blue Hour" >> songs.txt
#@hide
git commit -q -am "Add a second encore song"

#@step branch-ahead
git log --oneline --graph --all --decorate

#@step merge
git switch main
git merge encore
git log --oneline --graph --all --decorate

#@step delete
git branch -d encore
git branch

#@hide
git switch -q -c keyboard
#@hide
echo "keyboard" >> gear.txt
#@hide
git commit -q -am "Add the keyboard"
#@hide
git switch -q main
#@hide
sed -i "s/Slow River/Slow River (short)/" songs.txt
#@hide
git commit -q -am "Shorten Slow River"

#@step both-moved
git log --oneline --graph --all --decorate

#@step merge-commit
git merge --no-edit keyboard
git log --oneline --graph --all --decorate
