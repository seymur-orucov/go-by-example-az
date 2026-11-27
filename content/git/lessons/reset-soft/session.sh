#@hide
mkdir glossary
#@hide
cd glossary
#@hide
git init -q
#@hide
printf "term,meaning\ninvoice,a request for payment\n" > terms.csv
#@hide
git add terms.csv
#@hide
git commit -q -m "Start glossary"
#@hide
echo "refund,money paid bak" >> terms.csv
#@hide
git commit -q -am "Add refund"
#@hide
sed -i "s/bak$/back/" terms.csv
#@hide
git commit -q -am "Fix typo"
#@hide
echo "refund: a noun, not a verb" > notes.md
#@hide
git add notes.md
#@hide
git commit -q -m "Add note on refund"

#@step move
git log --oneline
git reset --soft HEAD~1
git log --oneline

#@step staged
git status

#@step recommit
echo "refund: keep it short on buttons" >> notes.md
git add notes.md
git commit -m "Add notes on refund"
git log --oneline

#@step squash
git reset --soft HEAD~3
git status --short

#@step squash-commit
git commit -m "Add refund term"
git log --oneline
