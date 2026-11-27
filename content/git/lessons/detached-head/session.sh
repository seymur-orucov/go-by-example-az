#@hide
mkdir songs
#@hide
cd songs
#@hide
git init -q
#@hide
echo "Verse 1: rain on the window" > lyrics.txt
#@hide
git add lyrics.txt
#@hide
git commit -q -m "Add first verse"
#@hide
echo "Chorus: we keep on walking" >> lyrics.txt
#@hide
git add lyrics.txt
#@hide
git commit -q -m "Add chorus"
#@hide
echo "Verse 2: sun on the road" >> lyrics.txt
#@hide
git add lyrics.txt
#@hide
git commit -q -m "Add second verse"

#@step detach
git log --oneline
git switch HEAD~2 #@fail
git switch --detach HEAD~2
cat lyrics.txt

#@step look
cat .git/HEAD
git status
git branch

#@step commit
echo "Chorus: slow and quiet" >> lyrics.txt
git add lyrics.txt
git commit -m "Try a quiet chorus"
git branch

#@step save
git switch -c quiet-chorus
cat .git/HEAD
git branch

#@step leave
git switch main
git switch --detach HEAD~1
echo "Bridge: one more time" >> lyrics.txt
git add lyrics.txt
git commit -q -m "Try a bridge"
git switch main
