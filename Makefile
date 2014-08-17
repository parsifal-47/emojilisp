setup:
	npm install

rebuild:
	node rebuild

run:
	node interactive

test:
	@./node_modules/buster/bin/buster-test

.PHONY: test
