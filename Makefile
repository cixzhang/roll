all: clean dist

dist:
	-mkdir dist
	cp manifest.json dist
	cp -r assets dist/assets
	cp -r vendor dist/vendor
	cp lib/background.js dist
	cp lib/roll.html dist
	npm run build

roll.zip: clean dist
	zip -r roll.zip dist

clean:
	-rm -r dist
	-rm lib/templates/templates.js

test:
	npm run test

.PHONY: test clean