#@hide
mkdir cli-tool
#@hide
cd cli-tool
#@hide
git init -q
#@hide
printf '%s\n' '#!/bin/sh' 'wc -w "$1"' > main.sh
#@hide
git add main.sh
#@hide
git commit -q -m "feat: count words in a file"

#@step message-file
printf '%s\n' '#!/bin/sh' 'echo "Message file: $1"' 'cat "$1"' > .git/hooks/commit-msg
chmod +x .git/hooks/commit-msg
echo "Usage: ./main.sh FILE" > README.md
git add README.md
git commit -m "docs: add usage to README"

#@step check
printf '%s\n' '#!/bin/sh' 'if ! head -n1 "$1" | grep -Eq "^(feat|fix|docs|refactor|test|chore)(\(.+\))?!?: .+"; then' '  echo "commit-msg: use type(scope): description"' '  echo "example: fix(cli): handle empty input"' '  exit 1' 'fi' > .git/hooks/commit-msg
cat .git/hooks/commit-msg

#@step blocked
echo 'wc -l "$1"' >> main.sh
git add main.sh
git commit -m "update stuff" #@fail
git status --short

#@step valid
git commit -m "feat(cli): print the line count"
git log --oneline
