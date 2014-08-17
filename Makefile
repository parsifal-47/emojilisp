setup:
	npm install

rebuild:
	node rebuild

clean:
	rm examples/*

run:
	node interactive

test:
	@./node_modules/buster/bin/buster-test

.PHONY: test
