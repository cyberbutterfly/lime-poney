ifeq ($(findstring dev,$(MAKECMDGOALS)),)
PROD_FLAG = -p
endif

ifeq ($(findstring demo,$(MAKECMDGOALS)),)
BUILD_TYPE = prod
else
BUILD_TYPE = demo
endif

export PATH := ./node_modules/.bin:${PATH}

package: build _package

build: _clean _build

clean: _clean

serve: _serve

test: _test

deps: _deps

stats: _stats

publish: build _version _package _publish

# Empty "variable setting" targets
dev: ;
demo: ;

# Real commands
_clean:
	rm -rf ./dist
	rm -rf ./package

_deps:
	yarn install

_serve: _deps
_serve:
	webpack-dev-server --progress --inline ${PUBLIC}

_test: _deps
_test:
	mocha --opts mocha.opts

_build: _deps
	BUILD_TYPE=$(BUILD_TYPE) webpack --progress --profile $(PROD_FLAG)

_package: _deps
	mkdir package
	cp -rf ./assets/ ./src/ ./package.json yarn.lock .npmignore ./dist/
	cd package; npm pack ../dist/

_version: _deps
	yarn version

_publish: _deps
	npm publish ./dist/

_stats:
	BUILD_TYPE=$(BUILD_TYPE) webpack  $(PROD_FLAG) --json > stats.json
