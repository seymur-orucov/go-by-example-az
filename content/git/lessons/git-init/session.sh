#@step init
mkdir cv
cd cv
echo "# Sam Lee" > cv.md
git init
ls -A

#@step inside
ls .git
cat .git/HEAD

#@step reinit
git init

#@step remove
rm -rf .git
git status #@fail
ls -A
