#@hide
git init -q --bare ~/server/playlist.git
#@hide
git clone -q ~/server/playlist.git
#@hide
cd playlist
#@hide
printf "%s\n" "entrance: Canon in D" "exit: Wedding March" > ceremony.txt
#@hide
git add ceremony.txt
#@hide
git commit -q -m "Add ceremony songs"
#@hide
printf "%s\n" "September" "Dancing Queen" > party.txt
#@hide
git add party.txt
#@hide
git commit -q -m "Add party songs"
#@hide
git push -q origin main
#@hide
git clone -q ~/server/playlist.git ~/ayla/playlist
#@hide
cd ~/ayla/playlist
#@hide
echo "first dance: At Last" >> ceremony.txt
#@hide
git -c user.name="Ayla Karimova" -c user.email="ayla@example.com" commit -q -am "Add the first dance"
#@hide
git push -q origin main
#@hide
cd ~/playlist

#@step uncommitted
echo "rings: Air on the G String" >> ceremony.txt
git add ceremony.txt
echo "Uptown Funk" >> party.txt
echo "1. Best man" > speeches.txt
git status --short

#@step reset
git reset --hard
git status --short
cat party.txt

#@step experiment
printf "%s\n" "Dancing Queen" "September" > party.txt
git commit -am "Try a new party order"
git add speeches.txt
git commit -m "Add the speech order"
git log --oneline

#@step drop-commit
git reset --hard HEAD~1
git log --oneline
ls

#@step match-server
git fetch
git status
git reset --hard origin/main
git log --oneline
