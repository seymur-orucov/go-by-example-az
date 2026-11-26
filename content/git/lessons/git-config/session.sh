#@hide
rm ~/.gitconfig

#@step identity
git config --global user.name "Sam Lee"
git config --global user.email "sam@example.com"

#@step default-branch
git config --global init.defaultBranch main

#@step read
git config user.name
git config --global --list

#@step local
mkdir client-site
cd client-site
#@hide
git init -q
git config user.email "sam@work.example"
git config --show-origin user.email
cd ..
git config --show-origin user.email
