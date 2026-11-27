#@hide
mkdir choreo
#@hide
cd choreo
#@hide
git init -q
#@hide
printf "%s\n" "# Spring show" "" "## Verse" "- step touch x4" > routine.md
#@hide
echo "Tempo: 120 BPM" > music.txt
#@hide
git add .
#@hide
git commit -q -m "Add verse"
#@hide
git switch -q -c chorus
#@hide
printf "%s\n" "" "## Chorus" "- spin rigth" "- jump x2" >> routine.md
#@hide
git commit -q -am "Add chorus moves"
#@hide
sed -i "s/rigth/right/" routine.md
#@hide
git commit -q -am "fix typo"
#@hide
echo "Chorus starts at 0:45" >> music.txt
#@hide
git commit -q -am "wip"
#@hide
echo "Walk in slowly, 8 counts" > intro.md
#@hide
git add intro.md
#@hide
git commit -q -m "Try slow intro"

#@step todo
git log --oneline
#@hide
git config sequence.editor "sed -n '/^[^#]/p'"
git rebase -i HEAD~4
git log --oneline

#@step fixup-drop
#@hide
git config sequence.editor "sed -i -e '2s/^pick/fixup/' -e '4s/^pick/drop/' -e '/^[^#]/w /dev/stdout'"
git rebase -i HEAD~4
git log --oneline
ls

#@step reword
#@hide
git config sequence.editor "sed -i -e '1s/^pick/reword/' -e '/^[^#]/w /dev/stdout'"
#@hide
git config core.editor "sed -i '1s/.*/Note when the chorus starts/'"
git rebase -i HEAD~1
git log --oneline

#@step squash
#@hide
git config sequence.editor "sed -i -e '2s/^pick/squash/' -e '/^[^#]/w /dev/stdout'"
#@hide
git config core.editor true
git rebase -i HEAD~2
git log --oneline
git log -1

#@step autosquash
#@hide
printf "%s\n" "" "## Bridge" "- slide left x2" >> routine.md
#@hide
git commit -q -am "Add bridge moves"
sed -i "s/0:45/0:48/" music.txt
git add music.txt
git commit --fixup=HEAD~1
git log --oneline
#@hide
git config sequence.editor "sed -n '/^[^#]/p'"
git rebase -i --autosquash HEAD~3
git log --oneline
