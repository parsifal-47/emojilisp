setup:
	npm install

rebuild:
	node rebuild

clean:
	rm examples/*

run:
	node interactive $(filter-out $@,$(MAKECMDGOALS))

test:
	@./node_modules/buster/bin/buster-test

.PHONY: test
