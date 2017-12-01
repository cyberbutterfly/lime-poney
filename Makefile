ifeq ($(findstring dev,$(MAKECMDGOALS)),)
PROD_FLAG = -p
endif

ifeq ($(findstring demo,$(MAKECMDGOALS)),)
BUILD_TYPE = prod
else
BUILD_TYPE = demo
endif

VERSION ?= patch

export PATH := ./node_modules/.bin:${PATH}

package: build _package

build: _clean _build

clean: _clean

serve: _serve

test: _test

deps: _deps

stats: _stats

publish: build _version _package _publish

link: build _version _package _link

refresh: _build _copy_assets

# Empty "variable setting" targets
dev: ;
demo: ;

# Real commands
_clean:
	rm -rf ./dist
	rm -rf ./package

_deps:
	npm install

_serve: _deps
_serve:
	webpack-dev-server --progress --inline ${PUBLIC}

_test: _deps
_test:
	jest

_build: _deps
	BUILD_TYPE=$(BUILD_TYPE) webpack --progress --profile $(PROD_FLAG)

_copy_assets:
	cp -rf ./assets ./src ./package.json .npmignore ./dist/

_package: _deps _copy_assets
	mkdir package
	cd package && npm pack ../dist/

_version: _deps
	npm version $(VERSION)

_publish: _deps
	npm publish ./dist/

_link: _deps
	cd ./dist/
	npm link

_stats:
	BUILD_TYPE=$(BUILD_TYPE) webpack  $(PROD_FLAG) --json > stats.json
