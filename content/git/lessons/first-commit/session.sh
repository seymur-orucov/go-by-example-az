#@hide
mkdir portfolio
#@hide
cd portfolio
#@hide
git init -q
#@hide
echo "<h1>Sam Lee</h1>" > index.html
#@hide
echo "h1 { color: navy; }" > style.css

#@step status
git status

#@step add-file
git add index.html
git status

#@step add-all
git add .
git status --short

#@step commit
git commit -m "Add home page"

#@step commit-all
echo "h2 { color: teal; }" >> style.css
echo "<h1>About me</h1>" > about.html
git commit -am "Style subheadings"
git status --short
