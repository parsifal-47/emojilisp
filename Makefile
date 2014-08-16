setup:
	npm install

rebuild-lex:
	node rebuild

run:
	node eli

test:
	@./node_modules/buster/bin/buster-test

.PHONY: test
