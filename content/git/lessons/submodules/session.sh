#@hide
git config --global protocol.file.allow always
#@hide
mkdir ayla
#@hide
cd ayla
#@hide
git init -q ui-kit
#@hide
cd ui-kit
#@hide
echo ".btn { padding: 8px 16px; }" > button.css
#@hide
git add button.css
#@hide
git -c user.name="Ayla Karimova" -c user.email="ayla@example.com" commit -q -m "Add button styles"
#@hide
echo ".card { border-radius: 8px; }" > card.css
#@hide
git add card.css
#@hide
git -c user.name="Ayla Karimova" -c user.email="ayla@example.com" commit -q -m "Add card styles"
#@hide
git clone -q --bare ~/ayla/ui-kit ~/server/ui-kit.git
#@hide
cd ~
#@hide
mkdir brand-site
#@hide
cd brand-site
#@hide
git init -q
#@hide
echo "<h1>Brand</h1>" > index.html
#@hide
git add index.html
#@hide
git commit -q -m "Add home page"

#@step add
git submodule add ~/server/ui-kit.git ui-kit
#@hide
MSYS_NO_PATHCONV=1 git config -f .gitmodules submodule.ui-kit.url /home/sam/server/ui-kit.git
#@hide
git add .gitmodules
git status
cat .gitmodules

#@step gitlink
git commit -m "Add ui-kit submodule"
git ls-tree HEAD
cd ui-kit
git log --oneline
cd ..

#@step moved
cd ui-kit
echo ".badge { font-size: 12px; }" > badge.css
git add badge.css
git commit -m "Add badge styles"
git push
cd ..
git status
git diff
git diff --submodule

#@step pin
git add ui-kit
git commit -m "Use badge styles from ui-kit"
git ls-tree HEAD ui-kit

#@step subtree
git ls-tree -r --name-only HEAD
