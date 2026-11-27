#@hide
mkdir calculator
#@hide
cd calculator
#@hide
git init -q
#@hide
echo "def add(a, b): return a + b" > calc.py
#@hide
echo "# Changelog" > CHANGELOG.md
#@hide
git add .
#@hide
git commit -q -m "Add calculator"
#@hide
echo "def div(a, b): return a / b" >> calc.py
#@hide
sed -i '1a - 1.0.0: add and divide' CHANGELOG.md
#@hide
git commit -q -am "Add division"

#@step lightweight
git tag v1.0.0
git tag
cat .git/refs/tags/v1.0.0
git log --oneline --decorate

#@step stays
#@hide
sed -i 's|a / b|a / b if b else None|' calc.py
#@hide
sed -i '1a - 1.0.1: fix division by zero' CHANGELOG.md
git commit -am "Fix division by zero"
git log --oneline --decorate

#@step annotated
git tag -a v1.0.1 -m "Release 1.0.1: fix division by zero"
git tag
git cat-file -t v1.0.0
git cat-file -t v1.0.1

#@step show
git show v1.0.1

#@step semver
echo "def pct(a, b): return a * b / 100" >> calc.py
#@hide
sed -i '1a - 1.1.0: add percent' CHANGELOG.md
git commit -am "Add percent function"
git tag -a v1.1.0 -m "Release 1.1.0: add percent"
cat CHANGELOG.md
git log --oneline --decorate
