#@hide
mkdir notes-site
#@hide
cd notes-site
#@hide
git init -q
#@hide
printf '%s\n' '# Notes' 'Short notes on what I learn.' > index.md
#@hide
git add index.md
#@hide
git commit -q -m "Start notes site"
#@hide
printf '%s\n' '# About' 'I write about Go and Git.' 'TODO: add contact link' > about.md

#@step write-hook
printf '%s\n' '#!/bin/sh' 'if git diff --cached | grep "^+.*TODO"; then' '  echo "TODO found: commit stopped"' '  exit 1' 'fi' > .git/hooks/pre-commit
chmod +x .git/hooks/pre-commit
cat .git/hooks/pre-commit

#@step blocked
git add about.md
git commit -m "Add about page" #@fail
git status --short

#@step staged-only
sed -i '/TODO/d' about.md
git commit -m "Add about page" #@fail
git status --short

#@step commit-ok
git add about.md
git commit -m "Add about page"

#@step no-verify
echo "TODO: add photos" >> index.md
git commit --no-verify -am "Start photo section"
