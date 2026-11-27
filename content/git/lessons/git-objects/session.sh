#@hide
mkdir haiku
#@hide
cd haiku
#@hide
git init -q
#@hide
echo "Cherry blossoms fall" > spring.txt
#@hide
echo "Red leaves on the path" > autumn.txt
#@hide
mkdir drafts
#@hide
echo "Snow on the roof" > drafts/winter.txt
#@hide
git add .
#@hide
git commit -q -m "Add first haiku"
#@hide
git tag -a v1 -m "First edition"

#@step porcelain
git log --oneline
git rev-parse HEAD
git cat-file -t HEAD

#@step objects
find .git/objects -type f | sort
git cat-file --batch-all-objects --batch-check

#@step hash
git ls-tree HEAD spring.txt
git hash-object spring.txt
find .git/objects -type f | wc -l
echo "First frost" | git hash-object --stdin
find .git/objects -type f | wc -l
echo "First frost" | git hash-object -w --stdin
find .git/objects -type f | wc -l

#@step chain
cat .git/HEAD
git rev-parse main
git cat-file -p main
git cat-file -p HEAD^{tree}
git cat-file -p HEAD:drafts
git cat-file -p HEAD:drafts/winter.txt

#@step new-commit
echo "Warm wind" >> spring.txt
git commit -am "Extend spring haiku"
find .git/objects -type f | wc -l
git cat-file -p HEAD^{tree}
