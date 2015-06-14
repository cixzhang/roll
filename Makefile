all: clean dist

dist:
	cp -r lib dist
	cp manifest.json dist

clean:
	-rm -rf dist

test:
	./node_modules/.bin/mocha --reporter spec

.PHONY: test clean