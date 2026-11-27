#@hide
mkdir smart-home
#@hide
cd smart-home
#@hide
git init -q
#@hide
printf "#!/bin/sh\necho \"Lights on\"\n" > lights.sh
#@hide
git add lights.sh
#@hide
git commit -q -m "Add lights script"
#@hide
printf "HUB_URL=http://192.168.1.20\nAPI_KEY=hk-7Q2m9Xa4\n" > config.env
#@hide
echo ". ./config.env" >> lights.sh
#@hide
git add .
#@hide
git commit -q -m "Load settings from config.env"
#@hide
printf "#!/bin/sh\necho \"Heating to 21C\"\n" > heating.sh
#@hide
git add heating.sh
#@hide
git commit -q -m "Add heating script"
#@hide
echo "echo \"Dim at 22:00\"" >> lights.sh
#@hide
git commit -q -am "Dim lights at night"

#@step delete-not-enough
git log --oneline
git rm config.env
git commit -q -m "Remove config.env"
git log --oneline -- config.env
git show HEAD~3:config.env

#@step rotate-key
# Revoke the leaked key in the hub's settings and create a new one.
# The new key lives only in the local config.env:
printf "HUB_URL=http://192.168.1.20\nAPI_KEY=hk-Rb83Lw5T\n" > config.env
echo "config.env" > .gitignore
printf "HUB_URL=http://192.168.1.20\nAPI_KEY=your-key-here\n" > config.env.example
git add .gitignore config.env.example
git commit -q -m "Ignore config.env, add an example"
git status --short --ignored

#@step filter-branch
FILTER_BRANCH_SQUELCH_WARNING=1 git filter-branch --prune-empty --index-filter 'git rm --cached --ignore-unmatch config.env' -- --all | tail -n 1
git log --oneline
git log --oneline -- config.env

#@step backup-ref
git log --oneline --all -- config.env
git update-ref -d refs/original/refs/heads/main
git log --oneline --all -- config.env

#@step filter-repo
# In a real project, use git filter-repo. It is a separate install:
#   pip install git-filter-repo
# Run it in a fresh clone of the repository:
#   git filter-repo --path config.env --invert-paths
# Then force push, and everyone clones the repository again.
