#@hide
mkdir club-site
#@hide
cd club-site
#@hide
git init -q
#@hide
printf "%s\n" "<h1>Training schedule</h1>" "<p>Monday 18:00 football</p>" "<p>Wednesday 18:00 basketball</p>" "<p>Saturday 10:00 swimming</p>" > schedule.html
#@hide
git add schedule.html
#@hide
git commit -q -m "Add the training schedule"
#@hide
printf "%s\n" "Home" "Schedule" "Contacts" > menu.txt
#@hide
printf "%s\n" "phone: +1 555 0199" "email: info@club.example" > contacts.txt
#@hide
git add menu.txt contacts.txt
#@hide
git commit -q -m "Add the menu and contacts"
#@hide
git branch release/1.0
#@hide
echo "<h1>Gallery</h1>" > gallery.html
#@hide
printf "%s\n" "Home" "Schedule" "Gallery" "Contacts" > menu.txt
#@hide
git add gallery.html menu.txt
#@hide
git commit -q -m "Add the gallery page"
#@hide
sed -i "s/0199/0100/" contacts.txt
#@hide
git commit -q -am "Fix the phone number"
#@hide
echo "<h1>Shop</h1>" > shop.html
#@hide
printf "%s\n" "Home" "Schedule" "Gallery" "Shop" "Contacts" > menu.txt
#@hide
git add shop.html menu.txt
#@hide
git commit -q -m "Add the shop page"

#@step find
git switch release/1.0
cat contacts.txt
git log --oneline release/1.0..main

#@step pick
git cherry-pick main~1
cat contacts.txt
ls

#@step new-commit
git log -1 main~1
git log -1 release/1.0

#@step range
#@hide
git switch -q main
#@hide
sed -i "s/Saturday 10:00/Saturday 11:00/" schedule.html
#@hide
git commit -q -am "Fix the Saturday time"
#@hide
sed -i "s/Wednesday 18:00/Wednesday 19:00/" schedule.html
#@hide
git commit -q -am "Fix the Wednesday time"
#@hide
git switch -q release/1.0
git cherry-pick -x main~2..main
git log -1

#@step conflict
git cherry-pick ":/Add the shop" #@fail
cat menu.txt
git cherry-pick --abort
git status
