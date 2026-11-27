#@hide
git init -q --bare ~/server/charity-run.git
#@hide
git clone -q ~/server/charity-run.git ~/ayla/charity-run
#@hide
cd ~/ayla/charity-run
#@hide
printf "%s\n" "<h1>Charity Run</h1>" "<p>Date: May 24</p>" > index.html
#@hide
printf "%s\n" "5 km: Park loop" > routes.txt
#@hide
git add .
#@hide
git -c user.name="Ayla Karimova" -c user.email="ayla@example.com" commit -q -m "Start the registration page"
#@hide
git push -q origin main
#@hide
cd ~
#@hide
git clone -q ~/server/charity-run.git
#@hide
cd ~/ayla/charity-run
#@hide
echo "10 km: River path" >> routes.txt
#@hide
git -c user.name="Ayla Karimova" -c user.email="ayla@example.com" commit -q -am "Add the 10 km route"
#@hide
echo "<p>Entry fee: 15 USD</p>" >> index.html
#@hide
git -c user.name="Ayla Karimova" -c user.email="ayla@example.com" commit -q -am "Add the entry fee"
#@hide
git push -q origin main
#@hide
git switch -q -c feat/tshirt-sizes
#@hide
printf "%s\n" "S" "M" "L" "XL" > sizes.txt
#@hide
git add sizes.txt
#@hide
git -c user.name="Ayla Karimova" -c user.email="ayla@example.com" commit -q -m "Add T-shirt sizes"
#@hide
git push -q origin feat/tshirt-sizes
#@hide
cd ~/charity-run

#@step fetch
git fetch
git status

#@step look
git log --oneline HEAD..origin/main
git diff --stat HEAD...origin/main
git diff HEAD...origin/main -- index.html

#@step merge
git merge origin/main
git status

#@step remote-branches
git branch -r
git log --oneline main..origin/feat/tshirt-sizes

#@step prune
#@hide
cd ~/ayla/charity-run
#@hide
git push -q origin --delete feat/tshirt-sizes
#@hide
cd ~/charity-run
git fetch
git branch -r
git fetch --prune
git branch -r
